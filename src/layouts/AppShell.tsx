"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/", label: "Customer" },
  { href: "/merchant", label: "Merchant" },
  { href: "/admin", label: "Admin" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname ?? "/";

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Cubed Starter</p>
          <p className="brand">Retail Cube Space Management</p>
        </div>

        <div className="topbar-actions">
          <nav className="nav-tabs" aria-label="Primary">
            {links.map((link) => {
              const isActive =
                currentPath === link.href ||
                (link.href !== "/" && currentPath.startsWith(link.href));

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

      <main className="page-shell">{children}</main>
    </div>
  );
}
