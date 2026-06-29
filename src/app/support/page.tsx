import styles from "@/components/layout/layout.module.css";
import React from "react";

const faqs = [
  {
    question: "How do I track a complaint?",
    answer:
      "Use your unique Track ID inside the Track Complaint portal to monitor live progress, department updates, and resolution status.",
  },
  {
    question: "What is my Trust Score?",
    answer:
      "Your Trust Score is a gamified civic reputation metric calculated using reporting accuracy, community validation, contribution consistency, and successful issue resolutions.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. All complaints, documents, and personal information are encrypted and processed in accordance with India’s Digital Personal Data Protection (DPDP) Act 2023.",
  },
  {
    question: "How does VaadaAI help me?",
    answer:
      "VaadaAI offers legal guidance, document drafting, complaint assistance, RTI generation, and civic recommendations tailored to your situation.",
  },
];

export default function HelpCenterPage() {
  return (
    <div className={styles.pageShell}>
      <section className={styles.heroPanel}>
        <div className={styles.eyebrow}>Help Center</div>
        <h1 className={styles.pageHeroTitle}>Support for every step of your civic journey</h1>
        <p className={styles.pageHeroText}>
          From filing a grievance to understanding your rights, VaadaKaro gives citizens a trusted path to action, evidence, and follow-through.
        </p>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Frequently asked questions</h2>
          <div className={styles.faqList}>
            {faqs.map((item) => (
              <div key={item.question} className={styles.faqItem}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Need more help?</h2>
          <p className={styles.panelText}>
            Use the AI assistant for instant help with legal drafting, complaint wording, and RTI preparation. For escalations, contact the official support desk.
          </p>
          <div className="mt-6 space-y-3">
            {[
              {
                title: "Technical Issue",
                description: "Describe support requirements for bugs, map rendering glitches, theme syncing, export failures, and severe platform performance issues. Contact support via app feedback."
              },
              {
                title: "Grievance Appeal",
                description: "Challenge incorrectly marked or unjustly 'Resolved' complaints by clicking the Appeal button, generating an AI drafted argument, and submitting additional photographic or document evidence."
              },
              {
                title: "General Inquiry",
                description: "Learn more about upcoming platform features, municipal ward coverage maps, community guidelines, strategic partnerships, and new citizen onboarding processes."
              }
            ].map((section) => (
              <details key={section.title} open className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all open:ring-1 open:ring-emerald-500/50">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 select-none list-none [&::-webkit-details-marker]:hidden">
                  {section.title}
                  <span className="transition group-open:rotate-180 text-emerald-500 opacity-80">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </summary>
                <div className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 mt-1">
                  {section.description}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
