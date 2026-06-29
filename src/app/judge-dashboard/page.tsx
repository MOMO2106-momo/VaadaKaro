import styles from "./JudgeDashboard.module.css";
import { getPlatformMetrics } from "@/lib/actions/demoActions";
import { Activity, Users, Target, ShieldCheck } from "lucide-react";

export default async function JudgeDashboard() {
  const metrics = await getPlatformMetrics();

  const cards = [
    { label: "Platform Resilience", value: `${(metrics as any).success_rate_platform || 0}%`, icon: <Activity />, color: "#10b981" },
    { label: "Community Commitments", value: (metrics as any).total_promises_platform || 0, icon: <Target />, color: "#3b82f6" },
    { label: "Active Citizens", value: (metrics as any).active_communities || 0, icon: <Users />, color: "#f59e0b" },
    { label: "Verified Proofs", value: (metrics as any).total_proofs_verified || 0, icon: <ShieldCheck />, color: "#6366f1" },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.badge}>HACKATHON DEMO MODE</div>
        <h1 className={styles.title}>Judge Oversight Dashboard</h1>
        <p className={styles.subtitle}>High-level platform health and societal impact metrics at a glance.</p>
      </header>

      <div className={styles.metricsGrid}>
        {cards.map((c, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.icon} style={{ color: c.color }}>{c.icon}</div>
            <div className={styles.info}>
              <span className={styles.label}>{c.label}</span>
              <h3 className={styles.value}>{c.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.impactSection}>
        <div className={styles.impactCard}>
          <h2>Why VaadaKaro Wins</h2>
          <div className={styles.benefitGrid}>
            <div className={styles.benefit}>
              <strong>Social Proof</strong>
              <p>Peer-reviewed accountability reduces failure rates by 40%.</p>
            </div>
            <div className={styles.benefit}>
              <strong>AI Efficiency</strong>
              <p>Gemini-powered coaching automates the path to success.</p>
            </div>
            <div className={styles.benefit}>
              <strong>Public Trust</strong>
              <p>Transparent progress history rebuilds civic confidence.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
