export const dynamic = "force-dynamic";
import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/portals/AdminSidebar';
import styles from '@/components/portals/portal.module.css';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let user = session?.user as any;

  if (!user) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('demo_role')?.value;
    if (demoRole === 'ADMIN' || demoRole === 'DEPARTMENT_ADMIN' || demoRole === 'SUPER_ADMIN') {
      user = {
        name: 'Demo Admin Officer',
        email: 'admin@vaadakaro.gov.in',
        role: demoRole,
        department: 'Public Works'
      };
    }
  }

  if (!user) {
    redirect('/login?callbackUrl=/admin/dashboard');
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'DEPARTMENT_ADMIN' && user?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className={styles.portalContainer}>
      <AdminSidebar user={user} />
      <main className={styles.portalMain}>
        <div className={styles.portalContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
