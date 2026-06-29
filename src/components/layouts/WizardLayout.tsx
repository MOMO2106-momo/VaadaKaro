import React from "react";

// Pure pass-through — the wizard page owns its own bg-slate-50 canvas and
// floating card. This layout exists only for Next.js route grouping.
export default function WizardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
