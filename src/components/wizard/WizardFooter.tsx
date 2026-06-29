"use client";

import { ChevronLeft, ChevronRight, Shield, Loader2 } from "lucide-react";
import { TOTAL_STEPS } from "@/types/wizard";

interface WizardFooterProps {
    step: number;
    onBack: () => void;
    onNext: () => void;
    onSubmit: () => void;
    loading: boolean;
    canSubmit: boolean;
}

/**
 * Bottom navigation footer for the wizard.
 * Shows Previous/Next or Submit based on current step.
 */
export default function WizardFooter({
    step,
    onBack,
    onNext,
    onSubmit,
    loading,
    canSubmit,
}: WizardFooterProps) {
    return (
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center w-full gap-4 sm:gap-0">
            <button
                type="button"
                onClick={onBack}
                aria-label="Go to previous step"
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[15px] border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-500/20 ${step === 1 ? "opacity-0 pointer-events-none" : ""
                    }`}
            >
                <ChevronLeft size={18} /> Previous
            </button>

            {step < TOTAL_STEPS ? (
                <button
                    type="button"
                    onClick={onNext}
                    aria-label="Proceed to next step"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-slate-950 rounded-xl font-bold text-[15px] transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:scale-95 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-[#10b981]/20 ml-auto"
                >
                    Save &amp; Continue <ChevronRight size={18} />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!canSubmit || loading}
                    aria-label="Submit complaint to department"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-slate-950 rounded-xl font-bold text-[15px] transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:scale-95 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-[#10b981]/20 ml-auto"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <Shield size={18} />
                    )}
                    Submit Complaint
                </button>
            )}
        </div>

    );
}
