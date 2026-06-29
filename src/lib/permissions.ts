import { UserRole } from "@prisma/client";

export const ROLE_HIERARCHY = {
  CITIZEN: 1,
  LAWYER: 1,
  OFFICER: 2,
  DEPARTMENT_ADMIN: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
};

export type RoleString = keyof typeof ROLE_HIERARCHY;

export function hasPermission(userRole: string | undefined | null, requiredRole: string): boolean {
  if (!userRole) return false;
  
  const userLevel = ROLE_HIERARCHY[userRole as RoleString] || 0;
  const requireLevel = ROLE_HIERARCHY[requiredRole as RoleString] || 999;
  
  return userLevel >= requireLevel;
}

export function canAccessRoute(role: string | undefined | null, pathname: string): boolean {
  if (!role) return false;
  
  const rolePrefixes: Record<string, string[]> = {
    CITIZEN: ['/citizen'],
    LAWYER: ['/citizen'], // Lawyers use citizen portal but might have extra features
    OFFICER: ['/citizen', '/officer'],
    DEPARTMENT_ADMIN: ['/citizen', '/officer', '/admin'],
    ADMIN: ['/citizen', '/officer', '/admin'],
    SUPER_ADMIN: ['/citizen', '/officer', '/admin', '/super-admin'],
  };

  const allowedPrefixes = rolePrefixes[role as RoleString] || [];
  
  // They can access if the pathname starts with one of their allowed prefixes
  if (allowedPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return true;
  }
  
  return false;
}

export function getRoleDashboardPath(role: string | undefined | null): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/super-admin/dashboard';
    case 'ADMIN':
    case 'DEPARTMENT_ADMIN':
      return '/admin/dashboard';
    case 'OFFICER':
      return '/officer/dashboard';
    case 'CITIZEN':
    case 'LAWYER':
    default:
      return '/citizen/dashboard';
  }
}

export function requireRole(userRole: string | undefined | null, required: string) {
  if (!hasPermission(userRole, required)) {
    throw new Error(`Unauthorized: Requires ${required} role.`);
  }
}
