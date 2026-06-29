"use client";

import React from "react";


/**
 * WizardShell
 *
 * Provides the full-page dark background for the complaint wizard.
 * Children are NOT wrapped in a constrained inner container so that
 * sibling sections (e.g. the global footer) can span the full width
 * while still sitting on the same dark background.
 */
export default function WizardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#070d19] text-slate-100 font-sans antialiased box-border animate-in fade-in duration-500">
            {children}
            
        </div>
    );
}
