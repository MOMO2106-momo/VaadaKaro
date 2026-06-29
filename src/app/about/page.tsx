import styles from "@/components/layout/layout.module.css";

const values = [
  {
    title: "Radical Transparency",
    description: "Public complaint tracking, accessible timestamps, clear accountability, and fully transparent governance workflows open to citizens."
  },
  {
    title: "AI-Assisted Accountability",
    description: "AI-powered grievance routing, automated categorization, and intelligent municipal workflow optimization to reduce manual delays."
  },
  {
    title: "Citizen Empowerment",
    description: "Proactive legal guidance, automatic civic awareness context, and AI-driven document generation for navigating complex bureaucracy."
  },
  {
    title: "Community Participation",
    description: "Collaborative community verification, evidence uploads, voting mechanics, and sustained cooperative civic engagement."
  }
];

const capabilities = [
  "Report civic issues with evidence and location precision",
  "Track complaints from submission to resolution",
  "File RTIs with guided document generation",
  "Generate legal notices and evidence-backed drafts",
  "Monitor community promises and public commitments",
  "Engage with transparent governance through real-time updates",
];

export default function AboutPage() {
  return (
    <div className={styles.pageShell}>
      <section className={styles.heroPanel}>
        <div className={styles.eyebrow}>National Civic Redressal Platform</div>
        <h1 className={styles.pageHeroTitle}>About VaadaKaro</h1>
        <p className={styles.pageHeroText}>
          VaadaKaro is the National Citizen Redressal and AI-powered civic governance platform dedicated to bridging the gap between municipal departments, legal clarity, and transparent accountability.
        </p>
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <strong>Mission-first</strong>
            <span>Built for responsible public service delivery and citizen trust.</span>
          </div>
          <div className={styles.statCard}>
            <strong>Evidence-led</strong>
            <span>Each grievance is supported by documentation, tracking, and updates.</span>
          </div>
          <div className={styles.statCard}>
            <strong>Built for India</strong>
            <span>Designed to support urban governance, legal workflows, and civic engagement.</span>
          </div>
        </div>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>What VaadaKaro enables</h2>
          <p className={styles.panelText}>
            The platform brings together public complaint handling, legal assistance, RTI support, and civic promise monitoring in one secure ecosystem. Citizens can move from issue reporting to resolution with confidence, while public departments receive structured, verifiable information.
          </p>
          <ul className={styles.list} style={{ marginTop: "1rem" }}>
            {capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Core values</h2>
          <div className="mt-4 space-y-3">
            {values.map((value) => (
              <details key={value.title} open className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all open:ring-1 open:ring-emerald-500/50">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 select-none list-none [&::-webkit-details-marker]:hidden">
                  {value.title}
                  <span className="transition group-open:rotate-180 text-emerald-500 opacity-80">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </summary>
                <div className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50">
                  {value.description}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
