import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <section className="stack-lg" style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <div className="section-head">
        <p className="eyebrow">Access Denied</p>
        <h1>Unauthorized</h1>
        <p className="section-copy">
          You do not have permission to access this page.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center" }}>
        <Link href="/" className="button-primary">
          Go Home
        </Link>
        <Link href="/login" className="button-secondary">
          Sign In
        </Link>
      </div>
    </section>
  );
}
