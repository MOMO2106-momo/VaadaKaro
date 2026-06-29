"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MessageSquare, Phone, X, AlertCircle, Bot, LayoutDashboard, Info, HelpCircle, Settings, PhoneCall } from "lucide-react";

export default function FloatingModals() {
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

    const aiRef = useRef<HTMLDivElement>(null);
    const emergencyRef = useRef<HTMLDivElement>(null);

    // Close modals when Escape key is pressed or clicking outside
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsAiOpen(false);
                setIsEmergencyOpen(false);
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (!isAiOpen && !isEmergencyOpen) return;

            const target = e.target as Node;
            const clickedInAi = aiRef.current?.contains(target);
            const clickedInEmergency = emergencyRef.current?.contains(target);
            const clickedButton = (target as HTMLElement).closest('button');

            if (!clickedInAi && !clickedInEmergency && !clickedButton) {
                setIsAiOpen(false);
                setIsEmergencyOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isAiOpen, isEmergencyOpen]);

    const emergencyContacts = [
        { name: "National Emergency", number: "112" },
        { name: "Police", number: "100" },
        { name: "Ambulance", number: "108" },
        { name: "Fire Brigade", number: "101" },
        { name: "Women Helpline", number: "1091" },
        { name: "Cyber Crime", number: "1930" },
    ];

    return (
        <>
            {/* Floating action buttons */}
            <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-4 items-center">
                {/* Chat / AI Button */}
                <button
                    onClick={() => { setIsAiOpen(!isAiOpen); setIsEmergencyOpen(false); }}
                    className="p-[10px] bg-slate-900/80 backdrop-blur-md text-white drop-shadow-xl hover:scale-110 opacity-90 hover:opacity-100 transition-all rounded-full border border-white/10"
                    title="Chat with VaadaAI"
                    aria-label="Open VaadaKaro support"
                >
                    <MessageSquare size={26} strokeWidth={1.5} />
                </button>
                {/* Emergency Button */}
                <button
                    onClick={() => { setIsEmergencyOpen(!isEmergencyOpen); setIsAiOpen(false); }}
                    className="p-[10px] bg-slate-900/80 backdrop-blur-md text-red-400 drop-shadow-xl hover:scale-110 opacity-90 hover:opacity-100 transition-all rounded-full border border-white/10"
                    title="Emergency Services"
                    aria-label="Open emergency contacts"
                >
                    <Phone size={26} strokeWidth={1.5} />
                </button>
            </div>

            {/* AI Support Popup */}
            <AnimatePresence>
                {isAiOpen && (
                    <motion.div
                        ref={aiRef}
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-24 right-6 w-80 sm:w-96 bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl z-[70] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
                            <div className="flex items-center gap-3 text-white">
                                <Bot size={24} className="text-emerald-400" />
                                <h3 className="font-bold text-lg">VaadaKaro Support</h3>
                            </div>
                            <button
                                onClick={() => setIsAiOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors focus:outline-none"
                                aria-label="Close support panel"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                VaadaKaro is an AI-powered National Civic Redressal and Legal Assistance Platform helping citizens report civic issues, access AI-powered legal guidance, and track grievance resolution.
                            </p>
                            <div className="flex flex-col gap-2">
                                {[
                                    { href: "/file-complaint", icon: <AlertCircle size={18} className="text-emerald-400" />, label: "Report Civic Issue" },
                                    { href: "/ai-assistant", icon: <Bot size={18} className="text-blue-400" />, label: "VaadaAI Assistant" },
                                    { href: "/citizen/dashboard", icon: <LayoutDashboard size={18} className="text-purple-400" />, label: "Dashboard" },
                                    { href: "/about", icon: <Info size={18} className="text-sky-400" />, label: "About Us" },
                                    { href: "/support", icon: <HelpCircle size={18} className="text-amber-400" />, label: "Help Center" },
                                    { href: "/dashboard/settings", icon: <Settings size={18} className="text-slate-400" />, label: "User Settings" },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        onClick={() => setIsAiOpen(false)}
                                        href={item.href}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800 transition-colors text-slate-200 font-medium text-sm"
                                    >
                                        {item.icon} {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Emergency Contacts Popup */}
            <AnimatePresence>
                {isEmergencyOpen && (
                    <motion.div
                        ref={emergencyRef}
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed bottom-24 right-6 w-80 sm:w-96 bg-[#0f172a] border border-red-900/50 rounded-2xl shadow-2xl z-[70] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <AlertCircle size={24} />
                                <h3 className="font-bold text-lg">Emergency Contacts</h3>
                            </div>
                            <button
                                onClick={() => setIsEmergencyOpen(false)}
                                className="text-red-200 hover:text-white transition-colors focus:outline-none"
                                aria-label="Close emergency panel"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Contact grid */}
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {emergencyContacts.map((contact, i) => (
                                <a
                                    key={i}
                                    href={`tel:${contact.number}`}
                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 transition-all text-center group"
                                >
                                    <PhoneCall size={28} className="text-red-400 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide leading-tight">{contact.name}</div>
                                        <div className="text-lg font-black text-red-400">{contact.number}</div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Footer bar */}
                        <div className="px-6 py-3 bg-slate-800 text-xs text-red-400 text-center font-medium border-t border-slate-800">
                            Tap directly on any number to dial automatically.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
