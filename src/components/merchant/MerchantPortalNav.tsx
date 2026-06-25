"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/merchant", label: "Merchant Dashboard" },
  { href: "/merchant/products", label: "Products" },
];

export function MerchantPortalNav() {
  const pathname = usePathname() ?? "/merchant";

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Merchant Portal</p>
        <p className="brand">Cube Sprout</p>
      </div>

      <div className="topbar-actions">
        <nav className="nav-tabs" aria-label="Merchant Portal">
          {links.map((link) => {
            const isActive =
              link.href === "/merchant"
                ? pathname === "/merchant"
                : pathname.startsWith(link.href);
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
  );
}
