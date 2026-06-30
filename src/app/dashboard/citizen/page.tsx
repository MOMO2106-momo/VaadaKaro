"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FileText, CheckCircle2, Star, Target, Shield, MapPin,
    Calendar, Flame, Bell, Settings, ArrowRight, Bot,
    Users, BarChart3, Zap, TrendingUp, Activity, PieChart, Sparkles
} from "lucide-react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardSkeleton from "../DashboardSkeleton";
import { StatGrid } from "@/components/dashboard/StatGrid";
import SubmissionList from "@/components/dashboard/SubmissionList";
import PersonalInfoCard from "@/components/dashboard/PersonalInfoCard";
import AchievementSidebar from "@/components/dashboard/AchievementSidebar";
import { getUserBadges } from "@/lib/actions/leaderboardActions";


import type {
    CitizenProfile,
    Submission,
    Achievement,
    StatCardData,
} from "@/types/dashboard";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PROFILE: CitizenProfile = {
    name: "Rajesh Kumar Sharma",
    email: "rajesh.sharma@gmail.com",
    citizenId: "VDK-2024-DL-00841",
    role: "CITIZEN",
    location: "New Delhi, Delhi",
    joinedAt: "2024-03-15",
    avatarInitials: "RS",
    trustScore: 87,
    verificationStatus: "VERIFIED",
    points: 2450,
    rank: 14,
    streakDays: 7,
};

const MOCK_SUBMISSIONS: Submission[] = [
    {
        id: "1",
        title: "Broken street light on Connaught Place",
        department: "Municipal Corporation",
        category: "Road & Infrastructure",
        status: "UNDER_REVIEW",
        priority: "HIGH",
        submittedAt: "2026-06-24",
        trackingId: "TRK-2024-001842",
        lastUpdated: "2026-06-26",
    },
    {
        id: "2",
        title: "Water supply disruption in Block C",
        department: "Water Supply",
        category: "No Water",
        status: "RESOLVED",
        priority: "HIGH",
        submittedAt: "2026-06-20",
        trackingId: "TRK-2024-001721",
        lastUpdated: "2026-06-25",
    },
    {
        id: "3",
        title: "Overflowing garbage bins near market",
        department: "Municipal Corporation",
        category: "Waste Management",
        status: "PENDING",
        priority: "MEDIUM",
        submittedAt: "2026-06-27",
        trackingId: "TRK-2024-001899",
        lastUpdated: "2026-06-27",
    },
    {
        id: "4",
        title: "Online fraud attempt via OTP spoofing",
        department: "Cyber Crime",
        category: "Online Fraud",
        status: "UNDER_REVIEW",
        priority: "HIGH",
        submittedAt: "2026-06-22",
        trackingId: "TRK-2024-001810",
        lastUpdated: "2026-06-26",
    },
    {
        id: "5",
        title: "Faulty electricity meter — billing dispute",
        department: "Electricity",
        category: "Faulty Meter",
        status: "REJECTED",
        priority: "LOW",
        submittedAt: "2026-06-18",
        trackingId: "TRK-2024-001688",
        lastUpdated: "2026-06-23",
    },
];

// Badge data is fetched live from the database via getUserBadges() server action.

// ─── Quick Action Definition ───────────────────────────────────────────────────

const QUICK_ACTIONS = [
    {
        label: "File a Complaint",
        desc: "Report a new civic issue",
        href: "/file-complaint",
        icon: FileText,
        accent: "text-blue-400",
        bg: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 hover:border-blue-500/40",
    },
    {
        label: "Track Complaint",
        desc: "Check status of submissions",
        href: "/track-complaint",
        icon: Target,
        accent: "text-violet-400",
        bg: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20 hover:border-violet-500/40",
    },
    {
        label: "AI Legal Assistant",
        desc: "Get guidance on civic rights",
        href: "/ai-assistant",
        icon: Bot,
        accent: "text-cyan-400",
        bg: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20 hover:border-cyan-500/40",
    },
    {
        label: "Community Map",
        desc: "View active issue hotspots",
        href: "/community-map",
        icon: Users,
        accent: "text-amber-400",
        bg: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 hover:border-amber-500/40",
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CitizenDashboardPage() {
    const [profile, setProfile] = useState<CitizenProfile | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            // Fetch real badge data from the database
            const result = await getUserBadges();
            if (!cancelled) {
                setProfile(MOCK_PROFILE);
                setSubmissions(MOCK_SUBMISSIONS);
                setAchievements(result.badges as Achievement[]);
                setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (!profile) return null;

    const stats: StatCardData[] = [
        {
            label: "Total Complaints",
            value: 12,
            change: "3 this month",
            positive: true,
            icon: <FileText size={16} className="text-blue-400" />,
            color: "bg-blue-500/10 border border-blue-500/20",
        },
        {
            label: "Resolved Rate",
            value: "66%",
            change: "15% up",
            positive: true,
            icon: <CheckCircle2 size={16} className="text-emerald-400" />,
            color: "bg-emerald-500/10 border border-emerald-500/20",
        },
        {
            label: "Avg Resolution",
            value: "4.2 days",
            change: "0.8d faster",
            positive: true,
            icon: <TrendingUp size={16} className="text-amber-400" />,
            color: "bg-amber-500/10 border border-amber-500/20",
        },
        {
            label: "Trust Score",
            value: `${profile.trustScore}/100`,
            change: "5 pts up",
            positive: true,
            icon: <Star size={16} className="text-indigo-400" />,
            color: "bg-indigo-500/10 border border-indigo-500/20",
        },
    ];

    return (
        <DashboardShell>
            <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10 lg:py-16 flex-1 flex flex-col space-y-10">
                {/* ══════════════════════════════════════════════
                    BAND 1 — Welcome Header
                ══════════════════════════════════════════════ */}
                <section aria-label="Citizen welcome header">
                    <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] to-[#1A2234] border border-slate-800 rounded-2xl p-8 lg:p-10 shadow-sm">
                        {/* Decorative glow */}
                        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl" aria-hidden="true" />
                        <div className="pointer-events-none absolute -bottom-12 right-40 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl" aria-hidden="true" />

                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            {/* Identity */}
                            <div className="flex items-center gap-6">
                                <div
                                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-extrabold shrink-0 border border-blue-500/30 shadow-xl shadow-blue-900/30"
                                    aria-label="User avatar"
                                >
                                    {profile.avatarInitials}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{profile.name}</h1>
                                        {profile.verificationStatus === "VERIFIED" && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-full uppercase tracking-wider">
                                                <Shield size={12} /> VERIFIED
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm font-mono text-slate-400">{profile.citizenId}</p>
                                    <div className="flex items-center gap-6 text-[13px] text-slate-400 font-medium flex-wrap pt-2">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} />{profile.location}</span>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            Joined {new Date(profile.joinedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" })}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                                            <Flame size={14} />{profile.streakDays}-day streak
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <button
                                    aria-label="Notifications"
                                    className="w-12 h-12 rounded-xl bg-[#1E293B] border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all shadow-sm"
                                >
                                    <Bell size={20} />
                                </button>
                                <button
                                    aria-label="Settings"
                                    className="w-12 h-12 rounded-xl bg-[#1E293B] border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all shadow-sm"
                                >
                                    <Settings size={20} />
                                </button>
                                <Link
                                    href="/file-complaint"
                                    aria-label="File new complaint"
                                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[15px] font-bold uppercase tracking-wide rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                                >
                                    <FileText size={18} /> File Complaint
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    BAND 2 — Quick Statistics
                ══════════════════════════════════════════════ */}
                <section aria-label="Activity statistics">
                    <StatGrid stats={stats} />
                </section>

                {/* ══════════════════════════════════════════════
                    BAND 3 — Profile Overview + Recent Complaints
                ══════════════════════════════════════════════ */}
                <section
                    aria-label="Profile and complaints"
                    className="grid grid-cols-1 xl:grid-cols-12 gap-10"
                >
                    {/* Profile — 4 cols */}
                    <div className="xl:col-span-4 flex flex-col gap-10">
                        <PersonalInfoCard profile={profile} />

                        {/* Category Distribution Map */}
                        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-sm p-8 lg:p-10">
                            <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-6">
                                <PieChart size={20} className="text-cyan-400" />
                                Complaint Categories
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 text-[13px] font-medium">
                                    <span className="w-24 text-slate-400">Roads</span>
                                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="w-[45%] h-full bg-cyan-500 hover:bg-cyan-400 transition-colors"></div>
                                    </div>
                                    <span className="w-10 text-right font-bold text-white">45%</span>
                                </div>
                                <div className="flex items-center gap-4 text-[13px] font-medium">
                                    <span className="w-24 text-slate-400">Water</span>
                                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="w-[25%] h-full bg-blue-500 hover:bg-blue-400 transition-colors"></div>
                                    </div>
                                    <span className="w-10 text-right font-bold text-white">25%</span>
                                </div>
                                <div className="flex items-center gap-4 text-[13px] font-medium">
                                    <span className="w-24 text-slate-400">Electricity</span>
                                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="w-[20%] h-full bg-indigo-500 hover:bg-indigo-400 transition-colors"></div>
                                    </div>
                                    <span className="w-10 text-right font-bold text-white">20%</span>
                                </div>
                                <div className="flex items-center gap-4 text-[13px] font-medium">
                                    <span className="w-24 text-slate-400">Others</span>
                                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="w-[10%] h-full bg-slate-500 hover:bg-slate-400 transition-colors"></div>
                                    </div>
                                    <span className="w-10 text-right font-bold text-white">10%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Complaints — 8 cols */}
                    <div className="xl:col-span-8">
                        <SubmissionList submissions={submissions} />
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    BAND 4 — Gamification + Action Center
                ══════════════════════════════════════════════ */}
                <section
                    aria-label="Gamification and quick actions"
                    className="grid grid-cols-1 xl:grid-cols-12 gap-10"
                >
                    {/* Achievements / XP — 8 cols */}
                    <div className="xl:col-span-8">
                        <AchievementSidebar profile={profile} achievements={achievements} />
                    </div>

                    {/* Action Center — 4 cols */}
                    <div className="xl:col-span-4">
                        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-sm p-8 lg:p-10 h-full flex flex-col">
                            <h2 className="text-lg font-bold text-white flex items-center gap-3 mb-6">
                                <Zap size={20} className="text-amber-400" />
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-1 gap-4 flex-1">
                                {QUICK_ACTIONS.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <Link
                                            key={action.label}
                                            href={action.href}
                                            className={`group flex items-center gap-4 p-5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${action.bg}`}
                                            aria-label={action.label}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${action.bg.split(" ")[0]}`}>
                                                <Icon size={22} className={action.accent} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[15px] font-bold text-white">{action.label}</p>
                                                <p className="text-[13px] text-slate-400 mt-1">{action.desc}</p>
                                            </div>
                                            <ArrowRight size={18} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    BAND 5 — Platform Intelligence Row
                ══════════════════════════════════════════════ */}
                <section
                    aria-label="Platform intelligence"
                    className="grid grid-cols-1 xl:grid-cols-2 gap-10"
                >
                    {/* AI Legal Assistant teaser */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-sm p-8 lg:p-10 flex flex-col gap-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-blue-500" />
                        
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20 shadow-inner">
                                    <Bot size={28} className="text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">AI Legal Assistant</h3>
                                    <p className="text-[13px] text-slate-400 mt-0.5">Powered by advanced NLP</p>
                                </div>
                            </div>
                            <span className="text-[11px] font-bold px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full uppercase tracking-widest">Beta</span>
                        </div>

                        <p className="text-[15px] text-slate-300 leading-relaxed">
                            Get real-time guidance on civic protocols, understand your rights as a citizen, and receive AI-drafted complaint summaries.
                        </p>

                        {/* AI Insights Card */}
                        <div className="p-5 bg-[#1A2234] border border-cyan-900/50 rounded-xl flex gap-4 items-start relative group hover:border-cyan-800 transition-colors">
                            <Sparkles size={20} className="text-cyan-400 shrink-0 mt-0.5" />
                            <div className="z-10 relative">
                                <span className="text-[11px] uppercase font-bold tracking-widest text-cyan-500 block mb-1">Insight Generated</span>
                                <span className="text-[13px] text-slate-300 font-medium leading-relaxed block">
                                    Road complaints in your locality have increased by 18% this week. We recommend checking the Community Map before filing a similar issue.
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-auto">
                            {[
                                { label: "Rights Guide", icon: Shield, color: "text-cyan-400" },
                                { label: "Draft Help", icon: FileText, color: "text-sky-400" },
                                { label: "Case Study", icon: BarChart3, color: "text-blue-400" },
                            ].map((f) => (
                                <div key={f.label} className="flex flex-col items-center justify-center gap-2 p-4 bg-[#1E293B] rounded-xl border border-slate-700/50">
                                    <f.icon size={20} className={f.color} />
                                    <span className="text-[12px] font-bold text-slate-400">{f.label}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/ai-assistant"
                            className="mt-2 w-full flex items-center justify-center gap-2 py-4 bg-[#1A2234] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white text-[15px] font-bold uppercase tracking-wide rounded-xl transition-all duration-200"
                        >
                            <Bot size={18} /> Launch AI Assistant
                        </Link>
                    </div>

                    {/* Platform Activity feed */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-sm p-8 lg:p-10 flex flex-col gap-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-500" />
                        
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20 shadow-inner">
                                    <Activity size={28} className="text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Platform Activity</h3>
                                    <p className="text-[13px] text-slate-400 mt-0.5">Live accountability metrics</p>
                                </div>
                            </div>
                            <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full tracking-widest">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                LIVE
                            </span>
                        </div>

                        <div className="space-y-3 mt-2 flex-1">
                            {/* Live Feed Items */}
                            <div className="flex items-center gap-4 p-4 bg-[#1A2234] border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-bold text-white">Complaint #1842 resolved</p>
                                    <p className="text-[13px] text-slate-400 mt-0.5">Water supply restored in Block C</p>
                                </div>
                                <span className="text-[12px] text-slate-500 font-medium">Just now</span>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-[#1A2234] border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                                <Shield size={20} className="text-blue-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-bold text-white">Officer responded</p>
                                    <p className="text-[13px] text-slate-400 mt-0.5">Inspector Sharma commented on your report</p>
                                </div>
                                <span className="text-[12px] text-slate-500 font-medium">12m ago</span>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-[#1A2234] border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                                <Target size={20} className="text-indigo-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-bold text-white">New community report nearby</p>
                                    <p className="text-[13px] text-slate-400 mt-0.5">Potholes reported on MG Road</p>
                                </div>
                                <span className="text-[12px] text-slate-500 font-medium">45m ago</span>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-[#1A2234] border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                                <TrendingUp size={20} className="text-amber-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-bold text-white">Complaint tracking updated</p>
                                    <p className="text-[13px] text-slate-400 mt-0.5">Issue moved to "In Progress"</p>
                                </div>
                                <span className="text-[12px] text-slate-500 font-medium">1h ago</span>
                            </div>
                        </div>

                        <Link
                            href="/leaderboard"
                            className="mt-2 w-full flex items-center justify-center gap-2 py-4 bg-[#1A2234] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white text-[15px] font-bold uppercase tracking-wide rounded-xl transition-all duration-200"
                        >
                            <BarChart3 size={18} /> View Leaderboard
                        </Link>
                    </div>
                </section>

            </div>
        </DashboardShell>
    );
}
