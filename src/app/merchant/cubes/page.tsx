"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/AuthContext";

type MerchantCube = {
  id: string;
  label: string;
  outlet_id: string;
  outlets: { id: string; name: string } | null;
};

export default function MerchantCubesPage() {
  const { profile, loading: authLoading, error } = useAuth();
  const [cubes, setCubes] = useState<MerchantCube[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<string>("all");

  useEffect(() => {
    if (!profile) return;
    const supabase = createBrowserSupabaseClient();
    const merchantId = profile.id;

    async function load() {
      const { data, error: cubesError } = await supabase
        .from("cubes")
        .select("id, label, outlet_id, outlets(id, name)")
        .eq("merchant_id", merchantId)
        .order("label");

      if (cubesError) {
        setLoadError("Unable to load your cubes.");
        setLoading(false);
        return;
      }

      setCubes((data as unknown as MerchantCube[]) ?? []);
      setLoadError(null);
      setLoading(false);
    }

    load();
  }, [profile]);

  if (authLoading || loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>Profile not found.</p>;

  const outletMap = new Map<string, string>();
  cubes.forEach((c) => {
    if (c.outlets) outletMap.set(c.outlets.id, c.outlets.name);
  });
  const outlets = Array.from(outletMap.entries()).map(([id, name]) => ({ id, name }));

  const filteredCubes =
    selectedOutlet === "all"
      ? cubes
      : cubes.filter((c) => c.outlet_id === selectedOutlet);

  return (
    <div className="stack-lg">
      <div>
        <p className="eyebrow">View</p>
        <h1>My Cubes</h1>
      </div>

      {loadError && <p style={{ color: "#e74c3c", margin: 0 }}>{loadError}</p>}

      {outlets.length > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>Filter by outlet:</span>
          <div className="nav-tabs">
            <button
              onClick={() => setSelectedOutlet("all")}
              className={selectedOutlet === "all" ? "nav-tab nav-tab-active" : "nav-tab"}
              style={{ fontSize: "0.85rem", padding: "0.45rem 0.75rem" }}
            >
              All ({cubes.length})
            </button>
            {outlets.map((o) => {
              const count = cubes.filter((c) => c.outlet_id === o.id).length;
              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedOutlet(o.id)}
                  className={selectedOutlet === o.id ? "nav-tab nav-tab-active" : "nav-tab"}
                  style={{ fontSize: "0.85rem", padding: "0.45rem 0.75rem" }}
                >
                  {o.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filteredCubes.length === 0 ? (
        <div className="info-card empty-state">
          <p>
            {cubes.length === 0
              ? "No cubes assigned to you yet. Contact your admin to get started."
              : "No cubes in this outlet."}
          </p>
        </div>
      ) : (
        <div className="info-card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Outlet</th>
              </tr>
            </thead>
            <tbody>
              {filteredCubes.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.label}</td>
                  <td style={{ color: "var(--text-muted)" }}>{c.outlets?.name ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
