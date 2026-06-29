"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, AlertCircle, MapPin } from "lucide-react";
import styles from "./dashboard.module.css";

interface ComplaintData {
  id: string;
  trackingId: string;
  category: string;
  status: string;
  createdAt: Date | string;
}

// Returns CSS class name for a status
function statusClass(status: string) {
  const map: Record<string, string> = {
    IN_PROGRESS: styles.statusIN_PROGRESS,
    UNDER_REVIEW: styles.statusUNDER_REVIEW,
    SUBMITTED: styles.statusSUBMITTED,
    RESOLVED: styles.statusRESOLVED,
    REJECTED: styles.statusREJECTED,
  };
  return map[status] || styles.statusSUBMITTED;
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export default function ComplaintsTable({ complaints, loading = false }: { complaints: ComplaintData[]; loading?: boolean }) {
  const [query, setQuery] = useState("");

  const filtered = complaints.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.trackingId.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  });

  const SkeletonCard = () => (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col h-full animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 w-20 bg-slate-800 rounded-full" />
        <div className="h-3 w-16 bg-slate-800 rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-slate-800 rounded-md mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-slate-800 rounded-md" />
        <div className="h-3 w-5/6 bg-slate-800 rounded-md" />
      </div>
      <div className="mt-auto flex justify-end">
        <div className="w-12 h-12 bg-slate-800 rounded-xl" />
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2>My Submissions</h2>
        <div className={styles.searchBar}>
          <Search size={14} />
          <input
            type="text"
            placeholder="Search complaints..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.complaintsGrid}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={`${styles.skeleton} ${styles.skeletonAvatar}`} style={{ margin: '0 auto 1rem' }} />
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} style={{ margin: '0 auto 1rem', width: '280px' }} />
            <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ margin: '0 auto 1rem', width: '320px' }} />
            {complaints.length === 0 && (
              <Link href="/file-complaint" className={styles.nextBtn} style={{ marginTop: '1rem', display: 'inline-flex' }}>
                Lodge your first grievance
              </Link>
            )}
          </div>
        ) : (
          filtered.map((complaint) => (
            <Link
              key={complaint.id}
              href={`/track-complaint?id=${complaint.trackingId}`}
              className="group block bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 border-t-emerald-500/20 rounded-2xl p-5 shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Subtle top glare */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Status pill + Date */}
              <div className="flex items-center justify-between xl:mb-2 2xl:mb-4">
                <span className={`${styles.statusPill} ${statusClass(complaint.status)} shadow-sm`}>
                  {statusLabel(complaint.status)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Card body: title + text + map thumb */}
              <div className="flex gap-4 items-start pb-1">
                <div className="flex-1">
                  <div className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-1">
                    {complaint.category}
                  </div>
                  <div className="text-xs text-slate-500">Track ID: <span className="font-mono text-slate-400">{complaint.trackingId}</span></div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-colors shadow-inner">
                  <span className="text-emerald-500"><MapPin size={18} /></span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}