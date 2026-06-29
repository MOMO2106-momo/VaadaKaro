"use client";

import { useState } from "react";
import { FileText, Search, Filter, ChevronRight } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/StatGrid";
import { StatusChip, PriorityChip } from "@/components/dashboard/StatusBadge";
import type { Submission } from "@/types/dashboard";

interface SubmissionListProps {
    submissions: Submission[];
}

type FilterState = "ALL" | Submission["status"];

const FILTER_OPTIONS: FilterState[] = ["ALL", "PENDING", "UNDER_REVIEW", "RESOLVED", "REJECTED"];

export default function SubmissionList({ submissions }: SubmissionListProps) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<FilterState>("ALL");

    const filtered = submissions.filter((s) => {
        const matchQuery =
            s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.trackingId.toLowerCase().includes(query.toLowerCase());
        const matchFilter = filter === "ALL" || s.status === filter;
        return matchQuery && matchFilter;
    });

    return (
        <DashboardCard className="!p-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                    <FileText size={20} className="text-blue-400" />
                    Active Submissions
                </h2>
                <div className="flex gap-2 flex-wrap">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10"
                        />
                        <input
                            type="text"
                            className="h-10 pl-9 pr-3 text-sm bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all w-36 sm:w-44"
                            placeholder="Search…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Search submissions"
                        />
                    </div>
                    {/* Filter */}
                    <div className="relative">
                        <Filter
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10"
                        />
                        <select
                            className="h-10 pl-9 pr-4 text-sm bg-slate-900/60 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as FilterState)}
                            aria-label="Filter submissions by status"
                        >
                            {FILTER_OPTIONS.map((opt) => (
                                <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
                                    {opt === "ALL" ? "All Status" : opt.replace("_", " ")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                            <Search size={28} className="text-slate-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-1">No complaints found</h3>
                        <p className="text-sm text-slate-500 max-w-xs">
                            We couldn't find any submissions matching your search criteria. Try a different term.
                        </p>
                    </div>
                ) : (
                    filtered.map((s) => (
                        <div
                            key={s.id}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl hover:border-slate-700 hover:bg-slate-800/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                            role="button"
                            tabIndex={0}
                            aria-label={`View complaint: ${s.title}`}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") e.currentTarget.click();
                            }}
                        >
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                    <PriorityChip priority={s.priority} />
                                    <span className="text-[10px] font-mono text-slate-500">{s.trackingId}</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-200 truncate">{s.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5 mb-3">
                                    {s.department} · {s.category}
                                </p>

                                {/* Compact Timeline Progress */}
                                <div className="flex flex-col gap-1.5 mt-auto">
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                        <span className={`${s.status === 'RESOLVED' ? 'text-emerald-400' : s.status === 'UNDER_REVIEW' ? 'text-indigo-400' : s.status === 'PENDING' ? 'text-amber-400' : s.status === 'REJECTED' ? 'text-rose-400' : 'text-blue-400'}`}>
                                            Stage: {s.status.replace("_", " ")}
                                        </span>
                                        <span className="text-slate-500">
                                            {s.status === 'RESOLVED' ? '100% Complete' : s.status === 'UNDER_REVIEW' ? '50% Complete' : s.status === 'PENDING' ? '25% Complete' : s.status === 'REJECTED' ? 'Archived' : '75% Complete'}
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                                        <div className={`h-full transition-all duration-700 ${s.status === 'RESOLVED' ? 'w-full bg-emerald-500' : s.status === 'UNDER_REVIEW' ? 'w-1/2 bg-indigo-500' : s.status === 'PENDING' ? 'w-1/4 bg-amber-500' : s.status === 'REJECTED' ? 'w-full bg-slate-600' : 'w-3/4 bg-blue-500'}`}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex sm:flex-col items-start sm:items-end gap-2 sm:gap-1.5 shrink-0">
                                <StatusChip status={s.status} />
                                <span className="text-[10px] text-slate-500 font-semibold">
                                    Updated {new Date(s.lastUpdated).toLocaleDateString("en-IN")}
                                </span>
                            </div>
                            <ChevronRight
                                size={16}
                                className="text-slate-600 group-hover:text-slate-400 transition-colors hidden sm:block shrink-0"
                            />
                        </div>
                    ))
                )}
            </div>
        </DashboardCard>
    );
}
