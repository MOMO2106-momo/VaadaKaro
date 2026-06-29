"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/40 rounded-2xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Unexpected Error</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          VaadaKaro encountered a problem. The team has been notified. Please try restoring the session.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} /> Restore Platform
          </button>
          <Link
            href="/"
            className="text-slate-500 font-semibold hover:text-slate-900 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
