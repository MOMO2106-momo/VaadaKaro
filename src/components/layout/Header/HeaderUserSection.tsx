"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User as UserIcon, LogOut } from "lucide-react";
import styles from "./Header.module.css";
import NotificationCenter from "@/components/features/notifications/NotificationCenter";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

/**
 * The authenticated user section of the Header.
 * This is a Client Component so it re-renders reactively after login/logout
 * without requiring a full page reload (avoids root-layout caching issue).
 * Supports both real Auth.js sessions and temporary demo_role cookies.
 */
export default function HeaderUserSection() {
  const { data: session, status } = useSession();
  const [demoUser, setDemoUser] = useState<any>(null);

  useEffect(() => {
    const demoRole = getCookie("demo_role");
    if (demoRole) {
      let name = "Demo User";
      let email = "";
      if (demoRole === "OFFICER") {
        name = "Inspector Rajesh Kumar";
        email = "officer@vaadakaro.gov.in";
      } else if (demoRole === "ADMIN" || demoRole === "DEPARTMENT_ADMIN") {
        name = "Demo Admin Officer";
        email = "admin@vaadakaro.gov.in";
      } else if (demoRole === "SUPER_ADMIN") {
        name = "Super Master Admin";
        email = "super.admin@vaadakaro.in";
      } else if (demoRole === "CITIZEN") {
        name = "Demo Citizen";
        email = "citizen@example.com";
      }
      setDemoUser({ name, email, role: demoRole });
    } else {
      setDemoUser(null);
    }
  }, [session, status]);

  // While loading, show nothing (avoids flash of wrong state)
  if (status === "loading") {
    return <div style={{ width: 120, height: 36 }} />;
  }

  const user = session?.user || demoUser;

  if (!user) {
    return (
      <div className={styles.actions}>
        <Link href="/login" className={styles.loginLink}>Sign In</Link>
        <Link href="/signup" className={styles.signupBtn}>Request Account</Link>
      </div>
    );
  }

  const handleLogout = () => {
    // Clear the demo role cookie
    document.cookie = "demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className={styles.userProfile}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <span className={styles.userName}>{user.name || user.email}</span>
        <span className={styles.userRole}>{(user as any).role || "CITIZEN"}</span>
      </div>
      <Link href="/dashboard" className={styles.avatar}>
        <UserIcon size={20} />
      </Link>
      <NotificationCenter />
      <button
        type="button"
        className={styles.logoutBtn}
        title="Log Out"
        onClick={handleLogout}
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}
