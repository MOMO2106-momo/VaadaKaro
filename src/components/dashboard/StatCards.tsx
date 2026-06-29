import { CheckCircle, Clock, Target, TrendingUp } from "lucide-react";
import styles from "./StatCards.module.css";

interface StatsProps {
  total: number;
  active: number;
  completed: number;
  successRate: number;
}

export default function StatCards({ total, active, completed, successRate }: StatsProps) {
  const stats = [
    { label: "Total Promises", value: total, icon: Target, color: "var(--brand-navy)" },
    { label: "Active Pursuits", value: active, icon: Clock, color: "var(--brand-gold)" },
    { label: "Completed Goals", value: completed, icon: CheckCircle, color: "#22c55e" },
    { label: "Success Rate", value: `${successRate}%`, icon: TrendingUp, color: "var(--brand-navy)" },
  ];

  return (
    <div className={styles.container}>
      {stats.map((stat, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.statInfo}>
            <p className={styles.label}>{stat.label}</p>
            <h3 className={styles.value}>{stat.value}</h3>
          </div>
          <div className={styles.iconWrapper} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
            <stat.icon size={20} />
          </div>
        </div>
      ))}
    </div>
  );
}
