'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

/**
 * RBAC Helper: Ensures only ADMIN can access these actions.
 *
 * SECURITY: this file mutates real user accounts (role/department changes),
 * so it deliberately does NOT honor the `demo_role` cookie the way read-only
 * dashboards do. A demo identity must never be able to promote a real user
 * to ADMIN. Only a genuine authenticated session counts here.
 */
async function ensureAdmin() {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== 'ADMIN' && role !== 'DEPARTMENT_ADMIN' && role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
}

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    await ensureAdmin();

    await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    revalidatePath('/dashboard/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating role:', error);
    return { success: false, error: error.message };
  }
}

export async function updateUserDepartment(userId: string, department: string) {
  try {
    await ensureAdmin();

    await prisma.user.update({
      where: { id: userId },
      data: { department }
    });

    revalidatePath('/dashboard/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating department:', error);
    return { success: false, error: error.message };
  }
}
