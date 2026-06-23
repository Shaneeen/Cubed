import Link from "next/link";
import { mockStore } from "@/lib/mockData";

export default function DevLauncherPage() {
  return (
    <div className="stack-xl">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Dev / Demo Launcher</p>
          <h1>Jump into the customer side</h1>
          <p className="hero-text">
            In production, customers land on a Cube Page by tapping an NFC tag.
            This page just gives you direct links to that same destination, plus
            the Store Page, so you can navigate locally without a tag to tap.
          </p>

          <div className="hero-actions">
            <Link className="button-primary" href={`/store/${mockStore.id}`}>
              Open Store Page
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <p className="card-label">Simulated NFC Taps</p>
          <ul className="clean-list">
            {mockStore.cubes.map((cube) => (
              <li key={cube.id}>
                <Link href={`/cube/${cube.id}`}>{cube.merchantName}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid-3">
        {mockStore.cubes.map((cube) => (
          <article className="info-card" key={cube.id}>
            <h2>{cube.merchantName}</h2>
            <p>{cube.tagline}</p>
            <Link className="button-secondary" href={`/cube/${cube.id}`}>
              Open Cube Page
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
