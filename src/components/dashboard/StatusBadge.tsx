"use client";

import { Clock, Activity, CheckCircle2, AlertCircle } from "lucide-react";
import type { Submission } from "@/types/dashboard";

// ─── StatusChip ───────────────────────────────────────────────────────────────

export function StatusChip({ status }: { status: Submission["status"] }) {
    const map: Record<
        Submission["status"],
        { label: string; className: string; icon: React.ReactNode }
    > = {
        PENDING: {
            label: "Pending",
            className: "bg-amber-400/10 text-amber-400 border-amber-500/30",
            icon: <Clock size={11} />,
        },
        UNDER_REVIEW: {
            label: "Under Review",
            className: "bg-blue-400/10 text-blue-400 border-blue-500/30",
            icon: <Activity size={11} />,
        },
        RESOLVED: {
            label: "Resolved",
            className: "bg-emerald-400/10 text-emerald-400 border-emerald-500/30",
            icon: <CheckCircle2 size={11} />,
        },
        REJECTED: {
            label: "Rejected",
            className: "bg-rose-400/10 text-rose-400 border-rose-500/30",
            icon: <AlertCircle size={11} />,
        },
    };

    const { label, className, icon } = map[status];
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${className}`}
        >
            {icon} {label}
        </span>
    );
}

// ─── PriorityChip ─────────────────────────────────────────────────────────────

export function PriorityChip({ priority }: { priority: Submission["priority"] }) {
    const map: Record<Submission["priority"], string> = {
        HIGH: "bg-rose-400/10 text-rose-400 border-rose-500/30",
        MEDIUM: "bg-amber-400/10 text-amber-400 border-amber-500/30",
        LOW: "bg-slate-400/10 text-slate-400 border-slate-600/30",
    };
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${map[priority]}`}
        >
            {priority}
        </span>
    );
}
