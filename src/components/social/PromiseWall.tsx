"use client";

import { useEffect, useState } from "react";
import styles from "./PromiseWall.module.css";
import { Heart, Share2, Zap } from "lucide-react";

export default function PromiseWall({ promises: initialPromises = [] }: { promises?: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={styles.wallLoading}>Initializing Promise Wall...</div>;
  }

  return (
    <div className={styles.wall}>
      <div className={styles.header}>
        <Zap className={styles.icon} />
        <h2>Public Promise Wall</h2>
        <p>Real-time commitments from your community.</p>
      </div>

      <div className={styles.feed}>
        {initialPromises.map((p: any) => (
          <div key={p.id} className={styles.post}>
            <div className={styles.postHeader}>
              <div className={styles.avatar}>
                {p.user?.name?.[0] || "U"}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{p.user?.name}</span>
                <span className={styles.category}>{p.category}</span>
              </div>
            </div>

            <h3 className={styles.postTitle}>{p.title}</h3>
            <p className={styles.postDesc}>{p.description}</p>

            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>Progress</span>
                <span>{p.completionRate}%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${p.completionRate}%` }} />
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.actionBtn}>
                <Heart size={16} /> {p.reactions?.length || 0} Cheers
              </button>
              <button className={styles.actionBtn}>
                <Share2 size={16} /> Share Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
