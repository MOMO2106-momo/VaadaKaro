"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-8">
          <Search size={40} />
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Resource Not Found</h2>
        <p className="text-slate-600 mb-10 leading-relaxed">
          The promise or page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-amber-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-200"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
