"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Thin wrapper around next-auth's SessionProvider.
 * Needed so that useSession() works inside client components (e.g. HeaderUserSection).
 * This is a Client Component but its children are still rendered as Server Components.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
