export const dynamic = "force-dynamic";
import Link from "next/link";
import { auth } from "@/auth";
import { getUserPromises } from "@/lib/actions/promiseActions";
import { Plus, Target, CheckCircle, Clock } from "lucide-react";

export default async function PromisesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Please log in to view your promises.</div>;
  }

  const promises = await getUserPromises();

  return (
    <div style={{ maxWidth: 960, margin: "2rem auto", padding: "0 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1e3a8a" }}>My Civic Promises</h1>
          <p style={{ color: "#64748b" }}>Track commitments and community accountability goals.</p>
        </div>
        <Link
          href="/dashboard/promises/new"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0.75rem 1.25rem", background: "#1e3a8a", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}
        >
          <Plus size={18} /> New Promise
        </Link>
      </div>

      {promises.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", borderRadius: 12, border: "1px dashed #cbd5e1" }}>
          <Target size={48} color="#94a3b8" style={{ margin: "0 auto 1rem" }} />
          <h2 style={{ color: "#334155", marginBottom: "0.5rem" }}>No promises yet</h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Create your first civic commitment and share it with your community.</p>
          <Link href="/dashboard/promises/new" style={{ color: "#1e3a8a", fontWeight: 700 }}>Create your first promise →</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {promises.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/promises/${p.id}`}
              style={{ display: "block", background: "#fff", borderRadius: 12, padding: "1.25rem 1.5rem", border: "1px solid #e2e8f0", textDecoration: "none", color: "inherit", transition: "box-shadow 0.2s" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{p.category}</span>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e3a8a", margin: "0.25rem 0" }}>{p.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>{p.description?.slice(0, 120)}{(p.description?.length || 0) > 120 ? "..." : ""}</p>
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "4px 10px", borderRadius: 20, background: p.status === "COMPLETED" ? "#dcfce7" : "#dbeafe", color: p.status === "COMPLETED" ? "#166534" : "#1e40af" }}>
                  {p.status}
                </span>
              </div>
              <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {p.targetDate ? new Date(p.targetDate).toLocaleDateString() : "No date"}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={14} /> {p.completionRate}% complete</span>
              </div>
              <div style={{ marginTop: 8, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${p.completionRate}%`, background: "#1e3a8a", borderRadius: 3 }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
