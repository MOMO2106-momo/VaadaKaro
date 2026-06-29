"use client";

import { setupDemoData } from "@/lib/actions/demoActions";
import { useState } from "react";
import { Terminal, Check, Loader2 } from "lucide-react";
import styles from "./DemoSetup.module.css";
import { useRouter } from "next/navigation";

export default function DemoSetup() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const router = useRouter();

  const handleSetup = async () => {
    setStatus("loading");
    try {
      await setupDemoData();
      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.console}>
        <div className={styles.header}>
          <div className={styles.controls}>
            <span className={styles.red} />
            <span className={styles.yellow} />
            <span className={styles.green} />
          </div>
          <span className={styles.title}>System Provisioning</span>
        </div>
        
        <div className={styles.content}>
          <p className={styles.command}>$ vaadakaro --init --demo-mode</p>
          
          <div className={styles.output}>
            <p className={status !== "idle" ? styles.active : ""}>
              [SYSTEM] Initializing Hackathon Demo Environment...
            </p>
            {status === "loading" && (
              <p className={styles.pulsing}>[PROCESS] Seeding Users, Promises, and Community Metrics...</p>
            )}
            {status === "success" && (
              <p className={styles.success}>[DONE] Environment successfully provisioned. Redirecting...</p>
            )}
            {status === "error" && (
              <p className={styles.error}>[FATAL] Provisioning failed. Check system logs.</p>
            )}
          </div>

          {status === "idle" && (
            <button className={styles.btn} onClick={handleSetup}>
              <Terminal size={18} /> Run Setup
            </button>
          )}

          {status === "loading" && (
            <div className={styles.loader}>
              <Loader2 className={styles.spin} />
              <span>Optimizing Assets...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
