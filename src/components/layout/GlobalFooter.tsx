"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = {
    platform: [
        { label: "File Complaint", href: "/file-complaint" },
        { label: "Track Issue", href: "/track-complaint" },
        { label: "Community Map", href: "/community-map" },
        { label: "AI Assistant", href: "/ai-assistant" },
        { label: "Dashboard", href: "/dashboard" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Legal Disclaimer", href: "/legal-disclaimer" },
    ],
    contact: [
        { label: "Help Center", href: "/help" },
        { label: "About Us", href: "/about" },
        { label: "Get in Touch", href: "/contact" },
    ],
};

function FooterColumnHeading({ children }: { children: React.ReactNode }) {
    return (
        <h4 className="text-[12px] font-extrabold uppercase tracking-widest mb-6" style={{ color: '#F59E0B' }}>
            {children}
        </h4>
    );
}

export default function GlobalFooter() {
    const pathname = usePathname();

    return (
        <footer className="w-full border-t-2 border-[#F4A261]/80 bg-[#070D19] text-white">
            <div className="w-full" style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '3rem', paddingRight: '3rem', paddingTop: '4rem', paddingBottom: '4rem' }}>
                {/* ── Four-column grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: '5rem' }}>
                    {/* Column 1 – Brand */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl font-black tracking-tight leading-none select-none">
                                <span style={{ color: '#F59E0B' }}>Vaada</span>
                                <span style={{ color: '#1e3a8a' }}>Karo</span>
                            </span>
                            <span className="text-[15px] font-extrabold text-white leading-tight">
                                National Citizen<br />Redressal Portal
                            </span>
                        </div>
                        <p className="text-[13.5px] text-slate-400 leading-relaxed max-w-[280px] mt-2">
                            Empowering India's citizens through technology-driven transparency.
                        </p>
                    </div>

                    {/* Column 2 – Platform */}
                    <div>
                        <FooterColumnHeading>Platform</FooterColumnHeading>
                        <ul className="space-y-6 list-none p-0 m-0">
                            {footerLinks.platform.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href} className="p-0 m-0">
                                        <Link
                                            href={link.href}
                                            className="text-[14px] text-slate-400 transition-colors duration-200 hover:text-white hover:no-underline"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Column 3 – Legal */}
                    <div>
                        <FooterColumnHeading>Legal</FooterColumnHeading>
                        <ul className="space-y-6 list-none p-0 m-0">
                            {footerLinks.legal.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href} className="p-0 m-0">
                                        <Link
                                            href={link.href}
                                            className="text-[14px] text-slate-400 transition-colors duration-200 hover:text-white hover:no-underline"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Column 4 – Contact */}
                    <div>
                        <FooterColumnHeading>Contact</FooterColumnHeading>
                        <ul className="space-y-6 list-none p-0 m-0">
                            {footerLinks.contact.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href} className="p-0 m-0">
                                        <Link
                                            href={link.href}
                                            className="text-[14px] text-slate-400 transition-colors duration-200 hover:text-white hover:no-underline"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* ── Sub-footer / copyright bar ── */}
                <div className="border-t border-slate-800/50 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[13px] text-slate-505">
                        &copy; 2026 VaadaKaro Technologies. All rights reserved.
                    </p>
                    <p className="text-[13px] text-slate-505">Made with trust in India.</p>
                </div>
            </div>
        </footer>
    );
}
