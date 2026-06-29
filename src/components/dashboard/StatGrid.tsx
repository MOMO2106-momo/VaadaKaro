"use client";

import React from "react";
import type { StatCardData } from "@/types/dashboard";

// ─── DashboardCard ────────────────────────────────────────────────────────────
import BaseCard from "@/components/ui/BaseCard";

export function DashboardCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <BaseCard className={className}>{children}</BaseCard>;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

export function StatCard({ stat }: { stat: StatCardData }) {
    return (
        <DashboardCard className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color.split(" ")[0]}`}>
                    {stat.icon}
                </div>
                <span
                    className={`text-xs font-bold flex items-center gap-0.5 ${stat.positive ? "text-emerald-400" : "text-rose-400"
                        }`}
                >
                    {stat.positive ? "+" : ""}
                    {stat.change}
                </span>
            </div>
            <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none">{stat.value}</div>
                <div className="text-xs text-slate-500 font-semibold mt-1">{stat.label}</div>
            </div>
        </DashboardCard>
    );
}

// ─── StatGrid ─────────────────────────────────────────────────────────────────

export function StatGrid({ stats }: { stats: StatCardData[] }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="Activity statistics">
            {stats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
            ))}
        </div>
    );
}
