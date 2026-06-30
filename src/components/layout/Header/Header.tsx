import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { Search, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import HeaderUserSection from './HeaderUserSection';

export const dynamic = 'force-dynamic';

export const Header = () => {

  return (
    <header className={styles.header}>
      <div className={styles.mainHeader}>
        <div className={styles.container}>

          <Link href="/" className={styles.logoWrapper}>
            <div className={styles.logoIcon}>
              <Image src="/logo.png" alt="VaadaKaro" width={36} height={36} style={{ borderRadius: '8px', objectFit: 'cover' }} />
            </div>
            <div className={styles.logoTitle}>Vaada<span>Karo</span></div>
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={styles.navItem}>Home</Link>
            <Link href="/dashboard" className={styles.navItem}>Dashboard</Link>
            <Link href="/city-wide-impact" className={styles.navItem}>Impact</Link>
            <Link href="/community-map" className={styles.navItem}>Map</Link>
            <Link href="/ai-assistant" className={styles.navItem}>VaadaAI</Link>
            <Link href="/leaderboard" className={styles.navItem}>Community</Link>
          </nav>

          <div className={styles.navActions}>
            <div className={styles.searchWrapper}>
              <Search size={18} />
              <input type="text" placeholder="Search services, forms, laws..." />
            </div>

            <button className={`${styles.iconBtn} ${styles.langToggle}`} title="Change Language">
              EN
            </button>

            <ThemeToggle />

            <HeaderUserSection />

            <button type="button" className={styles.mobileMenuBtn} aria-label="Open Mobile Menu">
              <Menu size={24} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
