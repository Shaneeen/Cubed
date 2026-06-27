"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/features/auth/AuthContext";

const links = [
  { href: "/merchant", label: "Merchant Dashboard" },
  { href: "/merchant/products", label: "Products" },
];

export function MerchantPortalNav() {
  const pathname = usePathname() ?? "/merchant";
  const { profile, signOut } = useAuth();

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Merchant Portal</p>
        <p className="brand">{profile?.full_name || "Cube Sprout"}</p>
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
        <button type="button" className="button-secondary" onClick={() => void signOut()}>
          Sign Out
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
