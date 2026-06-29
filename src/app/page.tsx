import styles from "./home.module.css";
import Link from "next/link";
import FloatingModals from "@/components/ui/FloatingModals";
import {
  ArrowRight,
  Rocket,
  LogIn,
  Bot,
  FileSearch,
  AlertCircle,
  FileText,
  Users,
  Map,
  BarChart3,
  HelpCircle,
  MessageSquare,
  Phone,
  Shield,
  Sparkles,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "VaadaAI Legal Assistant",
    description: "Get instant AI-powered legal guidance, rights explanation, document analysis, and step-by-step advice on your civic matter.",
    features: ["Legal guidance", "Rights explanation", "Document analysis", "Instant answers"],
    href: "/ai-assistant",
    badge: "AI-Powered",
    badgeType: "ai",
    action: "Chat with VaadaAI",
  },
  {
    icon: FileSearch,
    title: "RTI Filing",
    description: "File Right to Information requests, track their status, and generate professional RTI drafts to get answers from public authorities.",
    features: ["File RTI", "Track RTI status", "Generate RTI", "Download draft"],
    href: "/generate-docs",
    badge: "Popular",
    badgeType: "popular",
    action: "File an RTI",
  },
  {
    icon: AlertCircle,
    title: "Report Civic Issue",
    description: "Report potholes, broken streetlights, garbage dumps, or any local infrastructure problem with geo-location and photo support.",
    features: ["Upload photos", "Geo-location", "Track complaint", "Status updates"],
    href: "/file-complaint",
    badge: "Trending",
    badgeType: "trending",
    action: "Report Now",
  },
  {
    icon: FileText,
    title: "AI Document Generator",
    description: "Instantly generate legal notices, consumer complaints, police complaints, affidavits, RTI applications, and more using AI.",
    features: ["Legal notices", "Consumer complaints", "Affidavits", "RTI documents"],
    href: "/generate-docs",
    badge: "AI-Powered",
    badgeType: "ai",
    action: "Generate Docs",
  },
  {
    icon: Users,
    title: "Community Promises",
    description: "Make public civic commitments, track their completion with evidence uploads, and build accountability within your community.",
    features: ["Public commitments", "Progress tracking", "Evidence uploads", "Community transparency"],
    href: "/dashboard/promises",
    action: "View Promises",
  },
  {
    icon: Map,
    title: "Community Map",
    description: "Explore an interactive civic map showing active complaints, community projects, escalated issues, and nearby civic reports.",
    features: ["Interactive map", "Active complaints", "Community projects", "Nearby reports"],
    href: "/community-map",
    badge: "Live Data",
    badgeType: "live",
    action: "Open Map",
  },
  {
    icon: BarChart3,
    title: "Civic Dashboard",
    description: "Track your civic impact — complaints filed, RTIs generated, documents created, promise completions, and community engagement scores.",
    features: ["Complaints filed", "RTIs generated", "Docs created", "Community score"],
    href: "/citizen/dashboard",
    action: "View Dashboard",
  },
  {
    icon: HelpCircle,
    title: "Help Center",
    description: "Find answers to FAQs, get AI support, explore legal resources, and connect with our civic assistance team.",
    features: ["FAQs", "AI support", "Legal resources", "Contact support"],
    href: "/support",
    action: "Get Help",
  },
];

const stats = [
  { value: "50,000+", label: "Citizens Served", icon: Users },
  { value: "12,000+", label: "Complaints Resolved", icon: CheckCircle },
  { value: "5,000+", label: "RTIs Filed", icon: FileSearch },
  { value: "99.9%", label: "Uptime Guarantee", icon: Shield },
];

export default async function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroGlowTop} />
        <div className={styles.heroGlowBottom} />

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            <span>AI-Powered Civic Governance Platform</span>
          </div>

          <h1 className={styles.heroTitle}>
            Your Rights. Your Voice.
            <br />
            <span className={styles.heroTitleAccent}>Your VaadaKaro.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            India's most advanced civic platform — powered by AI, built for citizens. File complaints, generate legal documents, track promises, and hold your government accountable.
          </p>

          <div className={styles.heroActions}>
            <Link href="/file-complaint" className={styles.btnPrimary}>
              <Rocket size={18} />
              <span>Get Started Free</span>
            </Link>
            <Link href="/login" className={styles.btnSecondary}>
              <LogIn size={18} />
              <span>Citizen Login</span>
            </Link>
          </div>

          <div className={styles.heroTrust}>
            <Shield size={14} />
            <span>Secure &amp; Government-Grade &nbsp;·&nbsp; WCAG AA Accessible &nbsp;·&nbsp; Free to Use</span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <stat.icon size={20} className={styles.statIcon} />
              <div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services}>
        <div className={styles.servicesHeader}>
          <div className={styles.sectionBadge}>
            <TrendingUp size={14} />
            <span>Civic Services</span>
          </div>
          <h2 className={styles.sectionTitle}>Everything You Need</h2>
          <p className={styles.sectionSubtitle}>
            Eight powerful civic tools — all in one platform. AI-native, accessible, and free.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((service) => (
            <Link key={service.title} href={service.href} className={styles.card}>
              <div className={styles.cardGlow} />
              <div className={styles.cardTop}>
                <div className={styles.cardIconWrap}>
                  <service.icon size={26} strokeWidth={1.75} />
                </div>
                {service.badge && (
                  <span className={`${styles.badge} ${styles[`badge_${service.badgeType}`]}`}>
                    {service.badge}
                  </span>
                )}
              </div>

              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.description}</p>

              <ul className={styles.featureList}>
                {service.features.map((f) => (
                  <li key={f} className={styles.featureItem}>
                    <CheckCircle size={13} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className={styles.cardAction}>
                <span>{service.action}</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <h2>Ready to make your voice heard?</h2>
          <p>Join thousands of citizens building a better, more accountable India.</p>
          <div className={styles.ctaActions}>
            <Link href="/signup" className={styles.ctaBtnPrimary}>
              <Rocket size={18} /> Create Free Account
            </Link>
            <Link href="/ai-assistant" className={styles.ctaBtnOutline}>
              <Bot size={18} /> Try VaadaAI
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Global Modals (AI & Emergency) */}
      <FloatingModals />
    </div>
  );
}
