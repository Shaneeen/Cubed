"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ShoppingBag, Sparkles, Tags } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LoginModal } from "@/components/auth/LoginModal";
import { useOutlet } from "@/context/OutletContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About & Contact" },
];

const productCategories = [
  { label: "Handmade", icon: Sparkles },
  { label: "Accessories", icon: Tags },
  { label: "Home Decor", icon: ShoppingBag },
];

export function MarketingNav() {
  const pathname = usePathname() ?? "/";
  const { selectedOutlet, openSelector } = useOutlet();
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
                      {productCategories.map((category) => (
                        <Link
                          key={category.label}
                          href="/products"
                          className="nav-preview-item"
                        >
                          <category.icon size={16} />
                          {category.label}
                        </Link>
                      ))}
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
          <LoginModal trigger={<button type="button" className="nav-tab">Login</button>} />
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
        <LoginModal trigger={<button type="button" className="nav-tab">Login</button>} />
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
