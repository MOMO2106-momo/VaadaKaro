"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface WizardInputProps {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

/**
 * Wizard-specific label + input wrapper with optional error display.
 */
export default function WizardInput({
    label,
    required,
    error,
    children,
}: WizardInputProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-[13px] font-bold text-slate-300 uppercase tracking-wider">
                {label}
                {required && (
                    <span className="text-rose-500 ml-1.5" aria-hidden="true">
                        *
                    </span>
                )}
            </label>
            {children}
            {error && (
                <p className="text-[13px] text-rose-400 font-medium flex items-center gap-1.5 mt-1">
                    <AlertCircle size={14} /> {error}
                </p>
            )}
        </div>
    );
}

/** Shared class for positioning a leading icon inside any input wrapper. */
export const wizardIconCls =
    "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10";

/** Shared input class string for wizard text inputs — no leading icon. */
export const wizardInputCls =
    "w-full h-12 !px-4 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 font-medium text-[15px]";

/** For inputs that have a leading icon — adds left padding so text isn't hidden under the icon. */
export const wizardInputWithIconCls =
    "w-full h-12 !pl-11 !pr-4 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 font-medium text-[15px]";

/** For select elements — no leading icon, with right padding for the chevron. */
export const wizardSelectCls =
    "w-full h-12 !px-4 !pr-10 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 font-medium text-[15px] appearance-none cursor-pointer";

/** For select elements that also have a leading icon. */
export const wizardSelectWithIconCls =
    "w-full h-12 !pl-11 !pr-10 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 font-medium text-[15px] appearance-none cursor-pointer";
