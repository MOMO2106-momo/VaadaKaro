"use client";

import { Upload, FileText } from "lucide-react";
import type { UploadedFile } from "@/types/wizard";

interface StepThreeProps {
    files: UploadedFile[];
    onFilesChange: (files: UploadedFile[]) => void;
}

export default function StepThree({ files, onFilesChange }: StepThreeProps) {
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files).filter(
            (f) =>
                f.size <= 10 * 1024 * 1024 &&
                ["application/pdf", "image/png", "image/jpeg"].includes(f.type)
        );
        onFilesChange([
            ...files,
            ...selected.map((f) => ({ name: f.name, size: f.size, type: f.type })),
        ]);
        e.target.value = "";
    };

    return (
        <div className="flex flex-col space-y-8 w-full">
            <header className="space-y-2 border-b border-slate-200 dark:border-slate-800/60 pb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Evidence Collection</h2>
                <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium leading-relaxed max-w-3xl">
                    Provide tangible proof (photographs, official documents) to expedite resolution. Cases with valid visual evidence have a 60% faster turnaround time.
                </p>
            </header>

            <label
                htmlFor="file-upload"
                className="group w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-12 border-2 border-dashed border-emerald-550/30 dark:border-emerald-500/30 bg-slate-50 dark:bg-[#141F32] hover:bg-slate-100/50 dark:hover:bg-[#1A2538] hover:border-emerald-500 rounded-2xl cursor-pointer transition-all duration-300"
            >
                <Upload
                    size={44}
                    className="text-emerald-600 dark:text-emerald-400 mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm"
                />
                <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-2">
                    {files.length > 0 ? `${files.length} Assets Staged For Upload` : "Drag Assets Here or Click Browse"}
                </h3>
                <p className="text-[14px] text-slate-550 dark:text-slate-400 font-medium tracking-wide text-center">
                    Strict Limits: PDF, JPG, PNG format. Maximum 10MB per file boundary.
                </p>

                <div className="mt-8 px-6 py-2.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-[13px] rounded-lg tracking-widest uppercase shadow-sm group-hover:bg-slate-50 dark:group-hover:bg-[#020817] group-hover:border-emerald-500 transition-all">
                    Select Digital Files
                </div>

                <input
                    id="file-upload"
                    type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
                    className="sr-only" onChange={handleFileInput}
                />
            </label>

            {files.length > 0 && (
                <div className="space-y-4 pt-4 max-w-3xl mx-auto w-full">
                    <h3 className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">Confirmed Attachments</h3>
                    {files.map((file, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-5 bg-slate-100/50 dark:bg-[#1A2234] border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-sm"
                        >
                            <div className="flex items-center gap-5 min-w-0">
                                <div className="p-3 bg-white dark:bg-[#0F172A] rounded-lg border border-slate-200 dark:border-slate-800">
                                    <FileText size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[15px] font-bold text-slate-850 dark:text-white truncate w-[200px] sm:w-[350px]">
                                        {file.name}
                                    </p>
                                    <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider font-mono">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB / {file.type.split('/')[1] || "FILE"}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => onFilesChange(files.filter((_, idx) => idx !== i))}
                                className="text-[12px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 hover:text-rose-500 dark:hover:text-rose-300 px-4 py-2 border border-rose-200 dark:border-rose-550/20 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all shrink-0 focus:outline-none"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
