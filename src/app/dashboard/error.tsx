"use client";

import { useEffect } from "react";
import styles from "./ErrorPage.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>System Interruption</h2>
        <p className={styles.message}>
          The VaadaKaro dashboard encountered a temporary issue. Our engineers are tracking the incident.
        </p>
        <button className={styles.retryBtn} onClick={() => reset()}>
          Restore Session
        </button>
      </div>
    </div>
  );
}
