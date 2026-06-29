"use client";

import { Check, ShieldCheck } from "lucide-react";

interface VerticalStepperProps {
    step: number;
}

const UI_STEPS = [
    { title: "Describe the Issue", desc: "Provide details about your grievance" },
    { title: "Categorization", desc: "Select the appropriate category" },
    { title: "Location", desc: "Specify the location of the issue" },
    { title: "Evidence", desc: "Upload supporting documents" },
    { title: "Review & Submit", desc: "Review and submit your complaint" },
];

export default function VerticalStepper({ step }: VerticalStepperProps) {
    const activeVisualStep = step === 1 ? 1 : step + 1;

    return (
        <div className="flex flex-col flex-1" role="list">
            {/* Steps list */}
            <div className="space-y-8 relative flex-1">
                {/* Connecting track background */}
                <div className="absolute top-4 bottom-4 left-4 w-[2px] bg-white/5 -z-10" />

                {/* Active progress track */}
                <div
                    className="absolute top-4 left-4 w-[2px] bg-emerald-500 -z-10 transition-all duration-500 ease-in-out"
                    style={{ height: `${((Math.min(activeVisualStep, 5) - 1) / 4) * 100}%` }}
                />

                {UI_STEPS.map((stepData, idx) => {
                    const s = idx + 1;
                    const isCompleted = activeVisualStep > s;
                    const isActive = activeVisualStep === s;
                    return (
                        <div
                            key={s}
                            className="flex items-start gap-4 relative group"
                            role="listitem"
                            aria-current={isActive ? "step" : undefined}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 z-10 shrink-0 mt-0.5 ${isCompleted
                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                    : isActive
                                        ? "border-emerald-400 bg-[#0F172A] text-emerald-400 ring-4 ring-emerald-500/20"
                                        : "border-slate-700 bg-[#0F172A] text-slate-500"
                                    }`}
                            >
                                {isCompleted ? <Check size={14} strokeWidth={3} /> : s}
                            </div>
                            <div className="flex flex-col">
                                <span
                                    className={`text-[14px] font-semibold transition-colors duration-300 ${isActive
                                        ? "text-emerald-400"
                                        : isCompleted
                                            ? "text-slate-200"
                                            : "text-slate-500"
                                        }`}
                                >
                                    {stepData.title}
                                </span>
                                <span className="text-slate-400 text-[13px] mt-0.5 leading-tight">
                                    {stepData.desc}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Privacy Card — pinned to the bottom via mt-auto */}
            <div className="mt-auto pt-8">
                <div className="bg-slate-800/70 rounded-xl p-5 flex gap-4 shadow-lg w-full border border-slate-700/40">
                    <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={22} />
                    <div>
                        <h4 className="text-[14px] font-bold text-white mb-1 leading-tight">Your information is safe</h4>
                        <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                            We protect your privacy and securely transmit your complaint.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
