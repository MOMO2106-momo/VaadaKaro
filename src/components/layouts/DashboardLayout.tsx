import React from "react";

// Pure pass-through — the citizen page owns its own dark shell and spacing.
// This layout exists only to satisfy Next.js route grouping.
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
