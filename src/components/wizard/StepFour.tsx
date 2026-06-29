"use client";

import { FileText, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { WizardFormData, UploadedFile } from "@/types/wizard";
import React from 'react';

interface StepFourProps {
    formData: WizardFormData;
    files: UploadedFile[];
    declarationChecked: boolean;
    setDeclarationChecked: (v: boolean) => void;
    aiAcknowledged: boolean;
    setAiAcknowledged: (v: boolean) => void;
}

export default function StepFour({ formData, files, declarationChecked, setDeclarationChecked, aiAcknowledged, setAiAcknowledged }: StepFourProps) {
    return (
        <div className="flex flex-col space-y-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <header className="space-y-2 border-b border-slate-200 dark:border-slate-800/60 pb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Final Authorization</h2>
                <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium leading-relaxed max-w-3xl">
                    Review and permanently lock the grievance details. Once submitted, this data becomes part of the permanent civic record and cannot be edited.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '2rem' }}>

                {/* Details Synopsis */}
                <div className="space-y-6">
                    <h3 className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">Core Case File</h3>
                    <div className="bg-slate-50 dark:bg-[#1A2234] border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm space-y-5">
                        <div className="flex items-start gap-4">
                            <FileText size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Title & Dept</h4>
                                <p className="text-[15px] font-bold text-slate-850 dark:text-white">{formData.title || "Not Assigned"}</p>
                                <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{formData.department || "No Department"} / {formData.category || "No Category"}</p>
                            </div>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex items-start gap-4">
                            <MapPin size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Target Coordinates</h4>
                                <p className="text-[15px] text-slate-850 dark:text-white font-semibold">{formData.address || "Missing Address Line"}</p>
                                <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Pin: {formData.pincode || "---"}, {formData.city || "-"}, {formData.state || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auxiliary Details */}
                <div className="space-y-6">
                    <h3 className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">Attachments & Identity</h3>
                    <div className="bg-slate-50 dark:bg-[#1A2234] border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Complainant</h4>
                                <p className="text-[15px] font-bold text-slate-850 dark:text-white truncate">{formData.fullName || "Anonymous"}</p>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Phone</h4>
                                <p className="text-[15px] font-bold text-slate-700 dark:text-slate-300">{formData.phone || "Required"}</p>
                            </div>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                        <div>
                            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                                Loaded Evidence
                                <span className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-mono text-[11px] text-emerald-600 dark:text-emerald-400">{files.length} ITEMS</span>
                            </h4>
                            {files.length > 0 ? (
                                <ul className="space-y-2 list-none p-0 m-0">
                                    {files.map((file, i) => (
                                        <li key={i} className="text-[14px] font-semibold text-slate-700 dark:text-slate-305 flex items-center gap-2 truncate">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-555 dark:bg-emerald-500"></div>
                                            {file.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-[14px] text-slate-450 dark:text-slate-500 italic">No supplemental data files attached.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Legal Consent Switches */}
            <div className="mt-8 space-y-4">
                <h3 className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-3">Mandatory Signatures</h3>

                <label className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-[#141F32] hover:bg-slate-100/50 dark:hover:bg-[#1A2538] border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer transition-colors group">
                    <div className="flex items-center justify-center h-6 w-6 mt-0.5 shrink-0">
                        <input
                            type="checkbox"
                            checked={declarationChecked}
                            onChange={(e) => setDeclarationChecked(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0F172A] text-emerald-600 dark:text-emerald-550 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                        />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[15px] font-bold text-slate-850 dark:text-white mb-1 flex items-center gap-2">
                            Penalty of Perjury Confession <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
                        </h4>
                        <p className="text-[13.5px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                            Under penalty of perjury, I hereby swear that the facts stated in this document are true according to my knowledge. I understand that submitting fraudulent applications via a sovereign node is a punishable crime.
                        </p>
                    </div>
                </label>

                <label className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-[#141F32] hover:bg-slate-100/50 dark:hover:bg-[#1A2538] border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer transition-colors group">
                    <div className="flex items-center justify-center h-6 w-6 mt-0.5 shrink-0">
                        <input
                            type="checkbox"
                            checked={aiAcknowledged}
                            onChange={(e) => setAiAcknowledged(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0F172A] text-emerald-600 dark:text-emerald-555 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                        />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[15px] font-bold text-slate-850 dark:text-white mb-1 flex items-center gap-2">
                            Machine Pre-Processing Authorization <CheckCircle2 size={16} className="text-emerald-650 dark:text-emerald-400" />
                        </h4>
                        <p className="text-[13.5px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                            I authorize the VaadaKaro AI engine to parse my input descriptions for automatic department categorization and risk grading.
                        </p>
                    </div>
                </label>
            </div>

        </div>
    );
}
