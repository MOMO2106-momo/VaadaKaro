"use client";

import { MessageSquare, Target, Zap, ShieldAlert } from "lucide-react";
import styles from "./AICoach.module.css";
import { useState } from "react";
import { getAICoachAdvice } from "@/lib/actions/aiCoachActions";

export default function AICoach({ promiseId }: { promiseId: string }) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const askCoach = async () => {
    setLoading(true);
    const res = await getAICoachAdvice(promiseId);
    setAdvice(res);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Zap className={styles.zap} size={20} />
        <h3>AI Accountability Coach</h3>
      </div>

      {!advice && !loading && (
        <button className={styles.askBtn} onClick={askCoach}>
          Get Performance Review
        </button>
      )}

      {loading && <div className={styles.loader}>Analyzing progress...</div>}

      {advice && (
        <div className={styles.advice}>
          <div className={styles.adviceText}>{advice}</div>
          <button className={styles.resetBtn} onClick={() => setAdvice(null)}>Done</button>
        </div>
      )}
    </div>
  );
}
