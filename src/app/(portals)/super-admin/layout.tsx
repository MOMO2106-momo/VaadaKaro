export const dynamic = "force-dynamic";
import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SuperAdminSidebar } from '@/components/portals/SuperAdminSidebar';
import styles from '@/components/portals/portal.module.css';

export default async function SuperAdminLayout({
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
    if (demoRole === 'SUPER_ADMIN') {
      user = {
        name: 'Super Master Admin',
        email: 'super.admin@vaadakaro.in',
        role: demoRole,
      };
    }
  }

  if (!user) {
    redirect('/login?callbackUrl=/super-admin/dashboard');
  }

  if (user?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className={styles.portalContainer}>
      <SuperAdminSidebar user={user} />
      <main className={styles.portalMain}>
        <div className={styles.portalContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
