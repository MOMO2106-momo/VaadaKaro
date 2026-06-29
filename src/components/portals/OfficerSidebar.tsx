'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckCircle2, Briefcase, Users, Map, Bot, FileText, Bell } from 'lucide-react';
import styles from './sidebar.module.css';

export function OfficerSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Command Center', href: '/officer/dashboard', icon: LayoutDashboard },
    { name: 'Verifications', href: '/officer/verifications', icon: CheckCircle2 },
    { name: 'Cases', href: '/officer/cases', icon: Briefcase },
    { name: 'Citizens', href: '/officer/citizens', icon: Users },
    { name: 'Map & Heatmaps', href: '/officer/map', icon: Map },
    { name: 'AI Colleague', href: '/officer/ai', icon: Bot },
    { name: 'Reports', href: '/officer/reports', icon: FileText },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userProfile}>
        <div className={styles.avatar}>{user?.name?.charAt(0) || 'O'}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userRole}>Government Officer</div>
        </div>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.bottomNav}>
        <Link href="/officer/notifications" className={`${styles.navItem} ${pathname === '/officer/notifications' ? styles.active : ''}`}>
          <Bell size={18} />
          <span>Alerts</span>
        </Link>
      </div>
    </aside>
  );
}
