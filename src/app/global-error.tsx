"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Critical Failure:", error);
  }, [error]);

  return (
    <html>
      <body className="flex items-center justify-center min-h-screen bg-slate-50 font-sans">
        <div className="max-w-xl p-12 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Critical System Error</h1>
          <p className="text-slate-500 mb-8 text-lg">
            VaadaKaro encountered a kernel-level issue. This is usually due to database connectivity.
          </p>
          <button
            onClick={() => reset()}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform"
          >
            Reboot Application
          </button>
        </div>
      </body>
    </html>
  );
}
