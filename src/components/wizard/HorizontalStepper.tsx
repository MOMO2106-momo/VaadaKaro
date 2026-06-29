"use client";

import { Check, FileText, MapPin, Paperclip, CheckCircle } from "lucide-react";

interface HorizontalStepperProps {
    step: number;
}

const UI_STEPS = [
    { label: "Categorization", sub: "Tell us what this is about", icon: FileText },
    { label: "Location", sub: "Where did it happen?", icon: MapPin },
    { label: "Evidence", sub: "Add supporting proof", icon: Paperclip },
    { label: "Review & Submit", sub: "Verify and submit", icon: CheckCircle },
];

export default function HorizontalStepper({ step }: HorizontalStepperProps) {
    return (
        <div
            className="relative flex justify-between items-start w-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm mb-8"
            role="list"
            aria-label="Form steps"
        >
            {/* Connecting track background */}
            <div className="absolute top-[44px] left-[12%] right-[12%] h-[2.5px] bg-slate-100 dark:bg-slate-800 -z-10" />

            {/* Connecting track progress */}
            <div 
                className="absolute top-[44px] left-[12%] h-[2.5px] bg-emerald-500 transition-all duration-500 -z-10"
                style={{ 
                    width: `${step === 1 ? 0 : step === 2 ? 26 : step === 3 ? 51 : 76}%` 
                }}
            />

            {UI_STEPS.map((stepData, idx) => {
                const s = idx + 1;
                const isCompleted = step > s;
                const isActive = step === s;
                const Icon = stepData.icon;

                return (
                    <div
                        key={s}
                        className="flex flex-col items-center flex-1 relative"
                        role="listitem"
                        aria-current={isActive ? "step" : undefined}
                    >
                        <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border-2 z-10 ${
                                isCompleted
                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : isActive
                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-slate-400 dark:text-slate-500"
                            }`}
                        >
                            {isCompleted ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                        </div>
                        
                        <span
                            className={`mt-3 text-[14px] font-bold text-center transition-colors duration-300 ${
                                isActive || isCompleted
                                    ? "text-slate-800 dark:text-white"
                                    : "text-slate-400 dark:text-slate-500"
                            }`}
                        >
                            {stepData.label}
                        </span>
                        <span
                            className={`mt-1 text-[11px] font-medium text-center transition-colors duration-300 hidden sm:block ${
                                isActive || isCompleted
                                    ? "text-slate-500 dark:text-slate-400"
                                    : "text-slate-450 dark:text-slate-600"
                            }`}
                        >
                            {stepData.sub}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
