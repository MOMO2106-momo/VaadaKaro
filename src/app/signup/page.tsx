"use client";

import Link from "next/link";
import { User, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Phone, Calendar, MapPin } from "lucide-react";
import { useActionState } from "react";
import { registerUser } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
  const [state, action, isPending] = useActionState(registerUser, undefined);

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-[800px] bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-8 lg:p-10 flex flex-col relative overflow-hidden">
        {/* Subtle Top Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner">
            <ShieldCheck size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Create Official Account
            </h1>
            <p className="text-[15px] text-slate-300 leading-relaxed max-w-lg mx-auto">
              Join the National Citizen Redressal Portal to file grievances, track updates, and generate automated drafts.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <form action={action} className="flex flex-col" style={{ gap: '2.5rem' }}>
          {/* Status Messages */}
          {state?.error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-[14px] font-bold flex items-start gap-3 shadow-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="leading-snug">{state.error}</span>
            </div>
          )}

          {state?.success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-[14px] font-bold flex items-start gap-3 shadow-sm">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <span className="leading-snug">{state.success}</span>
            </div>
          )}

          {/* Account Details Group */}
          <div className="flex flex-col" style={{ gap: '1.5rem' }}>
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-3">
              Account Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
              <Input
                label="Full Legal Name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                icon={User}
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@domain.gov"
                required
                icon={Mail}
              />
            </div>

            <Input
              label="Secure Password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              icon={Lock}
              helperText="Minimum 8 characters with mixed case and numbers"
            />
          </div>

          {/* Personal Details Group */}
          <div className="flex flex-col" style={{ gap: '1.5rem' }}>
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-3">
              Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="9876543210"
                required
                icon={Phone}
              />

              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                required
                icon={Calendar}
              />

              <Input
                label="City"
                name="city"
                type="text"
                placeholder="Mumbai"
                required
                icon={MapPin}
              />

              <Input
                label="State / Region"
                name="state"
                type="text"
                placeholder="Maharashtra"
                required
                icon={MapPin}
              />
            </div>
          </div>

          {/* Consents Area */}
          <div className="flex flex-col p-6 bg-[#1A2234] border border-slate-800 rounded-2xl" style={{ gap: '1.25rem' }}>
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                name="civicIdConsent"
                style={{ width: '20px', height: '20px', minWidth: '20px', accentColor: '#059669', marginTop: '2px', cursor: 'pointer' }}
              />
              <div className="flex-1">
                <p className="text-[15px] font-bold text-slate-200">Generate VaadaKaro Civic ID</p>
                <p className="text-[13px] text-slate-400 mt-1 leading-snug">Opt-in to public leaderboard tracking and civic gamification.</p>
              </div>
            </label>

            <div className="h-px w-full bg-slate-800/50" />

            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                name="consent"
                required
                style={{ width: '20px', height: '20px', minWidth: '20px', accentColor: '#059669', marginTop: '2px', cursor: 'pointer' }}
              />
              <div className="flex-1">
                <p className="text-[13px] text-slate-400 leading-snug">
                  I agree to the <a href="/terms" target="_blank" style={{ color: '#F59E0B', fontWeight: '700', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Terms &amp; Conditions</a> and <a href="/privacy" target="_blank" style={{ color: '#F59E0B', fontWeight: '700', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Privacy Policy</a>.
                </p>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isPending}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full mt-6"
          >
            {isPending ? "Connecting to portal..." : "Register Citizen Account"}
          </Button>
        </form>

        {/* Footer Section */}
        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-[14px] text-slate-400">
            Already a registered citizen?{" "}
            <Link
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 font-bold underline-offset-4 hover:underline"
            >
              Sign In to Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}