import Link from "next/link";

const siteLinks = [
  { href: "/about", label: "About & Contact" },
  { href: "/products", label: "Products" },
  { href: "/sprout-a-cube", label: "Sprout a Cube" },
  { href: "/events", label: "Events" },
  { href: "/faq", label: "FAQ" },
];

export function MarketingFooter() {
  return (
    <footer className="info-card">
      <p className="card-label">Cube Sprout</p>
      <div className="grid-3">
        <div>
          <p className="eyebrow">Outlets</p>
          <p className="hero-text">
            Outlet addresses, hours, and phone numbers are pending migration
            from the content spec (shared/business-info.md).
          </p>
        </div>

        <div>
          <p className="eyebrow">Site</p>
          <ul className="clean-list">
            {siteLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Connect</p>
          <p className="hero-text">
            Social links are pending migration from the content spec
            (shared/business-info.md).
          </p>
        </div>
      </div>
    </footer>
  );
}
