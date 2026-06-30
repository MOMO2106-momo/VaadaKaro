"use client";

import Link from "next/link";
import { Mail, Lock, ShieldCheck, AlertCircle, ArrowRight, Command } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setIsPending(false);

      if (result?.ok) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setIsPending(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

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
        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '1.75rem' }}>
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-[14px] font-bold flex items-start gap-3 shadow-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
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
            className="w-full mt-4 !rounded-full hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200"
          >
            {isPending ? "Authenticating..." : "Secure Sign In"}
          </Button>
        </form>

        {/* Quick Portal Access */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgb(30 41 59)' }}>
          <p className="text-[11px] text-slate-500 text-center font-bold uppercase tracking-widest mb-4">Quick Portal Access</p>
          <div className="flex justify-center gap-3">
            {[
              { role: 'CITIZEN', label: 'Citizen', emoji: '👤', border: 'hover:border-blue-500/50 hover:bg-blue-500/5', text: 'group-hover:text-blue-400', path: '/citizen/dashboard' },
              { role: 'OFFICER', label: 'Officer', emoji: '🛡️', border: 'hover:border-emerald-500/50 hover:bg-emerald-500/5', text: 'group-hover:text-emerald-400', path: '/officer/dashboard' },
              { role: 'ADMIN', label: 'Admin', emoji: '⚙️', border: 'hover:border-orange-500/50 hover:bg-orange-500/5', text: 'group-hover:text-orange-400', path: '/admin/dashboard' },
              { role: 'SUPER_ADMIN', label: 'Super', emoji: '👑', border: 'hover:border-purple-500/50 hover:bg-purple-500/5', text: 'group-hover:text-purple-400', path: '/super-admin/dashboard' },
            ].map(item => (
              <button
                key={item.role}
                type="button"
                onClick={() => {
                  document.cookie = `demo_role=${item.role}; path=/; max-age=3600; SameSite=Lax`;
                  window.location.href = item.path;
                }}
                className={`w-16 h-16 rounded-full border border-slate-800 ${item.border} flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 shadow-md group`}
              >
                <span className="text-lg leading-none">{item.emoji}</span>
                <span className={`text-[9px] font-bold text-slate-500 ${item.text} uppercase tracking-wider mt-1`}>{item.label}</span>
              </button>
            ))}
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