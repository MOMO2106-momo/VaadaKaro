"use client";

import { useEffect, useState } from "react";

/**
 * useDemoMode — reads ?demo=true from URL without SSR mismatch.
 * Safe to call in any client component.
 */
export function useDemoMode(): boolean {
  const [isDemo, setIsDemo] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsDemo(params.get("demo") === "true");
  }, []);
  return isDemo;
}
