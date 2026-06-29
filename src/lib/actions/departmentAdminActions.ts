'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { requireRole } from '@/lib/permissions';

export async function getDepartmentStats() {
  try {
    const session = await auth();
    requireRole((session?.user as any)?.role, 'DEPARTMENT_ADMIN');

    // In a real app we would use user's departmentId
    const officerCount = await prisma.user.count({ 
      where: { role: 'OFFICER' } 
    });
    const pendingCases = await prisma.complaint.count({ 
      where: { status: 'SUBMITTED' } 
    });

    return { success: true, stats: { officers: officerCount, pendingCases } };
  } catch (error) {
    return { success: false, error: 'Unauthorized or failed to fetch' };
  }
}
