"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function DashboardOverview() {
  const { profile, loading, error } = useAuth();
  const [stats, setStats] = useState({
    merchants: 0,
    outlets: 0,
    cubes: 0,
    occupiedCubes: 0,
  });
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    const supabase = createBrowserSupabaseClient();
    const adminId = profile.id;

    async function loadStats() {
      const [m, o, c, assigned] = await Promise.all([
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "merchant")
          .eq("super_admin_id", adminId),
        supabase
          .from("outlets")
          .select("id", { count: "exact", head: true })
          .eq("super_admin_id", adminId),
        supabase.from("cubes").select("id", { count: "exact", head: true }),
        supabase
          .from("cubes")
          .select("id", { count: "exact", head: true })
          .not("merchant_id", "is", null),
      ]);

      if (m.error || o.error || c.error || assigned.error) {
        setStatsError("Unable to load dashboard stats.");
        return;
      }

      setStats({
        merchants: m.count ?? 0,
        outlets: o.count ?? 0,
        cubes: c.count ?? 0,
        occupiedCubes: assigned.count ?? 0,
      });
      setStatsError(null);
    }

    void loadStats();
  }, [profile]);

  if (loading) {
    return (
      <div className="admin-stack">
        <section className="admin-hero">
          <div className="section-head">
            <p className="eyebrow">Overview</p>
            <h1>Loading dashboard</h1>
            <p className="section-copy">Fetching your super admin workspace.</p>
          </div>
          <div className="admin-hero-panel">
            <p className="section-copy">Loading metrics and outlet activity…</p>
          </div>
        </section>
      </div>
    );
  }
  if (error) return <p>{error}</p>;
  if (!profile) return <p>Profile not found.</p>;

  const cards = [
    {
      label: "Active merchants",
      count: stats.merchants,
      href: "/dashboard/merchants",
      note: "Manage accounts, reset inventory owners, and add partners.",
    },
    {
      label: "Outlets",
      count: stats.outlets,
      href: "/dashboard/outlets",
      note: "Storefront locations currently visible to customers.",
    },
    {
      label: "Cubes tracked",
      count: stats.cubes,
      href: "/dashboard/outlets",
      note: "Display spaces configured across all outlets.",
    },
    {
      label: "Occupied cubes",
      count: stats.occupiedCubes,
      href: "/dashboard/outlets",
      note: "Assigned cubes with a merchant owner.",
    },
  ];

  const occupancyRate =
    stats.cubes > 0 ? Math.round((stats.occupiedCubes / stats.cubes) * 100) : 0;

  return (
    <div className="admin-stack">
      <section className="admin-hero">
        <div className="section-head">
          <p className="eyebrow">Overview</p>
          <h1>{profile.full_name || profile.email}</h1>
          <p className="section-copy">
            Control merchant onboarding, outlet structure, and display-space
            assignments from one place.
          </p>
        </div>

        <div className="admin-hero-panel">
          <p className="card-label">Customer visibility snapshot</p>
          <div className="admin-mini-metrics">
            <div>
              <strong>{occupancyRate}%</strong>
              <span>Cube occupancy</span>
            </div>
            <div>
              <strong>{stats.outlets}</strong>
              <span>Outlets live</span>
            </div>
            <div>
              <strong>{stats.merchants}</strong>
              <span>Brands onboarded</span>
            </div>
          </div>
          <p className="section-copy">
            Click and traffic analytics are not stored yet. This overview is
            currently based on live merchants, outlets, and cube assignments.
          </p>
        </div>
      </section>

      {statsError && <p style={{ color: "#e74c3c", margin: 0 }}>{statsError}</p>}

      <section className="admin-metrics-grid">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="admin-metric-card">
            <p className="admin-metric-value">{card.count}</p>
            <h2>{card.label}</h2>
            <p>{card.note}</p>
          </Link>
        ))}
      </section>

      <section className="admin-focus-grid">
        <article className="admin-focus-card">
          <p className="card-label">Merchant CRUD</p>
          <h2>Onboard, review, and remove sellers</h2>
          <p className="section-copy">
            Create merchant accounts, verify ownership, and keep your cube
            partners tied to the correct super admin.
          </p>
          <Link href="/dashboard/merchants" className="button-primary">
            Open merchant manager
          </Link>
        </article>

        <article className="admin-focus-card">
          <p className="card-label">Outlet and cube CRUD</p>
          <h2>Shape the customer-facing store map</h2>
          <p className="section-copy">
            Add outlets, edit addresses, and assign individual cubes to
            merchants the same way customers conceptually browse locations.
          </p>
          <Link href="/dashboard/outlets" className="button-primary">
            Open outlet manager
          </Link>
        </article>
      </section>
    </div>
  );
}
