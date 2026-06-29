"use client";

import { CheckCircle2 } from "lucide-react";

interface SuccessScreenProps {
    trackingId: string;
    department: string;
    onReset: () => void;
}

export default function SuccessScreen({
    trackingId,
    department,
    onReset,
}: SuccessScreenProps) {
    return (
        <div className="min-h-screen bg-[#070D19] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full mx-auto bg-[#111827] rounded-[24px] border border-white/5 p-8 md:p-12 shadow-2xl shadow-emerald-900/10 text-center relative overflow-hidden" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center border drop-shadow-lg border-emerald-500/30" style={{ margin: '0 auto 1.5rem auto' }}>
                    <CheckCircle2 size={40} className="text-emerald-400" />
                </div>
                <h1 className="relative z-10 text-3xl font-extrabold text-white mb-3">
                    Complaint Filed Successfully
                </h1>
                <p className="relative z-10 text-slate-400 text-[15px] mb-8 leading-relaxed max-w-lg mx-auto">
                    Your grievance has been formally submitted to the{" "}
                    <strong className="text-white">{department}</strong>. You can track its progress
                    using the secure tracking ID below.
                </p>

                <div className="relative z-10 bg-[#1B2435] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-auto shadow-inner" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Tracking ID
                    </p>
                    <p className="text-3xl font-extrabold font-mono text-cyan-450 tracking-tight">
                        {trackingId}
                    </p>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center" style={{ gap: '1rem' }}>
                    <a
                        href="/citizen/dashboard"
                        className="px-8 py-3.5 text-white rounded-xl font-bold text-[15px] transition-all hover:-translate-y-0.5 focus:outline-none"
                        style={{ backgroundColor: '#059669', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '200px', cursor: 'pointer' }}
                    >
                        Go to Dashboard
                    </a>
                    <button
                        onClick={onReset}
                        className="px-8 py-3.5 text-slate-300 rounded-xl font-bold text-[15px] transition-all focus:outline-none"
                        style={{ backgroundColor: '#1B2435', border: '1px solid rgba(255,255,255,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '200px', cursor: 'pointer' }}
                    >
                        File Another
                    </button>
                </div>
            </div>
        </div>
    );
}
