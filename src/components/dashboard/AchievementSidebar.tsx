"use client";

import { Trophy, Star, TrendingUp, Zap, Award, Lock, Medal } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/StatGrid";
import type { CitizenProfile, Achievement } from "@/types/dashboard";

interface AchievementSidebarProps {
    profile: CitizenProfile;
    achievements: Achievement[];
}

export default function AchievementSidebar({ profile, achievements }: AchievementSidebarProps) {
    const nextBadgePoints = 3000;
    const progress = Math.min(100, (profile.points / nextBadgePoints) * 100);

    return (
        <div className="space-y-6">
            {/* XP / Rank / Progress */}
            <DashboardCard className="relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-5 pointer-events-none" aria-hidden="true">
                    <Trophy size={120} className="text-indigo-400" />
                </div>
                <div className="relative z-10">
                    {/* Rank badge */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-indigo-500/20 text-indigo-400 text-sm font-bold px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                            <Star size={13} />
                            #{profile.rank} Rank
                        </div>
                    </div>

                    {/* Points */}
                    <div className="mb-1">
                        <div className="text-4xl font-extrabold text-white">
                            {profile.points.toLocaleString()}
                        </div>
                        <div className="text-xs uppercase tracking-wider font-bold text-slate-500 mt-0.5">
                            Contribution Points
                        </div>
                    </div>

                    {/* Trust score */}
                    <div className="text-xs text-slate-400 font-medium mb-4 flex items-center gap-1">
                        <TrendingUp size={11} className="text-indigo-400" />
                        Trust Score:{" "}
                        <span className="text-white font-bold ml-1">{profile.trustScore}/100</span>
                    </div>

                    {/* XP Progress */}
                    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                        <div className="flex justify-between items-end text-sm font-semibold mb-2">
                            <span className="text-slate-400 text-xs">Next Milestone</span>
                            <span className="text-white text-xs">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-blue-400 h-full rounded-full transition-all duration-700"
                                style={{ width: `${progress}%` }}
                                role="progressbar"
                                aria-label="XP progress"
                                aria-valuenow={Math.round(progress)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                        <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <Zap size={11} className="text-indigo-400" />
                            {(nextBadgePoints - profile.points).toLocaleString()} pts to next rank
                        </div>
                        {/* Next Badge Preview */}
                        <div className="text-xs text-slate-500 font-semibold flex items-center gap-2 mt-3 p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-lg">
                            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-500/10 text-amber-500">
                                <Award size={15} />
                            </span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Badge</span>
                                <span className="text-slate-200 font-bold">Civic Champion</span>
                            </div>
                        </div>
                    </div>

                    {/* Streak + Badges */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
                            <div className="text-xl font-extrabold text-white">{profile.streakDays}</div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">
                                Day Streak
                            </div>
                        </div>
                        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
                            <div className="text-xl font-extrabold text-white">
                                {achievements.filter((a) => a.earned).length}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">
                                Badges Earned
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardCard>

            {/* Achievements list */}
            <DashboardCard>
                <h3 className="text-lg font-semibold text-slate-100 mb-5 flex items-center gap-2">
                    <Award size={18} className="text-amber-400" />
                    Achievements
                </h3>
                <div className="flex flex-col gap-3">
                    {achievements.map((a) => (
                        <div
                            key={a.id}
                            className={`flex items-start gap-4 p-3 rounded-xl border transition-all ${a.earned
                                ? "bg-slate-800/60 border-slate-700"
                                : "bg-slate-900/30 border-slate-800/40 opacity-55"
                                }`}
                        >
                            <div className="text-2xl shrink-0" aria-hidden="true">
                                {a.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-bold text-slate-100 truncate flex items-center gap-1">
                                        {a.name}
                                        {!a.earned && (
                                            <Lock size={11} className="text-slate-600 shrink-0" aria-label="Locked" />
                                        )}
                                    </span>
                                    {a.earned && (
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1 shrink-0">
                                            <Medal size={9} /> Earned
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>
                                <p className="text-[10px] text-slate-600 font-bold mt-1">
                                    {a.pointsRequired.toLocaleString()} pts required
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardCard>
        </div>
    );
}
