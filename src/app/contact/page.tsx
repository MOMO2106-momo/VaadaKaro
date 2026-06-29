import styles from "@/components/layout/layout.module.css";

export default function ContactPage() {
  return (
    <div className={styles.pageShell}>
      <section className={styles.heroPanel}>
        <div className={styles.eyebrow}>Get in touch</div>
        <h1 className={styles.pageHeroTitle}>Professional support for every civic concern</h1>
        <p className={styles.pageHeroText}>
          Reach the VaadaKaro support desk for technical issues, grievance appeals, public feedback, or partnership requests. Our team is available during official grievance hours.
        </p>
      </section>

      <div className={styles.contactGrid}>
        <section className={styles.contactCard}>
          <h3>Official contact channels</h3>
          <p><strong>Email:</strong> support@vaadakaro.gov.in</p>
          <p><strong>Hours:</strong> Monday – Saturday, 9:00 AM – 6:00 PM</p>
          <p><strong>Support categories:</strong> Technical issue, Grievance appeal, General inquiry, Partnership request, Platform feedback</p>
          <div className={styles.formActions} style={{ marginTop: "1rem" }}>
            <a className={styles.primaryButton} href="mailto:support@vaadakaro.gov.in">Email support</a>
            <a className={styles.secondaryButton} href="/support">Visit help center</a>
          </div>
        </section>

        <section className={styles.contactCard}>
          <h3>Send a message</h3>
          <form className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" placeholder="Your full name" />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="name@domain.gov.in" />
            </div>
            <div className={styles.field}>
              <label htmlFor="topic">Category</label>
              <input id="topic" name="topic" placeholder="Technical issue, grievance appeal, partnership request" />
            </div>
            <div className={styles.field}>
              <label htmlFor="message">How can we help?</label>
              <textarea id="message" name="message" placeholder="Share the details of your request or concern." />
            </div>
            <div className={styles.formActions}>
              <button className={styles.primaryButton} type="submit">Submit request</button>
              <button className={styles.secondaryButton} type="button">Save draft</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
