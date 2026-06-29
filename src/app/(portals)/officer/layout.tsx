export const dynamic = "force-dynamic";
import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { OfficerSidebar } from '@/components/portals/OfficerSidebar';
import styles from '@/components/portals/portal.module.css';

export default async function OfficerLayout({
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
    if (demoRole === 'OFFICER' || demoRole === 'ADMIN' || demoRole === 'DEPARTMENT_ADMIN' || demoRole === 'SUPER_ADMIN') {
      user = {
        name: 'Inspector Rajesh Kumar',
        email: 'officer@vaadakaro.gov.in',
        role: demoRole,
        department: 'Public Works'
      };
    }
  }

  if (!user) {
    redirect('/login?callbackUrl=/officer/dashboard');
  }

  if (user?.role !== 'OFFICER' && user?.role !== 'ADMIN' && user?.role !== 'DEPARTMENT_ADMIN' && user?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className={styles.portalContainer}>
      <OfficerSidebar user={user} />
      <main className={styles.portalMain}>
        <div className={styles.portalContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
