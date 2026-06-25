"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/dev", label: "Dev Demo" },
  { href: "/admin", label: "Admin" },
];

// Marketing pages (the Cube Sprout site at "/") and the Merchant Portal
// (/merchant) render their own nav headers — skip the dev topbar there so
// the page doesn't end up with two headers.
const dashboardPrefixes = ["/dev", "/admin"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname ?? "/";
  const isDashboardRoute = dashboardPrefixes.some(
    (prefix) => currentPath === prefix || currentPath.startsWith(`${prefix}/`)
  );

  return (
    <div className="app-shell">
      {isDashboardRoute && (
        <header className="topbar">
          <div>
            <p className="eyebrow">Cubed Starter</p>
            <p className="brand">Retail Cube Space Management</p>
          </div>

          <div className="topbar-actions">
            <nav className="nav-tabs" aria-label="Primary">
              {links.map((link) => {
                const isActive = currentPath.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={isActive ? "nav-tab nav-tab-active" : "nav-tab"}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <ThemeToggle />
          </div>
        </header>
      )}

      <main className="page-shell">{children}</main>
    </div>
  );
}
