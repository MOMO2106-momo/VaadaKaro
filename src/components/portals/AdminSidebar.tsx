'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Building, Tags, Activity, FileText, Settings } from 'lucide-react';
import styles from './sidebar.module.css';

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Officers', href: '/admin/officers', icon: Users },
    { name: 'Departments', href: '/admin/departments', icon: Building },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Analytics', href: '/admin/analytics', icon: Activity },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userProfile}>
        <div className={styles.avatar} style={{ backgroundColor: '#1d4ed8' }}>{user?.name?.charAt(0) || 'A'}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userRole}>Department Admin</div>
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
        <Link href="/admin/settings" className={`${styles.navItem} ${pathname === '/admin/settings' ? styles.active : ''}`}>
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
