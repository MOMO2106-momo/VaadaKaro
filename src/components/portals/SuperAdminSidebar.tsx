'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Server, Users, Key, Building, Settings, Activity, Shield, ActivityIcon } from 'lucide-react';
import styles from './sidebar.module.css';

export function SuperAdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Platform Control', href: '/super-admin/dashboard', icon: Server },
    { name: 'Users', href: '/super-admin/users', icon: Users },
    { name: 'Roles', href: '/super-admin/roles', icon: Key },
    { name: 'Departments', href: '/super-admin/departments', icon: Building },
    { name: 'Audit Logs', href: '/super-admin/audit', icon: Activity },
    { name: 'API Monitor', href: '/super-admin/api', icon: ActivityIcon },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userProfile}>
        <div className={styles.avatar} style={{ backgroundColor: '#7e22ce' }}>{user?.name?.charAt(0) || 'S'}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userRole}>Super Admin</div>
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
        <Link href="/super-admin/security" className={`${styles.navItem} ${pathname === '/super-admin/security' ? styles.active : ''}`}>
          <Shield size={18} />
          <span>Security</span>
        </Link>
        <Link href="/super-admin/system" className={`${styles.navItem} ${pathname === '/super-admin/system' ? styles.active : ''}`}>
          <Settings size={18} />
          <span>System Settings</span>
        </Link>
      </div>
    </aside>
  );
}
