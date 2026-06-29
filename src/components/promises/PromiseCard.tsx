import { Calendar, Tag, Shield, ShieldOff, Zap } from "lucide-react";
import styles from "./PromiseCard.module.css";
import AICoach from "./AICoach";

interface PromiseCardProps {
  promise: any; // Using any for demo resilience
}

export default function PromiseCard({ promise }: PromiseCardProps) {
  const statusColors = {
    ACTIVE: "#3b82f6",
    COMPLETED: "#10b981",
    FAILED: "#ef4444",
    PAUSED: "#f59e0b",
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.categoryBadge}>
          <Tag size={12} />
          {promise.category}
        </div>
        <div 
          className={styles.statusDot} 
          style={{ backgroundColor: statusColors[promise.status as keyof typeof statusColors] }} 
        />
      </div>

      <h3 className={styles.title}>{promise.title}</h3>
      <p className={styles.description}>{promise.description}</p>

      <div className={styles.progressSection}>
        <div className={styles.progressLabel}>
          <span>Progress</span>
          <span>{promise.completionRate}%</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${promise.completionRate}%`, backgroundColor: statusColors[promise.status as keyof typeof statusColors] }}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.date}>
          <Calendar size={14} />
          {new Date(promise.targetDate).toLocaleDateString()}
        </div>
        <div className={styles.streak}>
          <Zap size={14} />
          {promise.currentStreak} day streak
        </div>
      </div>

      <AICoach promiseId={promise.id} />
    </div>
  );
}
