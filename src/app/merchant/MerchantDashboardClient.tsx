"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Folder, Package, Plus } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type MerchantStats = {
  products: number;
  folders: number;
  cubes: number;
};

const emptyStats: MerchantStats = {
  products: 0,
  folders: 0,
  cubes: 0,
};

async function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), 8000);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function MerchantDashboardClient() {
  const { profile, loading: authLoading, error: authError } = useAuth();
  const [stats, setStats] = useState<MerchantStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      if (!authLoading) setLoading(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const merchantId = profile.id;

    async function loadStats() {
      setLoading(true);
      try {
        const [productsRes, foldersRes, cubesRes] = await withTimeout(
          Promise.all([
            supabase
              .from("products")
              .select("id", { count: "exact", head: true })
              .eq("merchant_id", merchantId),
            supabase
              .from("product_categories")
              .select("id", { count: "exact", head: true })
              .eq("merchant_id", merchantId),
            supabase
              .from("cubes")
              .select("id", { count: "exact", head: true })
              .eq("merchant_id", merchantId),
          ]),
          "Merchant dashboard is taking too long to load. Check your Supabase tables and connection."
        );

        if (productsRes.error || foldersRes.error || cubesRes.error) {
          setStatsError(
            productsRes.error?.message ||
              foldersRes.error?.message ||
              cubesRes.error?.message ||
              "Unable to load merchant dashboard."
          );
          setLoading(false);
          return;
        }

        setStats({
          products: productsRes.count ?? 0,
          folders: foldersRes.count ?? 0,
          cubes: cubesRes.count ?? 0,
        });
        setStatsError(null);
      } catch (loadError) {
        setStatsError(
          loadError instanceof Error ? loadError.message : "Unable to load merchant dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadStats();
  }, [profile, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="section-head">
          <p className="eyebrow">Merchant Dashboard</p>
          <h1>Loading workspace</h1>
          <p className="section-copy">Fetching your merchant tools.</p>
        </div>
        <div className="info-card">Loading merchant dashboard...</div>
      </div>
    );
  }

  if (authError) return <p>{authError}</p>;
  if (!profile) return <p>Profile not found.</p>;

  const cards = [
    {
      label: "Products",
      value: stats.products,
      href: "/merchant/products",
      icon: Package,
      note: "Create products and upload product images.",
    },
    {
      label: "Folders",
      value: stats.folders,
      href: "/merchant/products",
      icon: Folder,
      note: "Group products into draggable categories.",
    },
    {
      label: "Assigned cubes",
      value: stats.cubes,
      href: "/merchant/cubes",
      icon: Box,
      note: "View display spaces assigned by your admin.",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-5 rounded-xl border border-border bg-bg-elevated p-6 shadow-theme backdrop-blur-2xl lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="section-head">
          <p className="eyebrow">Merchant Dashboard</p>
          <h1>{profile.full_name || profile.email}</h1>
          <p className="section-copy">
            Manage your product library, organize folders, and prepare products
            before placing them into cube layouts later.
          </p>
        </div>

        <Link href="/merchant/products" className="button-primary">
          <Plus size={16} />
          Add products
        </Link>
      </section>

      {statsError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <p>{statsError}</p>
          {statsError.includes("product_categories") || statsError.includes("products") ? (
            <p className="mt-2 text-text-muted">
              Run the products/categories migration in Supabase, then refresh.
            </p>
          ) : null}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-border bg-bg-elevated p-5 shadow-theme backdrop-blur-2xl transition hover:-translate-y-0.5 hover:border-primary"
            >
              <div className="mb-4 flex items-center justify-between">
                <Icon size={22} />
                <strong className="text-3xl leading-none">{card.value}</strong>
              </div>
              <h2 className="text-xl font-semibold">{card.label}</h2>
              <p className="mt-2 text-sm text-text-muted">{card.note}</p>
            </Link>
          );
        })}
      </section>

      <section className="rounded-xl border border-border bg-bg-elevated p-5 shadow-theme backdrop-blur-2xl">
        <p className="eyebrow">Start Here</p>
        <h2 className="text-2xl font-semibold">Build your library first</h2>
        <p className="mt-2 max-w-2xl text-text-muted">
          Go to Products to add items and create folders like Pokemon. Later,
          those folders can become draggable groups for the cube designer.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/merchant/products" className="button-primary">
            Open product library
          </Link>
          <Link href="/merchant/cubes" className="button-secondary">
            View my cubes
          </Link>
        </div>
      </section>
    </div>
  );
}
