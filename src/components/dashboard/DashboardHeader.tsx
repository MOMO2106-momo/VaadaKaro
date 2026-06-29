"use client";

import {
    Shield, MapPin, Calendar, Flame, Bell, Settings, FileText,
} from "lucide-react";
import type { CitizenProfile } from "@/types/dashboard";

interface DashboardHeaderProps {
    profile: CitizenProfile;
    onFileComplaint: () => void;
}

export default function DashboardHeader({
    profile,
    onFileComplaint,
}: DashboardHeaderProps) {
    return (
        <header
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 backdrop-blur-sm"
            aria-label="Citizen profile header"
        >
            {/* Identity */}
            <div className="flex items-center gap-5">
                <div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl font-extrabold shrink-0 border-2 border-blue-500/40 shadow-xl shadow-blue-900/30"
                    aria-label="User avatar"
                >
                    {profile.avatarInitials}
                </div>
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-lg font-bold text-slate-100">{profile.name}</h1>
                        {profile.verificationStatus === "VERIFIED" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full">
                                <Shield size={10} /> VERIFIED
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-400 font-mono mt-0.5">{profile.citizenId}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500 font-medium flex-wrap">
                        <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {profile.location}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Joined{" "}
                            {new Date(profile.joinedAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                            })}
                        </span>
                        <span className="flex items-center gap-1">
                            <Flame size={12} className="text-orange-400" />
                            {profile.streakDays}-day streak
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 self-start sm:self-center">
                <button
                    aria-label="Notifications"
                    className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <Bell size={16} />
                </button>
                <button
                    aria-label="Settings"
                    className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <Settings size={16} />
                </button>
                <button
                    aria-label="File new complaint"
                    onClick={onFileComplaint}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:-translate-y-0.5"
                >
                    <FileText size={15} /> File Complaint
                </button>
            </div>
        </header>
    );
}
