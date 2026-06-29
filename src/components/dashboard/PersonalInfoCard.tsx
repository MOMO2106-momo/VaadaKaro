"use client";

import { User, Mail, Shield, MapPin, Settings, BarChart3, ArrowUpRight } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/StatGrid";
import type { CitizenProfile } from "@/types/dashboard";

interface PersonalInfoCardProps {
    profile: CitizenProfile;
}

export default function PersonalInfoCard({ profile }: PersonalInfoCardProps) {
    return (
        <DashboardCard className="!p-7 flex flex-col">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2 mb-4">
                <User size={20} className="text-cyan-400" />
                Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoField label="Full Name">
                    <span className="text-white font-semibold text-sm">{profile.name}</span>
                </InfoField>

                <InfoField label="Email Address">
                    <span className="text-white font-semibold text-sm flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        {profile.email}
                    </span>
                </InfoField>

                <InfoField label="Citizen ID">
                    <span className="text-white font-mono text-sm">{profile.citizenId}</span>
                </InfoField>

                <InfoField label="Verification">
                    <div className="text-sm font-bold">
                        {profile.verificationStatus === "VERIFIED" ? (
                            <span className="text-emerald-400 flex items-center gap-1.5">
                                <Shield size={14} />
                                VERIFIED · Trust Score {profile.trustScore}/100
                            </span>
                        ) : profile.verificationStatus === "PENDING" ? (
                            <span className="text-amber-400">PENDING VERIFICATION</span>
                        ) : (
                            <span className="text-slate-500">UNVERIFIED</span>
                        )}
                    </div>
                </InfoField>

                <InfoField label="Location">
                    <span className="text-white font-semibold text-sm flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400" />
                        {profile.location}
                    </span>
                </InfoField>

                <InfoField label="Account Role">
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-bold inline-block">
                        {profile.role}
                    </span>
                </InfoField>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800 flex gap-3 flex-wrap">
                <button
                    aria-label="Edit profile"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                >
                    <Settings size={14} /> Edit Profile
                </button>
                <button
                    aria-label="View full activity log"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl border border-slate-700 transition-all duration-200 active:scale-95 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-slate-500/20"
                >
                    <BarChart3 size={14} /> Activity Log <ArrowUpRight size={12} />
                </button>
            </div>
        </DashboardCard>
    );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function InfoField({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {label}
            </label>
            <div>{children}</div>
        </div>
    );
}
