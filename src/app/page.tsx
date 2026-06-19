import Link from "next/link";
import { ThemeSwatches } from "@/components/theme/ThemeSwatches";

const ownership = [
  {
    title: "Customer Side",
    items: [
      "Homepage and featured products",
      "Public catalogue and filters",
      "Product detail page",
      "Cart and pickup order reservation",
    ],
  },
  {
    title: "Merchant Side",
    items: [
      "Merchant login and dashboard",
      "Product CRUD",
      "Stock and visibility management",
      "Cube or shelf location updates",
    ],
  },
  {
    title: "Store Owner Side",
    items: [
      "Merchant account management",
      "Product moderation",
      "Reservation review",
      "Collected and cancelled order control",
    ],
  },
];

export default function HomePage() {
  return (
    <div className="stack-xl">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Next.js + Supabase Starter</p>
          <h1>Shared project base for all three developers</h1>
          <p className="hero-text">
            The app is now structured for a customer-facing catalogue, merchant
            product tools, and store-owner controls. The color system supports both
            light and dark mode using your blue palette.
          </p>

          <div className="hero-actions">
            <Link className="button-primary" href="/merchant">
              Merchant Area
            </Link>
            <Link className="button-secondary" href="/admin">
              Admin Area
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <p className="card-label">Starter Includes</p>
          <ul className="clean-list">
            <li>Next.js App Router structure</li>
            <li>Shared theme tokens for light and dark mode</li>
            <li>Supabase client helpers and environment template</li>
            <li>Feature folders split by team ownership</li>
          </ul>
        </div>
      </section>

      <section className="grid-3">
        {ownership.map((group) => (
          <article className="info-card" key={group.title}>
            <h2>{group.title}</h2>
            <ul className="clean-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <ThemeSwatches />
    </div>
  );
}
