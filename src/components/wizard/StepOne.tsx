"use client";

import { User, Building2, Hash, Sparkles, Loader2, PenTool, Shield, CheckCircle2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { WizardFormData, AiResult } from "@/types/wizard";
import { DEPARTMENTS, CATEGORIES } from "@/types/wizard";

interface StepOneProps {
    formData: WizardFormData;
    update: (field: keyof WizardFormData, value: string | boolean) => void;
    aiResult: AiResult | null;
    aiLoading: boolean;
    onAnalyze: () => void;
    onFormalize: () => void;
}

export default function StepOne({ formData, update, aiResult, aiLoading, onAnalyze, onFormalize }: StepOneProps) {
    const categories = formData.department ? (CATEGORIES[formData.department] ?? CATEGORIES["Other"]) : [];
    const titleError = formData.title.length > 0 && formData.title.length < 3 ? "Title too short (minimum 3 characters)" : undefined;

    return (
        <div className="flex flex-col space-y-8 w-full">

            <header className="space-y-2 border-b border-slate-200 dark:border-slate-800/60 pb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Describe the Issue</h2>
                <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium leading-relaxed max-w-3xl">
                    Provide an accurate, factual description of your grievance. This helps officers assess and act swiftly.
                </p>
            </header>

            {/* Input Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
                <Input
                    label="Full Name of Complainant"
                    required
                    type="text"
                    placeholder="Enter your full legal name"
                    value={formData.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    autoComplete="name"
                    icon={User}
                />

                <div className="relative">
                    <Input
                        label="Subject / Title of Complaint"
                        required
                        type="text"
                        placeholder="Brief, specific subject (e.g., Water leakage near Sector 5)"
                        value={formData.title}
                        maxLength={150}
                        onChange={(e) => update("title", e.target.value)}
                        error={titleError}
                    />
                    {formData.title.length >= 3 && (
                        <CheckCircle2 size={18} className="absolute right-4 top-[48px] text-emerald-550 dark:text-emerald-500 pointer-events-none" />
                    )}
                    <div className="flex justify-end mt-1.5">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                            {formData.title.length}/150 characters
                        </span>
                    </div>
                </div>
            </div>

            {/* Input Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
                <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-bold text-slate-700 dark:text-slate-300 ml-1">
                        Concerned Department <span className="text-rose-550">*</span>
                    </label>
                    <div className="relative">
                        <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500 pointer-events-none z-10" />
                        <select
                            id="department"
                            style={{ paddingLeft: "3.25rem" }}
                            className="appearance-none w-full h-[54px] pr-10 bg-slate-50 dark:bg-[#1A2234] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-[15px] font-medium cursor-pointer shadow-sm"
                            value={formData.department}
                            onChange={(e) => { update("department", e.target.value); update("category", ""); }}
                        >
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map((d) => (
                                <option key={d} value={d} className="bg-white dark:bg-[#1A2234] text-slate-900 dark:text-white">{d}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500 pointer-events-none" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[13.5px] font-bold text-slate-700 dark:text-slate-300 ml-1">
                        Grievance Category <span className="text-rose-550">*</span>
                    </label>
                    <div className="relative">
                        <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500 pointer-events-none z-10" />
                        <select
                            id="category"
                            style={{ paddingLeft: "3.25rem" }}
                            className={`appearance-none w-full h-[54px] pr-10 bg-slate-50 dark:bg-[#1A2234] border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-[15px] font-medium cursor-pointer shadow-sm ${!formData.department ? "opacity-55" : ""}`}
                            value={formData.category}
                            onChange={(e) => update("category", e.target.value)} 
                            disabled={!formData.department}
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c} value={c} className="bg-white dark:bg-[#1A2234] text-slate-900 dark:text-white">{c}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 dark:text-slate-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
                <label className="text-[13.5px] font-bold text-slate-700 dark:text-slate-300 ml-1">
                    Detailed Description <span className="text-rose-550">*</span>
                </label>
                <div className="relative">
                    <textarea
                        id="description" 
                        rows={8}
                        className="w-full bg-slate-50 dark:bg-[#1A2234] border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 text-[15px] font-medium text-slate-900 dark:text-white placeholder:text-slate-405 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm resize-y"
                        placeholder="Include: date of incident, people involved, any prior attempts to resolve..."
                        value={formData.description} 
                        maxLength={2000}
                        onChange={(e) => update("description", e.target.value)}
                    />
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[12px] text-slate-400 dark:text-slate-500 ml-1">Minimum 20 characters recommended</p>
                    <div className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                        {formData.description.length} / 2000 characters
                    </div>
                </div>

                <div className="flex gap-4 mt-4 flex-wrap">
                    <button
                        type="button" 
                        onClick={onAnalyze}
                        disabled={!formData.description || !formData.title || !formData.department || !formData.category || aiLoading}
                        className="flex items-center justify-center gap-2.5 px-6 py-3 bg-slate-100 dark:bg-[#1A2234] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-[13px] shadow-sm uppercase tracking-wider"
                    >
                        {aiLoading ? <Loader2 className="animate-spin text-emerald-600 dark:text-emerald-400" size={16} /> : <Shield className="text-emerald-600 dark:text-emerald-400" size={16} />}
                        {aiLoading ? "Reviewing Draft..." : "VaadaAI Quality Check"}
                    </button>
                    <button
                        type="button" 
                        onClick={onFormalize} 
                        disabled={!formData.description || aiLoading}
                        className="flex items-center justify-center gap-2.5 px-6 py-3 bg-emerald-650 hover:bg-emerald-600 text-white border border-emerald-650 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-[13px] shadow-sm uppercase tracking-wider"
                    >
                        <PenTool size={16} /> Auto-Format Legal Structure
                    </button>
                </div>
            </div>

            {aiResult && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1A2234] mt-4 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 text-[12px] uppercase tracking-wider font-bold text-slate-800 dark:text-white">
                            <Sparkles size={16} className="text-emerald-650 dark:text-emerald-400" /> AI Audit Log
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg border ${aiResult.reliabilityLevel === "HIGH" ? "bg-emerald-500/20 text-emerald-650 dark:text-emerald-400 border-emerald-500/30" : aiResult.reliabilityLevel === "MEDIUM" ? "bg-amber-500/20 text-amber-605 dark:text-amber-400 border-amber-500/30" : "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30"}`}>
                            {aiResult.reliabilityLevel} GRADE ({Math.round(aiResult.reliabilityScore)}%)
                        </span>
                    </div>
                    <div className="p-6 text-[15px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 shadow-inner">
                        <p>{aiResult.feedback}</p>
                        {aiResult.missingDetails.length > 0 && (
                            <div className="p-5 bg-white dark:bg-[#0F172A] rounded-xl border border-rose-500/20">
                                <strong className="text-rose-600 dark:text-rose-400 block mb-3 text-[11px] uppercase tracking-widest font-bold">Action Required: Submissions Need Detail</strong>
                                <ul className="space-y-2 text-[14px] font-medium text-slate-700 dark:text-slate-300">
                                    {aiResult.missingDetails.map((d, i) => (
                                        <li key={i} className="flex gap-3 items-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-500"></div> {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
