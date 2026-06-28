"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/features/auth/AuthContext";

const links = [
  { href: "/merchant", label: "Merchant Dashboard" },
  { href: "/merchant/products", label: "Products" },
  { href: "/merchant/cubes", label: "My Cubes" },
];

export function MerchantPortalNav() {
  const pathname = usePathname() ?? "/merchant";
  const { profile, signOut } = useAuth();

  return (
    <header className="flex flex-col gap-5 rounded-xl border border-white/10 bg-white/[0.08] p-6 shadow-theme backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          Merchant Portal
        </p>
        <p className="m-0 text-3xl font-semibold leading-tight tracking-normal text-text">
          {profile?.full_name || "Cube Sprout"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <nav className="flex flex-wrap gap-2" aria-label="Merchant Portal">
          {links.map((link) => {
            const isActive =
              link.href === "/merchant"
                ? pathname === "/merchant"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-text"
                    : "rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-text-muted transition hover:border-white/10 hover:bg-white/[0.06] hover:text-text"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-text transition hover:bg-white/10"
            onClick={() => void signOut()}
          >
            Sign Out
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
