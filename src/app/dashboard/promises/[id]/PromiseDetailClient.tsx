"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProgress, deletePromise, updatePromise } from "@/lib/actions/promiseActions";
import { Calendar, Trash2, Edit3 } from "lucide-react";

interface PromiseDetailClientProps {
  promise: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    status: string;
    completionRate: number;
    targetDate: string | null;
    visibility: string;
    progressEntries: { id: string; percentage: number; note: string | null; createdAt: string }[];
  };
}

export default function PromiseDetailClient({ promise: initial }: PromiseDetailClientProps) {
  const router = useRouter();
  const [promise, setPromise] = useState(initial);
  const [progressPct, setProgressPct] = useState(promise.completionRate);
  const [progressNote, setProgressNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: promise.title,
    description: promise.description || "",
    category: promise.category || "",
  });

  const handleProgress = async () => {
    setSaving(true);
    const result = await addProgress(promise.id, progressPct, progressNote);
    setSaving(false);
    if (result.success) {
      setPromise((prev) => ({
        ...prev,
        completionRate: progressPct,
        status: progressPct >= 100 ? "COMPLETED" : "ACTIVE",
        progressEntries: [
          { id: Date.now().toString(), percentage: progressPct, note: progressNote, createdAt: new Date().toISOString() },
          ...prev.progressEntries,
        ],
      }));
      setProgressNote("");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this promise permanently?")) return;
    const result = await deletePromise(promise.id);
    if (result.success) router.push("/dashboard/promises");
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    const result = await updatePromise(promise.id, editForm);
    setSaving(false);
    if (result.success) {
      setPromise((prev) => ({ ...prev, ...editForm }));
      setEditing(false);
      router.refresh();
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{promise.category}</span>
          {editing ? (
            <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} style={{ display: "block", width: "100%", fontSize: "1.5rem", fontWeight: 800, color: "#1e3a8a", border: "1px solid #cbd5e1", borderRadius: 6, padding: "0.5rem", marginTop: 4 }} />
          ) : (
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e3a8a", margin: "0.25rem 0" }}>{promise.title}</h1>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setEditing(!editing)} style={{ background: "none", border: "1px solid #cbd5e1", borderRadius: 6, padding: 8, cursor: "pointer" }} title="Edit"><Edit3 size={16} /></button>
          <button onClick={handleDelete} style={{ background: "none", border: "1px solid #fecaca", borderRadius: 6, padding: 8, cursor: "pointer", color: "#dc2626" }} title="Delete"><Trash2 size={16} /></button>
        </div>
      </div>

      {editing ? (
        <div style={{ marginBottom: "1.5rem" }}>
          <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #cbd5e1", marginBottom: 8 }} />
          <button onClick={handleSaveEdit} disabled={saving} style={{ padding: "0.5rem 1rem", background: "#1e3a8a", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
        </div>
      ) : (
        <p style={{ color: "#475569", lineHeight: 1.6, marginBottom: "1.5rem" }}>{promise.description}</p>
      )}

      <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem", fontSize: "0.9rem", color: "#64748b" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={16} /> Target: {promise.targetDate ? new Date(promise.targetDate).toLocaleDateString() : "—"}</span>
        <span style={{ fontWeight: 700, color: promise.status === "COMPLETED" ? "#16a34a" : "#1e40af" }}>{promise.status}</span>
        <span>{promise.visibility}</span>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontWeight: 600 }}>
          <span>Progress</span>
          <span>{promise.completionRate}%</span>
        </div>
        <div style={{ height: 10, background: "#e2e8f0", borderRadius: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${promise.completionRate}%`, background: "#1e3a8a", transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={{ background: "#f8fafc", borderRadius: 8, padding: "1rem", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.75rem", color: "#334155" }}>Update Progress</h3>
        <input type="range" min={0} max={100} value={progressPct} onChange={(e) => setProgressPct(Number(e.target.value))} style={{ width: "100%", marginBottom: 8 }} />
        <input type="text" placeholder="Progress note (optional)" value={progressNote} onChange={(e) => setProgressNote(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: 6, border: "1px solid #cbd5e1", marginBottom: 8 }} />
        <button onClick={handleProgress} disabled={saving} style={{ padding: "0.5rem 1rem", background: "#1e3a8a", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}>
          {saving ? "Saving..." : "Save Progress"}
        </button>
      </div>

      {promise.progressEntries.length > 0 && (
        <div>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.75rem", color: "#334155" }}>Timeline</h3>
          {promise.progressEntries.map((entry) => (
            <div key={entry.id} style={{ padding: "0.75rem 0", borderBottom: "1px solid #e2e8f0", fontSize: "0.9rem" }}>
              <strong>{entry.percentage}%</strong> — {entry.note || "Progress updated"}
              <span style={{ float: "right", color: "#94a3b8", fontSize: "0.8rem" }}>{new Date(entry.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
