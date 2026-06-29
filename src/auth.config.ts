import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const nextUrl = request.nextUrl;
      let isLoggedIn = !!auth?.user;
      let role = (auth?.user as any)?.role;
      const pathname = nextUrl.pathname;

      // Demo role bypass logic
      const demoRoleCookie = request.cookies.get('demo_role')?.value;
      if (!isLoggedIn && demoRoleCookie) {
        isLoggedIn = true;
        role = demoRoleCookie;
      }

      const isPublicRoute = 
        pathname === '/' || 
        pathname === '/login' || 
        pathname === '/signup' || 
        pathname === '/register' || 
        pathname === '/forgot-password' ||
        pathname === '/terms' ||
        pathname === '/privacy' ||
        pathname === '/disclaimer' ||
        pathname.startsWith('/track-complaint') ||
        pathname.startsWith('/about') ||
        pathname.startsWith('/contact') ||
        pathname.startsWith('/support');

      if (!isLoggedIn) {
        if (isPublicRoute) return true;
        return false; // Redirect to login
      }

      // Map allowed path prefixes by role
      const rolePrefixes: Record<string, string[]> = {
        CITIZEN: ['/citizen'],
        LAWYER: ['/citizen'],
        OFFICER: ['/citizen', '/officer'],
        DEPARTMENT_ADMIN: ['/citizen', '/officer', '/admin'],
        ADMIN: ['/citizen', '/officer', '/admin'],
        SUPER_ADMIN: ['/citizen', '/officer', '/admin', '/super-admin'],
      };

      const allowedRoutes = rolePrefixes[role as string] || [];

      // Automatically redirect the old `/dashboard` to proper role dashboard
      if (pathname === '/dashboard') {
        let dashboard = '/citizen/dashboard';
        if (role === 'SUPER_ADMIN') dashboard = '/super-admin/dashboard';
        else if (role === 'ADMIN' || role === 'DEPARTMENT_ADMIN') dashboard = '/admin/dashboard';
        else if (role === 'OFFICER') dashboard = '/officer/dashboard';
        return Response.redirect(new URL(dashboard, nextUrl));
      }

      // Protection for portal routes
      const isPortalRoute = ['/citizen', '/officer', '/admin', '/super-admin'].some(p => pathname.startsWith(p));
      
      if (isPortalRoute) {
        const canAccess = allowedRoutes.some(prefix => pathname.startsWith(prefix));
        if (!canAccess) {
          let dashboard = '/citizen/dashboard';
          if (role === 'SUPER_ADMIN') dashboard = '/super-admin/dashboard';
          else if (role === 'ADMIN' || role === 'DEPARTMENT_ADMIN') dashboard = '/admin/dashboard';
          else if (role === 'OFFICER') dashboard = '/officer/dashboard';
          return Response.redirect(new URL(dashboard, nextUrl));
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.department = (user as any).department;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.role === "string") session.user.role = token.role;
        if (typeof token.id === "string") session.user.id = token.id;
        if (typeof token.department === "string") session.user.department = token.department;
      }
      return session;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
