import Link from "next/link";

export function MarketingPage({
  eyebrow,
  title,
  description,
  related,
}: {
  eyebrow: string;
  title: string;
  description: string;
  related?: { href: string; label: string }[];
}) {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-text">{description}</p>

        {related && related.length > 0 && (
          <div className="hero-actions">
            {related.map((link) => (
              <Link key={link.href} className="button-secondary" href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="hero-card">
        <p className="card-label">Status</p>
        <ul className="clean-list">
          <li>Copy for this page is being migrated from the existing Cube Sprout site.</li>
          <li>Structure and links reflect the final site map — wording is placeholder.</li>
        </ul>
      </div>
    </section>
  );
}
