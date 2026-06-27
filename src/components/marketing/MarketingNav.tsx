"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useOutlet } from "@/context/OutletContext";
import { outlets } from "@/lib/outlets";
import { useAuth } from "@/features/auth/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About & Contact" },
];

export function MarketingNav() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { selectedOutlet, setSelectedOutlet, openSelector } = useOutlet();
  const { profile, user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function openPreview() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPreviewOpen(true);
  }

  function scheduleClosePreview() {
    closeTimer.current = setTimeout(() => setPreviewOpen(false), 100);
  }

  const dashboardHref =
    profile?.role === "super_admin"
      ? "/dashboard"
      : profile?.role === "merchant"
        ? "/merchant"
        : "/login";

  const dashboardLabel =
    profile?.role === "super_admin"
      ? "Dashboard"
      : profile?.role === "merchant"
        ? "Merchant Portal"
        : "Login";

  return (
    <>
      <header className={scrolled ? "site-header site-header--scrolled" : "site-header"}>
        <div>
          <p className="eyebrow">Cube Sprout</p>
          <p className="brand site-header-logo">Sprout a cube, grow a business</p>
        </div>

        <nav className="site-header-nav" aria-label="Cube Sprout">
          {navLinks.map((link) =>
            link.href === "/products" ? (
              <div
                key={link.href}
                className="nav-preview-wrap"
                onMouseEnter={openPreview}
                onMouseLeave={scheduleClosePreview}
              >
                <Link
                  href={link.href}
                  className={isActive(link.href) ? "nav-tab nav-tab-active" : "nav-tab"}
                >
                  {link.label}
                </Link>
                <AnimatePresence>
                  {previewOpen && (
                    <motion.div
                      className="nav-preview-panel"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={openPreview}
                      onMouseLeave={scheduleClosePreview}
                    >
                      {outlets.map((outlet) => {
                        const isCurrent = outlet.id === selectedOutlet?.id;
                        return (
                          <button
                            key={outlet.id}
                            type="button"
                            className={
                              isCurrent
                                ? "nav-preview-item nav-preview-item-active"
                                : "nav-preview-item"
                            }
                            onClick={() => {
                              setSelectedOutlet(outlet.id);
                              setPreviewOpen(false);
                              router.push("/products");
                            }}
                          >
                            <MapPin size={16} />
                            {outlet.name}
                            {isCurrent && <Check size={14} className="nav-preview-check" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? "nav-tab nav-tab-active" : "nav-tab"}
              >
                {link.label}
              </Link>
            )
          )}
          {user ? (
            <>
              <Link href={dashboardHref} className="nav-tab">
                {dashboardLabel}
              </Link>
              <button type="button" className="nav-tab" onClick={() => void signOut()}>
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="nav-tab">
              Login
            </Link>
          )}
        </nav>

        <div className="site-header-actions">
          <button type="button" className="switch-outlet-btn" onClick={openSelector}>
            <MapPin size={14} />
            {selectedOutlet ? selectedOutlet.name : "Switch outlet"}
          </button>
          <ThemeToggle />
          <button
            type="button"
            className="hamburger-btn"
            data-open={mobileOpen}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </header>

      <div
        className="mobile-drawer-backdrop"
        style={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity var(--transition-slow) ease-out",
        }}
        onClick={() => setMobileOpen(false)}
      />
      <div className="mobile-drawer" data-open={mobileOpen} aria-hidden={!mobileOpen}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? "nav-tab nav-tab-active" : "nav-tab"}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {user ? (
          <>
            <Link
              href={dashboardHref}
              className="nav-tab"
              onClick={() => setMobileOpen(false)}
            >
              {dashboardLabel}
            </Link>
            <button
              type="button"
              className="nav-tab"
              onClick={() => {
                setMobileOpen(false);
                void signOut();
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="nav-tab"
            onClick={() => setMobileOpen(false)}
          >
            Login
          </Link>
        )}
        <button
          type="button"
          className="switch-outlet-btn"
          onClick={() => {
            openSelector();
            setMobileOpen(false);
          }}
        >
          <MapPin size={14} />
          {selectedOutlet ? selectedOutlet.name : "Switch outlet"}
        </button>
      </div>
    </>
  );
}
