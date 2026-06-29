"use client";

import { useEffect, useState, ReactNode } from "react";

interface SpinnerGuardProps {
  loading: boolean;
  timeoutMs?: number;
  children: ReactNode;
  /** Shown after timeout instead of eternal spinner */
  fallback?: ReactNode;
}

const DEFAULT_FALLBACK = (
  <div style={{
    padding: "2rem",
    textAlign: "center",
    background: "#f8fafc",
    borderRadius: "8px",
    color: "#64748b",
    border: "1px dashed #cbd5e1"
  }}>
    <p style={{ margin: 0, fontWeight: 500 }}>Content is loading — please wait a moment.</p>
  </div>
);

/**
 * SpinnerGuard — wraps any loading state.
 * If `loading` is still true after `timeoutMs` (default 3000ms),
 * renders the fallback instead of spinning forever.
 */
export default function SpinnerGuard({ loading, timeoutMs = 3000, children, fallback }: SpinnerGuardProps) {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!loading) { setTimedOut(false); return; }
    const id = setTimeout(() => setTimedOut(true), timeoutMs);
    return () => clearTimeout(id);
  }, [loading, timeoutMs]);

  if (!loading) return <>{children}</>;
  if (timedOut) return <>{fallback || DEFAULT_FALLBACK}</>;

  return (
    <div style={{
      padding: "2rem",
      textAlign: "center",
      color: "#64748b",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem"
    }}>
      <div style={{
        width: "32px", height: "32px", borderRadius: "50%",
        border: "3px solid #e2e8f0", borderTopColor: "#3b82f6",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ margin: 0 }}>Loading civic data...</p>
    </div>
  );
}
