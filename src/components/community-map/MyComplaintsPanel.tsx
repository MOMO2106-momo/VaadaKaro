"use client";

import { useState } from "react";
import { MapPin, ChevronRight, X, Clock, AlertTriangle, Crosshair, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    SUBMITTED: { bg: "rgba(239,68,68,0.15)", text: "#ef4444", label: "Submitted" },
    UNDER_REVIEW: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", label: "Under Review" },
    IN_PROGRESS: { bg: "rgba(59,130,246,0.15)", text: "#3b82f6", label: "In Progress" },
    RESOLVED: { bg: "rgba(34,197,94,0.15)", text: "#22c55e", label: "Resolved" },
    REJECTED: { bg: "rgba(100,116,139,0.15)", text: "#64748b", label: "Rejected" },
    INFO_REQUESTED: { bg: "rgba(168,85,247,0.15)", text: "#a855f7", label: "Info Requested" },
};

const PRIORITY_COLORS: Record<string, string> = {
    LOW: "#22c55e",
    MEDIUM: "#f59e0b",
    HIGH: "#f97316",
    URGENT: "#ef4444",
};

interface Complaint {
    id: string;
    trackingId: string;
    title: string;
    category: string;
    status: string;
    priority?: string;
    createdAt: string | Date;
    latitude?: number | null;
    longitude?: number | null;
    location?: string | null;
}

interface Props {
    complaints: Complaint[];
    loading: boolean;
    isAuthenticated: boolean;
    selectedId: string | null;
    onLocate: (complaint: Complaint) => void;
    onSelect: (complaint: Complaint) => void;
}

export default function MyComplaintsPanel({ complaints, loading, isAuthenticated, selectedId, onLocate, onSelect }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileSheet, setIsMobileSheet] = useState(false);

    const hasComplaints = complaints.length > 0;

    // Toggle button
    const toggleBtn = (
        <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
                position: "fixed",
                top: "80px",
                right: "16px",
                zIndex: 41,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                color: "#e2e8f0",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                backdropFilter: "blur(12px)",
                transition: "all 0.2s ease",
            }}
        >
            <MapPin size={16} />
            My Complaints
            {hasComplaints && (
                <span style={{
                    background: "#3b82f6",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "1px 7px",
                    borderRadius: "9999px",
                    minWidth: "20px",
                    textAlign: "center",
                }}>
                    {complaints.length}
                </span>
            )}
        </button>
    );

    // Panel content
    const panelContent = (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Header */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingBottom: "12px", borderBottom: "1px solid rgba(148,163,184,0.15)",
                marginBottom: "12px", flexShrink: 0
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.3px" }}>
                        My Complaints
                    </h3>
                    <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#64748b" }}>
                        {complaints.length} report{complaints.length !== 1 ? "s" : ""} filed
                    </p>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        background: "rgba(148,163,184,0.1)", border: "none", borderRadius: "8px",
                        padding: "6px", cursor: "pointer", color: "#94a3b8", display: "flex",
                        transition: "background 0.15s",
                    }}
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>
                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0", color: "#64748b", gap: "8px" }}>
                        <Loader2 size={18} className="animate-spin" />
                        <span style={{ fontSize: "13px" }}>Loading complaints...</span>
                    </div>
                ) : !isAuthenticated ? (
                    <div style={{ padding: "32px 16px", textAlign: "center" }}>
                        <MapPin size={32} style={{ color: "#475569", margin: "0 auto 12px" }} />
                        <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 16px" }}>
                            Sign in to see your filed complaints and track them on the map.
                        </p>
                        <a
                            href="/signin"
                            style={{
                                display: "inline-block", padding: "8px 20px", background: "#3b82f6",
                                color: "white", borderRadius: "8px", textDecoration: "none",
                                fontSize: "12px", fontWeight: 700,
                            }}
                        >
                            Sign In
                        </a>
                    </div>
                ) : !hasComplaints ? (
                    <div style={{ padding: "32px 16px", textAlign: "center" }}>
                        <MapPin size={32} style={{ color: "#475569", margin: "0 auto 12px" }} />
                        <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
                            You haven't filed any complaints yet.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {complaints.map((c) => {
                            const isSelected = selectedId === c.id;
                            const statusMeta = STATUS_COLORS[c.status] || STATUS_COLORS.SUBMITTED;
                            const hasLocation = c.latitude != null && c.longitude != null;
                            const date = new Date(c.createdAt);
                            const dateStr = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

                            return (
                                <div
                                    key={c.id}
                                    onClick={() => onSelect(c)}
                                    style={{
                                        background: isSelected ? "rgba(59,130,246,0.12)" : "rgba(148,163,184,0.06)",
                                        border: `1px solid ${isSelected ? "rgba(59,130,246,0.35)" : "rgba(148,163,184,0.1)"}`,
                                        borderRadius: "10px",
                                        padding: "12px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    {/* Track ID + Status */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                        <span style={{
                                            fontSize: "10px", fontFamily: "monospace", color: "#64748b",
                                            background: "rgba(148,163,184,0.1)", padding: "2px 6px", borderRadius: "4px",
                                        }}>
                                            {c.trackingId.slice(0, 8).toUpperCase()}
                                        </span>
                                        <span style={{
                                            fontSize: "10px", fontWeight: 700, padding: "2px 8px",
                                            borderRadius: "9999px", background: statusMeta.bg, color: statusMeta.text,
                                        }}>
                                            {statusMeta.label}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h4 style={{
                                        margin: "0 0 6px", fontSize: "13px", fontWeight: 700,
                                        color: "#e2e8f0", lineHeight: 1.3,
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                    }}>
                                        {c.title}
                                    </h4>

                                    {/* Category + Priority + Date */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                                        <span style={{ fontSize: "10px", color: "#94a3b8", background: "rgba(148,163,184,0.1)", padding: "1px 6px", borderRadius: "4px" }}>
                                            {c.category}
                                        </span>
                                        {c.priority && (
                                            <span style={{
                                                fontSize: "10px", fontWeight: 700,
                                                color: PRIORITY_COLORS[c.priority] || "#94a3b8",
                                            }}>
                                                <AlertTriangle size={9} style={{ display: "inline", marginRight: "2px", verticalAlign: "middle" }} />
                                                {c.priority}
                                            </span>
                                        )}
                                        <span style={{ fontSize: "10px", color: "#64748b", marginLeft: "auto" }}>
                                            <Clock size={9} style={{ display: "inline", marginRight: "3px", verticalAlign: "middle" }} />
                                            {dateStr}
                                        </span>
                                    </div>

                                    {/* Locate button */}
                                    {hasLocation && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onLocate(c);
                                            }}
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "6px",
                                                padding: "7px 0",
                                                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "8px",
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            <Crosshair size={13} />
                                            Locate on Map
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Toggle button (always visible) */}
            {!isOpen && toggleBtn}

            {/* Desktop sidebar panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: 340, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 340, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="complaints-panel-desktop"
                        style={{
                            position: "fixed",
                            top: "76px",
                            right: "16px",
                            width: "320px",
                            maxHeight: "calc(100vh - 100px)",
                            background: "rgba(15, 23, 42, 0.92)",
                            backdropFilter: "blur(16px) saturate(180%)",
                            WebkitBackdropFilter: "blur(16px) saturate(180%)",
                            border: "1px solid rgba(148,163,184,0.15)",
                            borderRadius: "16px",
                            boxShadow: "0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(148,163,184,0.05)",
                            padding: "16px",
                            zIndex: 40,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                        }}
                    >
                        {panelContent}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile bottom sheet styles injected via global CSS handled in page */}
            <style jsx global>{`
        @media (max-width: 768px) {
          .complaints-panel-desktop {
            top: unset !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-height: 60vh !important;
            border-radius: 20px 20px 0 0 !important;
            border-bottom: none !important;
          }
        }
      `}</style>
        </>
    );
}
