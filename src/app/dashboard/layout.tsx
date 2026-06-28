"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/features/auth/AuthContext";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/merchants", label: "Merchants" },
  { href: "/dashboard/outlets", label: "Outlets" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/dashboard";
  const { profile, signOut } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <p className="eyebrow">Super Admin</p>
          <h1>{profile?.full_name || "Cubed Control"}</h1>
          <p className="section-copy">
            Manage merchants, cubes, and outlets from one workspace.
          </p>
        </div>

        <nav className="admin-nav" aria-label="Super admin">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? "admin-nav-link admin-nav-link-active" : "admin-nav-link"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <ThemeToggle />
          <button type="button" className="button-secondary" onClick={() => void signOut()}>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="admin-content">{children}</div>
    </div>
  );
}
