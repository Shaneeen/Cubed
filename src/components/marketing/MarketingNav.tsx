"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const siteLinks = [
  { href: "/", label: "Home" },
  { href: "/blank", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Out of scope per the migration spec: real Cube Sprout site treats these as
// plain buttons to an existing destination, not pages of their own.
const outOfScopeLinks = [
  { href: "/merchant", label: "Merchant" },
  { href: "/admin", label: "Staff" },
];

export function MarketingNav() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Cube Sprout</p>
        <p className="brand">Sprout a cube, grow a business</p>
      </div>

      <div className="topbar-actions">
        <nav className="nav-tabs" aria-label="Cube Sprout">
          {siteLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
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
          {outOfScopeLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-tab">
              {link.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
