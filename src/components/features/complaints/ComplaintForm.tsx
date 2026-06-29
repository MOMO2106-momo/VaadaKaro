'use client';

import { useState, useEffect } from 'react';
import styles from './ComplaintForm.module.css';
import { Check, ChevronRight, ChevronLeft, Upload, Shield, AlertCircle, Loader2, Sparkles, FileText, Search, PenTool, CheckCircle2, MapPin } from 'lucide-react';
import { submitComplaint } from '@/lib/actions/complaintActions';
import { analyzeComplaint } from '@/lib/actions/complaint-analysis';
import { getCloudinarySignature, uploadFileToCloudinary } from '@/lib/actions/uploadActions';
import LocationPicker from './LocationPicker';

const DEPARTMENTS = [
  'Police', 'Municipal Corporation', 'Electricity', 'Water Supply',
  'Road & Infrastructure', 'Cyber Crime', 'Consumer Court',
  'Women Safety', 'Other'
];

const CATEGORIES: Record<string, string[]> = {
  'Police': ['Theft', 'Assault', 'Missing Person', 'Public Nuisance', 'Traffic Violation'],
  'Municipal Corporation': ['Waste Management', 'Illegal Construction', 'Stray Animals', 'Park Maintenance'],
  'Electricity': ['Power Cut', 'Faulty Meter', 'Voltage Fluctuating', 'New Connection Issue'],
  'Water Supply': ['No Water', 'Leaking Pipe', 'Contaminated Water', 'Billing Issue'],
  'Cyber Crime': ['Online Fraud', 'Social Media Harassment', 'Identity Theft', 'Phishing'],
  'Other': ['General Inquiry', 'Miscellaneous']
};

export const ComplaintForm = ({
  onSuccess
}: {
  onSuccess: (data: { trackingId: string, department: string }) => void
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    category: '',
    priority: 'MEDIUM',
    state: '',
    city: '',
    pincode: '',
    address: '',
    declaration: false,
    aiDisclaimer: false,
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [aiAcknowledged, setAiAcknowledged] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachmentWarning, setAttachmentWarning] = useState<string | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  // Draft persistence
  useEffect(() => {
    const draft = localStorage.getItem('vdk_complaint_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vdk_complaint_draft', JSON.stringify(formData));
  }, [formData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => {
        const isValidSize = file.size <= 10 * 1024 * 1024;
        const isValidType = ['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);
        return isValidSize && isValidType;
      });

      if (validFiles.length < selectedFiles.length) {
        setError("Some files were rejected (too large or invalid type).");
      }
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const uploadToCloudinary = async (file: File, sigData: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sigData.apiKey!);
    formData.append('timestamp', sigData.timestamp.toString());
    formData.append('signature', sigData.signature);
    formData.append('folder', 'vaadakaro_complaints');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Cloudinary upload failed");
    }
    return await res.json();
  };

  const handleAIAnalyze = async () => {
    if (!formData.description || !formData.title || !formData.department || !formData.category || aiLoading) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const result = await analyzeComplaint(
        formData.title,
        formData.description,
        formData.department,
        formData.category
      );
      setAiResult(result);
    } catch (err: any) {
      console.warn("AI Analysis failed:", err);
      const errorMessage = err.message === "Unauthorized"
        ? "Please log in to use Quality Verification"
        : "Quality check temporarily unavailable";

      setAiResult({
        feedback: errorMessage,
        reliabilityLevel: 'LOW',
        reliabilityScore: 0,
        missingDetails: []
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleFormalize = () => {
    if (!formData.description.trim()) return;
    const formattedDate = new Date().toLocaleDateString('en-IN');
    const cleaned = formData.description.charAt(0).toUpperCase() + formData.description.slice(1);
    const formalText = `Subject: Formal Civic Grievance Report\nDate: ${formattedDate}\n\nTo the Concerned Authority (${formData.department || 'Relevant Department'}) at ${formData.city || 'local jurisdiction'},\n\nThis is to formally report the following grievance regarding ${formData.category || 'civic issues'}:\n\n"${cleaned}"\n\nI kindly request your prompt attention to this matter and expect appropriate redressal under the standard civic operational guidelines.\n\nSincerely,\nA Concerned Citizen`;
    updateField('description', formalText);
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent, confirmDuplicate = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const uploadedAttachments = [];
      if (files.length > 0) {
        setUploading(true);
        for (const file of files) {
          try {
            // Convert to base64 for server-side upload
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
            const base64Content = await base64Promise;

            const uploadRes = await uploadFileToCloudinary(base64Content);

            if (uploadRes.url) {
              uploadedAttachments.push({
                url: uploadRes.url,
                filename: file.name,
                mimeType: file.type,
                fileSize: file.size,
              });
            } else {
              setAttachmentWarning("Attachment could not be uploaded, but your complaint was submitted successfully.");
            }
          } catch (fileErr) {
            console.error(`Failed to process ${file.name}:`, fileErr);
            setAttachmentWarning("Some attachments could not be uploaded.");
          }
        }
        setUploading(false);
      }

      const result = await submitComplaint({
        ...formData,
        declaration: declarationChecked,
        aiDisclaimer: aiAcknowledged,
        attachments: uploadedAttachments,
        confirmDuplicate
      });

      if (result.success) {
        localStorage.removeItem('vdk_complaint_draft');
        onSuccess({
          trackingId: result.trackingId!,
          department: result.department!
        });
      } else {
        if (result.isDuplicate) {
          setShowDuplicateWarning(true);
        }
        setError(result.error || "An unexpected error occurred.");
      }
    } catch (err: any) {
      setError(err.message || "File upload failed. Please try again.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentCategories = formData.department ? CATEGORIES[formData.department] || CATEGORIES['Other'] : [];

  const STEP_LABELS = ['Categorization', 'Step 2: Details', 'Evidence', 'Review'];

  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium";
  const labelClasses = "block text-sm font-semibold text-slate-700 mb-2";
  return (
    <div className="w-full relative">
      <div className="flex flex-col w-full">

        {/* Horizontal progress stepper */}
        <div className="flex justify-between items-center w-full mb-8">
          {[1, 2, 3, 4].map((s, idx) => (
            <div key={s} className="flex flex-col items-center flex-1 relative group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 bg-white ${step > s
                  ? "border-blue-500 bg-blue-500 text-white shadow-xl"
                  : step === s
                    ? "border-blue-400 text-blue-500 ring-4 ring-blue-50"
                    : "border-slate-200 text-slate-400"
                }`}>
                {step > s ? <Check size={18} strokeWidth={3} /> : s}
              </div>
              <span className={`mt-3 text-xs font-semibold text-center transition-colors duration-300 ${step === s ? "text-blue-500" : step > s ? "text-slate-800" : "text-slate-400"
                }`}>
                {STEP_LABELS[idx]}
              </span>

              {/* Connecting line */}
              {s !== 4 && (
                <div className={`hidden sm:block absolute top-5 left-1/2 w-full h-[2px] -z-10 ${step > s ? "bg-blue-500" : "bg-slate-100"
                  }`} style={{ transform: 'translateX(50%)', width: '100%' }}></div>
              )}
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="flex flex-col w-full space-y-6">

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Describe the Issue</h2>
                <p className="text-slate-600 mt-2 text-sm">Describe your grievance clearly. Provide as much detail as possible to assist the evaluating officer.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={labelClasses}>Subject / Title of Complaint</label>
                  <div className="relative">
                    <input
                      type="text"
                      className={inputClasses}
                      placeholder="Brief subject of your complaint (min. 3 characters)"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                    />
                    {formData.title.length >= 3 && <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
                  </div>
                  <small className={formData.title.length > 0 && formData.title.length < 3 ? "text-rose-500 mt-1 block" : "text-slate-500 mt-1 block"}>
                    {formData.title.length} / 150 characters {formData.title.length > 0 && formData.title.length < 3 && "— too short"}
                  </small>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Concerned Department</label>
                    <div className="relative">
                      <select
                        className={`${inputClasses} appearance-none cursor-pointer`}
                        value={formData.department}
                        onChange={(e) => updateField('department', e.target.value)}
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {formData.department && <CheckCircle2 size={18} className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />}
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Grievance Category</label>
                    <div className="relative">
                      <select
                        className={`${inputClasses} appearance-none ${!formData.department ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        value={formData.category}
                        onChange={(e) => updateField('category', e.target.value)}
                        disabled={!formData.department}
                      >
                        <option value="">Select Category</option>
                        {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {formData.category && <CheckCircle2 size={18} className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />}
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Detailed Description</label>
                  <div className="relative">
                    <textarea
                      rows={5}
                      className={`${inputClasses} resize-y min-h-[120px]`}
                      placeholder="Please mention: 1. Date of incident, 2. People involved, 3. Previous attempts to resolve (if any)..."
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                    />
                    {formData.description.length >= 20 && <CheckCircle2 size={18} className="absolute right-4 top-4 text-emerald-500" />}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                      onClick={handleAIAnalyze}
                      disabled={!formData.description || !formData.title || !formData.department || !formData.category || aiLoading}
                    >
                      {aiLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                      {aiLoading ? "Analyzing Quality..." : "Run Quality Check"}
                    </button>
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                      onClick={handleFormalize}
                      disabled={!formData.description}
                    >
                      <PenTool size={16} />
                      Formalize with AI
                    </button>
                  </div>
                </div>

                {aiResult && (
                  <div className="mt-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                        <Shield size={16} className="text-emerald-500" />
                        AI Quality Audit
                      </div>
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${aiResult.reliabilityLevel === 'HIGH' ? "bg-emerald-100 text-emerald-700" :
                        aiResult.reliabilityLevel === 'MEDIUM' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                        }`}>
                        Reliability: {aiResult.reliabilityLevel || "LOW"} ({Math.round(aiResult.reliabilityScore || 0)}%)
                      </div>
                    </div>
                    <div className="p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <p>{aiResult.feedback}</p>
                      {aiResult.missingDetails?.length > 0 && (
                        <div className="mt-3 p-3 bg-white dark:bg-slate-950 rounded border border-rose-100 dark:border-rose-900/30">
                          <strong className="text-rose-600 dark:text-rose-400 block mb-1 text-xs uppercase">Required details missing:</strong>
                          <ul className="list-disc pl-5 space-y-1">
                            {aiResult.missingDetails.map((detail: string, i: number) => (
                              <li key={i}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Jurisdiction & Location</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Identify where the incident occurred. Adjust the pin below to auto-fill details.</p>
              </div>

              <div className="mb-8 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm h-[350px]">
                <LocationPicker
                  onLocationUpdate={(locData) => {
                    if (locData.latitude) updateField('latitude', locData.latitude);
                    if (locData.longitude) updateField('longitude', locData.longitude);
                    if (locData.address) updateField('address', locData.address);
                    if (locData.city) updateField('city', locData.city);
                    if (locData.state) updateField('state', locData.state);
                    if (locData.pincode) updateField('pincode', locData.pincode);
                  }}
                  initialLat={formData.latitude}
                  initialLng={formData.longitude}
                />
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>State / Union Territory</label>
                    <input type="text" className={inputClasses} placeholder="e.g. Haryana" value={formData.state} onChange={(e) => updateField('state', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClasses}>City / District</label>
                    <input type="text" className={inputClasses} placeholder="e.g. Gurugram" value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Postal Code (PIN)</label>
                  <input type="text" className={inputClasses} placeholder="6-digit PIN" value={formData.pincode} onChange={(e) => updateField('pincode', e.target.value)} />
                </div>

                <div>
                  <label className={labelClasses}>Precise Address / Landmark</label>
                  <textarea rows={3} className={inputClasses} placeholder="Street name, landmark..." value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Evidence Submission</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Upload images, PDFs, or documents to strengthen your complaint.</p>
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-10 flex flex-col items-center justify-center text-center relative hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                <Upload size={48} className="text-emerald-500 mb-4 group-hover:-translate-y-1 transition-transform" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  {files.length > 0 ? `${files.length} document(s) ready` : 'Drag and drop files here'}
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">Supported: PDF, JPG, PNG (Max size: 10MB)</p>
                <button className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold shadow-sm text-slate-700 dark:text-slate-300 pointer-events-none">
                  Select Files
                </button>
                <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
              </div>

              {files.length > 0 && (
                <div className="mt-6 flex flex-col gap-3">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-500" size={24} />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                          <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button type="button" className="text-xs font-semibold text-rose-500 hover:text-rose-700 px-3 py-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-500/10 transition" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Final Review</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Verify your information before officially submitting to the department.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Subject</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formData.title || <span className="text-slate-400 italic">Not specified</span>}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Authority</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formData.department ? `${formData.department} — ${formData.category}` : <span className="text-slate-400 italic">Not specified</span>}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Location</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formData.city || formData.pincode ? `${formData.city}, ${formData.pincode}` : <span className="text-slate-400 italic">Not specified</span>}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Attachments</label>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{files.length} ready for upload</p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5 space-y-4">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-amber-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0" checked={declarationChecked} onChange={(e) => setDeclarationChecked(e.target.checked)} />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-amber-100 block mb-0.5">Statutory Declaration</span>
                    <span className="text-sm text-slate-700 dark:text-amber-200/80 leading-snug">I solemnly affirm that the facts stated in this grievance are true. Providing false information is an offense under Section 182 IPC.</span>
                  </div>
                </label>
                <div className="h-px bg-amber-200/50 dark:bg-amber-800/50 w-full"></div>
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-amber-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0" checked={aiAcknowledged} onChange={(e) => setAiAcknowledged(e.target.checked)} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-amber-200/80 leading-relaxed">
                    I acknowledge that AI-generated assistance does not constitute formal legal representation.
                  </span>
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center w-full border-t border-slate-100 pt-6 mt-8">
          <button type="button" className={`w-full sm:w-auto justify-center px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors border border-slate-200 ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-700 bg-white hover:bg-slate-50 shadow-sm'}`} onClick={handleBack}>
            <ChevronLeft size={18} /> Previous
          </button>

          {step < 4 ? (
            <button type="button" className="w-full sm:w-auto justify-center px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all" onClick={handleNext}>
              Save & Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button type="button" className="w-full sm:w-auto justify-center px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:translate-y-0" disabled={!declarationChecked || !aiAcknowledged || loading} onClick={handleSubmit}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />}
              Submit to Department
            </button>
          )}
        </div>
      </div>

      {attachmentWarning && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400 font-semibold text-sm rounded-xl flex items-center gap-3">
          <AlertCircle size={20} /> {attachmentWarning}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-400 font-semibold text-sm rounded-xl flex items-center gap-3">
          <AlertCircle size={20} /> {error}
        </div>
      )}

    </div>
  );
};


