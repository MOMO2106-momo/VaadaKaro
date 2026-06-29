"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Shield, Loader2, Info, User, Paperclip, CheckCircle, Phone } from "lucide-react";

import WizardShell from "@/components/wizard/WizardShell";
import HorizontalStepper from "@/components/wizard/HorizontalStepper";
import StepOne from "@/components/wizard/StepOne";
import StepTwo from "@/components/wizard/StepTwo";
import StepThree from "@/components/wizard/StepThree";
import StepFour from "@/components/wizard/StepFour";
import SuccessScreen from "@/components/wizard/SuccessScreen";
import GlobalFooter from "@/components/layout/GlobalFooter";

import type { WizardFormData, UploadedFile, AiResult } from "@/types/wizard";
import { TOTAL_STEPS, EMPTY_FORM_DATA } from "@/types/wizard";
import { submitComplaint } from "@/lib/actions/complaintActions";

export default function FileComplaintWizardPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [aiAcknowledged, setAiAcknowledged] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WizardFormData>(EMPTY_FORM_DATA);

  // Draft Logic
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vdk_wizard_draft");
      if (raw) {
        setFormData((prev) => ({ ...prev, ...JSON.parse(raw) }));
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("vdk_wizard_draft", JSON.stringify(formData));
    } catch {
      // silent
    }
  }, [formData]);

  const update = (field: keyof WizardFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => { setError(null); setStep((prev) => Math.min(prev + 1, TOTAL_STEPS)); };
  const handleBack = () => { setError(null); setStep((prev) => Math.max(prev - 1, 1)); };

  const handleAnalyze = async () => {
    if (!formData.description || !formData.title || !formData.department || aiLoading) return;
    setAiLoading(true); setAiResult(null);
    await new Promise((r) => setTimeout(r, 1400));
    setAiResult({
      feedback: "Your complaint appears factual and specific. The description has enough detail for the officer to take action. Consider adding the exact date and time of the incident for a stronger case.",
      reliabilityLevel: "HIGH",
      reliabilityScore: 84,
      missingDetails: formData.description.length < 80 ? ["Exact date and time of incident", "Names of witnesses if any"] : [],
    });
    setAiLoading(false);
  };

  const handleFormalize = () => {
    if (!formData.description.trim()) return;
    const date = new Date().toLocaleDateString("en-IN");
    const text = `Subject: Formal Civic Grievance Report\nDate: ${date}\n\nTo the Concerned Authority (${formData.department || "Relevant Department"}) at ${formData.city || "the concerned locality"},\n\nThis is to formally report the following grievance regarding ${formData.category || "civic issues"}:\n\n"${formData.description.charAt(0).toUpperCase() + formData.description.slice(1)}"\n\nI respectfully request your prompt attention and expect appropriate redressal under standard civic operational guidelines.\n\nSincerely,\n${formData.fullName || "A Concerned Citizen"}`;
    update("description", text);
  };

  const handleSubmit = async () => {
    if (!declarationChecked || !aiAcknowledged) return;
    setLoading(true); setError(null);
    try {
      const res = await submitComplaint({
        title: formData.title, description: formData.description, department: formData.department,
        category: formData.category, priority: formData.priority || "MEDIUM", address: formData.address || "N/A",
        city: formData.city || "N/A", state: formData.state || "N/A", pincode: formData.pincode || "000000",
        declaration: true, aiDisclaimer: true,
        latitude: formData.latitude, longitude: formData.longitude,
        attachments: files.map(f => ({ url: "https://example.com/mock-upload", filename: f.name, mimeType: f.type, fileSize: f.size }))
      });
      if (res.success) {
        if (res.trackingId) setTrackingId(res.trackingId);
        setSubmitted(true);
        try { localStorage.removeItem("vdk_wizard_draft"); } catch { }
      } else {
        setError(res.error ? String(res.error) : "Failed to submit.");
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false); setTrackingId(null); setStep(1); setFiles([]); setDeclarationChecked(false); setAiAcknowledged(false); setAiResult(null); setFormData(EMPTY_FORM_DATA);
  };

  if (submitted && trackingId) {
    return <SuccessScreen trackingId={trackingId} department={formData.department} onReset={handleReset} />;
  }

  return (
    <WizardShell>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-100 font-sans transition-colors duration-300">

        <main className="flex-1 w-full py-8 lg:py-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="w-full flex flex-col" style={{ maxWidth: '1100px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>

            {/* HEADER SECTION */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6" style={{ marginTop: '0.5rem' }}>
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Lodge a Formal Grievance
                </h1>
                <p className="text-[15px] font-bold text-slate-500 dark:text-slate-400">
                  VaadaKaro • National Citizen Redressal Portal
                </p>
              </div>
            </header>

            {/* GREEN NOTICE BAR */}
            <div className="w-full bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-5 py-3.5 flex items-center gap-3 text-emerald-700 dark:text-emerald-400 text-[13.5px] font-semibold mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <span>Note: Filing false complaints is a punishable offense under IPC Section 182. Ensure all information is accurate and truthful.</span>
            </div>

            {/* HORIZONTAL STEPPER */}
            <HorizontalStepper step={step} />

            {/* TWO COLUMN GRID STRUCTURE (FORM : SIDECARDS) */}
            <section className="grid grid-cols-1 xl:grid-cols-[1fr_340px] items-start" style={{ gap: '2.5rem', marginTop: '1.5rem' }}>

              {/* LEFT COLUMN: MAIN FORM WORKSPACE */}
              <div className="flex flex-col bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 lg:p-10 shadow-sm relative w-full overflow-hidden min-h-[550px]">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />

                {/* FORM CONTROLLER */}
                <div className="flex flex-col flex-1">
                  {step === 1 && <StepOne formData={formData} update={update} aiResult={aiResult} aiLoading={aiLoading} onAnalyze={handleAnalyze} onFormalize={handleFormalize} />}
                  {step === 2 && <StepTwo formData={formData} update={update} />}
                  {step === 3 && <StepThree files={files} onFilesChange={setFiles} />}
                  {step === 4 && (
                    <StepFour
                      formData={formData}
                      files={files}
                      declarationChecked={declarationChecked}
                      aiAcknowledged={aiAcknowledged}
                      setDeclarationChecked={setDeclarationChecked}
                      setAiAcknowledged={setAiAcknowledged}
                    />
                  )}

                  {error && (
                    <div className="mt-6 p-5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[13.5px] text-rose-500 dark:text-rose-400 font-bold flex items-start gap-3 shadow-sm">
                      <span className="shrink-0 mt-0.5">⚠️</span> <span className="leading-relaxed">{error}</span>
                    </div>
                  )}
                </div>

                {/* WORKFLOW CONTROLS INSIDE CARD */}
                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 w-full flex justify-between items-center" style={{ paddingBottom: '0.5rem' }}>
                  {/* Save as Draft Button */}
                  <button
                    type="button"
                    onClick={() => {
                      alert("Draft saved to browser local storage!");
                    }}
                    className="flex items-center gap-2 px-5 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold text-[13.5px] uppercase tracking-wide transition-all"
                  >
                    🔖 Save as Draft
                  </button>

                  {step < TOTAL_STEPS ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[13.5px] uppercase tracking-wide transition-all shadow-md shadow-emerald-600/10"
                    >
                      Save &amp; Continue <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!declarationChecked || !aiAcknowledged || loading}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-[13.5px] uppercase tracking-wide transition-all shadow-md shadow-emerald-600/10"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Shield size={16} />
                      )}
                      Submit Complaint
                    </button>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: SIDECARDS */}
              <div className="flex flex-col gap-6">
                {/* Tips Card */}
                <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-[14px] font-bold text-slate-850 dark:text-white flex items-center gap-2 mb-6 uppercase tracking-wider">
                    <span className="text-amber-500 text-base">💡</span> Tips for a Strong Complaint
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <User size={15} />
                      </div>
                      <div>
                        <h4 className="text-[13.5px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">Be Specific</h4>
                        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-normal font-medium">Mention exact location, time & nature of the issue</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Paperclip size={15} />
                      </div>
                      <div>
                        <h4 className="text-[13.5px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">Attach Proof</h4>
                        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-normal font-medium">Photos and documents increase chances of resolution</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle size={15} />
                      </div>
                      <div>
                        <h4 className="text-[13.5px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">Be Accurate</h4>
                        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-normal font-medium">Provide correct details. False info may lead to action</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Phone size={15} />
                      </div>
                      <div>
                        <h4 className="text-[13.5px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">Follow Up</h4>
                        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-normal font-medium">Track your complaint and respond to updates</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Need Help Card */}
                <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-[14px] font-bold text-slate-850 dark:text-white flex items-center gap-2 mb-3 uppercase tracking-wider">
                    <span className="text-emerald-500 text-base">🎧</span> Need Help?
                  </h3>
                  <p className="text-[13.5px] text-slate-500 dark:text-slate-400 leading-relaxed mb-5 font-medium">
                    Our support team is here to help you file your complaint.
                  </p>
                  <Link
                    href="/support"
                    className="w-full h-11 border border-emerald-500 hover:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold text-[12.5px] uppercase tracking-wider rounded-xl flex items-center justify-center transition-all"
                  >
                    View Help Center
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-3 px-2">
                  <CheckCircle className="text-emerald-500 shrink-0 w-5 h-5" />
                  <p className="text-[12px] text-slate-550 dark:text-slate-400 leading-snug font-medium">
                    Your data is secure with us.<br />We never share your personal information.
                  </p>
                </div>
              </div>

            </section>

            {/* PREVIOUS BUTTON OUTSIDE AT THE BOTTOM LEFT */}
            {step > 1 && (
              <div className="mt-6 flex justify-start">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-[13.5px] font-bold uppercase tracking-wider transition-colors"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
              </div>
            )}

          </div>
        </main>
        <div style={{ marginTop: '3rem' }}>
          <GlobalFooter />
        </div>
      </div>
    </WizardShell>
  );
}