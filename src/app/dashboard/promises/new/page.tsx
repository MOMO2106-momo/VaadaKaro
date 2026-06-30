"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Globe, Lock } from "lucide-react";
import { createPromise } from "@/lib/actions/promiseActions";

const CATEGORIES = [
  "Infrastructure",
  "Sanitation",
  "Community Service",
  "Environment",
  "Education",
  "Health",
  "Personal Accountability",
  "Other",
];

export default function NewPromisePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Community Service",
    targetDate: "",
    visibility: "PUBLIC",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createPromise(form);
    setLoading(false);

    if (result.success && result.id) {
      router.push(`/dashboard/promises/${result.id}`);
    } else {
      setError(result.error || "Failed to create promise");
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1.5rem" }}>
      <Link href="/dashboard/promises" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#1e3a8a", marginBottom: "1.5rem", textDecoration: "none", fontWeight: 600 }}>
        <ArrowLeft size={18} /> Back to Promises
      </Link>

      <div style={{ background: "#fff", borderRadius: 12, padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1e3a8a", marginBottom: "0.5rem" }}>Create Civic Promise</h1>
        <p style={{ color: "#64748b", marginBottom: "2rem" }}>Make a public commitment your community can track and hold you accountable to.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#334155" }}>Promise Title *</label>
            <input
              required
              maxLength={150}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Fix the broken streetlight on Ward 14"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                fontSize: "1rem",
                color: "#111827",
                backgroundColor: "#fff",
                // placeholder color via ::placeholder pseudo not possible inline, use CSS class fallback
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#334155" }}>Description *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your commitment, expected outcome, and how the community will benefit..."
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                fontSize: "1rem",
                resize: "vertical",
                color: "#111827",
                backgroundColor: "#fff",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, marginBottom: 6, color: "#334155" }}>
                <Tag size={16} /> Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  color: "#111827",
                  backgroundColor: "#fff",
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, marginBottom: 6, color: "#334155" }}>
                <Calendar size={16} /> Target Date *
              </label>
              <input
                required
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#334155" }}>Visibility</label>
            <div style={{ display: "flex", gap: "1rem" }}>
              {[
                { value: "PUBLIC", label: "Public", icon: Globe },
                { value: "PRIVATE", label: "Private", icon: Lock },
              ].map(({ value, label, icon: Icon }) => (
                <label key={value} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  padding: "0.5rem 1rem",
                  borderRadius: 8,
                  border: form.visibility === value ? "2px solid #1e3a8a" : "1px solid #cbd5e1",
                  background: form.visibility === value ? "#eff6ff" : "#fff",
                  color: "#111827",
                }}>
                  <input type="radio" name="visibility" value={value} checked={form.visibility === value} onChange={() => setForm({ ...form, visibility: value })} style={{ display: "none" }} />
                  <Icon size={16} /> {label}
                </label>
              ))}
            </div>
          </div>

          {error && <p style={{ color: "#dc2626", fontSize: "0.9rem" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: "0.875rem", background: loading ? "#94a3b8" : "#1e3a8a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Creating..." : "Create Promise"}
          </button>
        </form>
      </div>
    </div>
  );
}
