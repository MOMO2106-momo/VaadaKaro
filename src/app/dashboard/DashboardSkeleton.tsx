import styles from "./DashboardSkeleton.module.css";

export default function DashboardSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.headerSkeleton} />
      <div className={styles.statsGrid}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.statCard} />
        ))}
      </div>
      <div className={styles.mainGrid}>
        <div className={styles.mainCol}>
          <div className={styles.insightSkeleton} />
          <div className={styles.sectionSkeleton} />
        </div>
        <aside className={styles.sideCol}>
          <div className={styles.widgetSkeleton} />
          <div className={styles.widgetSkeleton} />
        </aside>
      </div>
    </div>
  );
}
