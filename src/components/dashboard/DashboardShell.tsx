"use client";

import React from "react";
import GlobalFooter from "@/components/layout/GlobalFooter";


export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-[#070d19] text-slate-100 font-sans antialiased box-border">
            {/* ── Constrained content area grows to fill viewport ── */}
            <div className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 pt-8 pb-16 flex flex-col gap-6 animate-in fade-in duration-500 ease-out">
                {children}
            </div>
            {/* ── Single global footer — outside the content grid ── */}
            <GlobalFooter />

        </div>
    );
}
