import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { auth } from '@/auth';
import { logoutUser } from '@/lib/actions/auth-actions';
import { User as UserIcon, LogOut, Search, Menu } from 'lucide-react';
import NotificationCenter from '@/components/features/notifications/NotificationCenter';
import { ThemeToggle } from './ThemeToggle';

export const dynamic = 'force-dynamic';

export const Header = async () => {
  let session = null;

  try {
    session = await auth();
  } catch (error) {
    console.error('Auth context unavailable during pre-render:', error);
  }

  const user = session?.user;

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

            {!user ? (
              <div className={styles.actions}>
                <Link href="/login" className={styles.loginLink}>Sign In</Link>
                <Link href="/signup" className={styles.signupBtn}>Request Account</Link>
              </div>
            ) : (
              <div className={styles.userProfile}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span className={styles.userName}>{user.name || user.email}</span>
                  <span className={styles.userRole}>{(user as any).role || 'Citizen'}</span>
                </div>
                <Link href="/dashboard" className={styles.avatar}>
                  <UserIcon size={20} />
                </Link>
                <NotificationCenter />
                <form action={logoutUser}>
                  <button type="submit" className={styles.logoutBtn} title="Log Out">
                    <LogOut size={20} />
                  </button>
                </form>
              </div>
            )}

            <button type="button" className={styles.mobileMenuBtn} aria-label="Open Mobile Menu">
              <Menu size={24} />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
