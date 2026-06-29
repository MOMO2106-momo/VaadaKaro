"use client";

import Link from "next/link";
import { Mail, Lock, ShieldCheck, AlertCircle, ArrowRight, Command } from "lucide-react";
import { useActionState } from "react";
import { loginUser } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginUser, undefined);

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-[500px] bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-8 lg:p-10 flex flex-col relative overflow-hidden">
        {/* Subtle Top Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-500" />

        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner">
            <Command size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[15px] text-slate-300 leading-relaxed max-w-sm">
              Sign in to access your civic dashboard and track official grievances.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form action={action} className="flex flex-col" style={{ gap: '1.75rem' }}>
          {state?.error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-[14px] font-bold flex items-start gap-3 shadow-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="leading-snug">{state.error}</span>
            </div>
          )}

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@domain.gov"
            required
            icon={Mail}
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[13px] font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[13px] text-blue-400 hover:text-blue-300 transition-colors font-bold underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              icon={Lock}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isPending}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full mt-4"
          >
            {isPending ? "Authenticating..." : "Secure Sign In"}
          </Button>
        </form>

        {/* Quick Portal Access */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgb(30 41 59)' }}>
          <p className="text-[11px] text-slate-500 text-center font-bold uppercase tracking-widest mb-3">Quick Portal Access</p>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => {
                document.cookie = "demo_role=CITIZEN; path=/; max-age=3600; SameSite=Lax";
                window.location.href = "/citizen/dashboard";
              }}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition text-center group w-full"
            >
              <span className="text-lg">👤</span>
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-400 transition">Citizen</span>
            </button>
            <button
              type="button"
              onClick={() => {
                document.cookie = "demo_role=OFFICER; path=/; max-age=3600; SameSite=Lax";
                window.location.href = "/officer/dashboard";
              }}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition text-center group w-full"
            >
              <span className="text-lg">🛡️</span>
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-400 transition">Officer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                document.cookie = "demo_role=ADMIN; path=/; max-age=3600; SameSite=Lax";
                window.location.href = "/admin/dashboard";
              }}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-slate-800 hover:border-orange-500/50 hover:bg-orange-500/5 transition text-center group w-full"
            >
              <span className="text-lg">⚙️</span>
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-orange-400 transition">Admin</span>
            </button>
            <button
              type="button"
              onClick={() => {
                document.cookie = "demo_role=SUPER_ADMIN; path=/; max-age=3600; SameSite=Lax";
                window.location.href = "/super-admin/dashboard";
              }}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-slate-800 hover:border-purple-500/50 hover:bg-purple-500/5 transition text-center group w-full"
            >
              <span className="text-lg">👑</span>
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-purple-400 transition">Super</span>
            </button>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col items-center" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgb(30 41 59)', gap: '1.25rem' }}>
          <p className="text-[14px] text-slate-400 text-center">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-300 font-bold underline-offset-4 hover:underline"
            >
              Create Citizen Account
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-[12px] text-slate-500 font-bold bg-[#1A2234] px-4 py-2 rounded-full border border-slate-800">
            <ShieldCheck size={14} className="text-emerald-500" />
            Data Encrypted & Protected
          </div>
        </div>
      </div>
    </div>
  );
}