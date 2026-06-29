export const dynamic = "force-dynamic";
import React from "react";
import { auth } from "@/auth";
import { getUserGamificationProfile } from "@/lib/actions/leaderboardActions";
import HeroWidget from "@/components/gamification/HeroWidget";
import BadgeShowcase from "@/components/gamification/BadgeShowcase";
import prisma from "@/lib/prisma";
import { User, Mail, Shield, MapPin, Calendar, Award, Building2, Phone } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  const profile = await getUserGamificationProfile();

  if (!profile) {
    return <div className="text-rose-500 font-bold p-8">Unable to load profile. Please sign in.</div>;
  }

  return (
    <div className="w-full relative space-y-8">
      {/* Header Section */}
      <header className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 overflow-hidden shrink-0">
            {profile.image ? <img src={profile.image} alt="" className="w-full h-full object-cover" /> : <User size={36} />}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-100 mb-1">
              {profile.name} <span className="text-xs text-slate-500 font-normal">({profile.citizenId || "ID Generation Pending"})</span>
            </h1>
            <div className="inline-block px-3 py-1 bg-blue-900/40 border border-blue-800/60 text-blue-400 text-xs font-bold rounded-full mb-2">
              {profile.role}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location || "India"}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-auto flex justify-end">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
            Edit Profile
          </button>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Details Card */}
          <section className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
              <Shield size={20} className="text-blue-500" /> Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Full Name */}
              <ProfileField
                icon={<User size={14} className="text-slate-500" />}
                label="Full Name"
                value={profile.name}
              />

              {/* Contact Number — placeholder since profile doesn't expose phone */}
              <ProfileField
                icon={<Phone size={14} className="text-slate-500" />}
                label="Contact Number"
                value="Not provided"
                muted
              />

              {/* City */}
              <ProfileField
                icon={<Building2 size={14} className="text-slate-500" />}
                label="City"
                value={profile.location?.split(",")[0]?.trim() || "—"}
              />

              {/* State */}
              <ProfileField
                icon={<MapPin size={14} className="text-slate-500" />}
                label="State"
                value={profile.location?.split(",")[1]?.trim() || "—"}
              />

              {/* Member Since */}
              <ProfileField
                icon={<Calendar size={14} className="text-slate-500" />}
                label="Member Since"
                value={new Date(profile.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              />

              {/* Verification Status */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verification Status</p>
                <div className="text-sm font-semibold">
                  {profile.verificationStatus === "VERIFIED" ? (
                    <span className="text-emerald-400 flex items-center gap-1.5"><Shield size={14} /> VERIFIED · Trust Score {profile.trustScore}/100</span>
                  ) : profile.verificationStatus === "PENDING" ? (
                    <span className="text-amber-400">PENDING VERIFICATION</span>
                  ) : (
                    <span className="text-slate-500">UNVERIFIED</span>
                  )}
                </div>
              </div>

              {/* Email Address — full width */}
              <div className="md:col-span-2">
                <ProfileField
                  icon={<Mail size={14} className="text-slate-500" />}
                  label="Email Address"
                  value={profile.email}
                />
              </div>

            </div>
          </section>

          {/* Community Contributions */}
          <section className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
              <Award size={20} className="text-indigo-400" /> Community Contributions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{profile._count.complaints}</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Issues Reported</div>
              </div>
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{profile._count.votes}</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Verifications Given</div>
              </div>
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{profile.points}</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Contribution Points</div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <HeroWidget
            userName={profile.name || "Citizen"}
            points={profile.points}
            rank={profile.rank}
            nextBadge={profile.nextBadge}
          />
          <BadgeShowcase
            allBadges={await (prisma as any).badge.findMany()}
            userBadges={profile.userBadges}
          />
        </div>

      </div>
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function ProfileField({
  icon,
  label,
  value,
  muted = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      <div className={`flex items-center gap-2 text-sm font-semibold ${muted ? "text-slate-500" : "text-slate-200"}`}>
        {icon}
        {value}
      </div>
    </div>
  );
}
