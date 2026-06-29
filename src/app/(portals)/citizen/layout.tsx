export const dynamic = "force-dynamic";
import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { CitizenSidebar } from '@/components/portals/CitizenSidebar';
import { RightUserPanel } from '@/components/portals/RightUserPanel';
import styles from '@/components/portals/portal.module.css';

export default async function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/citizen/dashboard');
  }

  // Fetch the full user record from the database so sidebar/panel gets image, phone, etc.
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id as string },
  });

  const fullUser = dbUser || session.user;

  return (
    <div className={styles.portalContainer}>
      <CitizenSidebar user={fullUser} />
      <main className={styles.portalMain}>
        <div className={styles.portalContent}>
          {children}
        </div>
      </main>
      <RightUserPanel user={fullUser} />
    </div>
  );
}

