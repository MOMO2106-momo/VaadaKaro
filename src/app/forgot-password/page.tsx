"use client";

import Link from "next/link";
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-6 lg:p-12">
      <div className="max-w-[1440px] w-full mx-auto flex justify-center">

        {/* Spacious Centered Card */}
        <div className="w-full max-w-[500px] bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-8 lg:p-10 flex flex-col relative overflow-hidden">

          {/* Subtle Top Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-500"></div>

          {/* Header Section */}
          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Reset Password</h1>
              <p className="text-slate-400 text-sm lg:text-base font-medium">
                Enter your registered official email to receive a secure reset link.
              </p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl text-[14px] font-bold flex items-start gap-3 shadow-sm mb-6">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span className="leading-snug">Password resets are currently disabled globally by administration.</span>
          </div>

          {/* Form Section */}
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[13px] font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
                <input
                  type="email"
                  placeholder="name@domain.gov"
                  disabled
                  className="w-full bg-[#1A2234] border border-slate-700/50 rounded-xl py-4 pl-12 pr-4 text-[15px] text-white opacity-50 cursor-not-allowed shadow-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled
              className="mt-4 w-full bg-slate-800 text-slate-500 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-not-allowed text-[15px] uppercase tracking-wide group"
            >
              Send Reset Link
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Nav */}
          <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col items-center gap-4">
            <Link href="/login" className="flex items-center gap-2 text-[14px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest outline-none focus:underline">
              <ArrowLeft size={16} /> Back to Log In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
