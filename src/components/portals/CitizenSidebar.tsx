'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Users, Map, Bell, Bot, User, Settings, HelpCircle } from 'lucide-react';
import styles from './sidebar.module.css';

export function CitizenSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/citizen/dashboard', icon: LayoutDashboard },
    { name: 'My Promises', href: '/citizen/promises', icon: CheckSquare },
    { name: 'Community', href: '/citizen/community', icon: Users },
    { name: 'Map', href: '/citizen/map', icon: Map },
    { name: 'AI Assistant', href: '/citizen/ai', icon: Bot },
    { name: 'Notifications', href: '/citizen/notifications', icon: Bell },
  ];

  const bottomItems = [
    { name: 'Profile', href: '?editProfile=true', icon: User },
    { name: 'Settings', href: '/citizen/settings', icon: Settings },
    { name: 'Support', href: '/citizen/support', icon: HelpCircle },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userProfile}>
        <div className={styles.avatar}>{user?.name?.charAt(0) || 'C'}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userRole}>Citizen</div>
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
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
