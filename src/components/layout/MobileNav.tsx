"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Home, LayoutDashboard, UserCircle2, Users } from "lucide-react";
import styles from "./layout.module.css";

const mobileNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/community-map", label: "Community", icon: Users },
  { href: "/ai-assistant", label: "AI", icon: Bot },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle2 },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.mobileNav} aria-label="Mobile navigation">
      {mobileNavItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ""}`.trim()}
          >
            <span className={styles.mobileNavIcon}>
              <Icon size={18} />
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
