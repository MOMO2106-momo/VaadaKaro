"use client";

import React from "react";
import BaseCard from "@/components/ui/BaseCard";

export default function WizardCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <BaseCard
            className={className}
        >
            <main aria-label="Complaint filing wizard main content">
                {children}
            </main>
        </BaseCard>
    );
}
