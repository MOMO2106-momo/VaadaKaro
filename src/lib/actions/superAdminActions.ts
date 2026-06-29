'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { requireRole } from '@/lib/permissions';

export async function getSystemHealth() {
  try {
    const session = await auth();
    requireRole((session?.user as any)?.role, 'SUPER_ADMIN');

    const totalUsers = await prisma.user.count();
    const totalComplaints = await prisma.complaint.count();

    return { 
      success: true, 
      health: { 
        status: 'Operational', 
        users: totalUsers,
        complaints: totalComplaints 
      } 
    };
  } catch (error) {
    return { success: false, error: 'Unauthorized or failed to fetch' };
  }
}
