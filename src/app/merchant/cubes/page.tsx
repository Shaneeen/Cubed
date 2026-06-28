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

type CubesResponse = {
  data: unknown;
  error: { message: string } | null;
};

async function withTimeout<T>(promise: PromiseLike<T>, message: string): Promise<T> {
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

export default function MerchantCubesPage() {
  const { profile, loading: authLoading, error } = useAuth();
  const [cubes, setCubes] = useState<MerchantCube[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<string>("all");

  useEffect(() => {
    if (!profile) {
      if (!authLoading) setLoading(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const merchantId = profile.id;

    async function load() {
      setLoading(true);
      try {
        const cubesRes = (await withTimeout(
          supabase
            .from("cubes")
            .select("id, label, outlet_id, outlets(id, name)")
            .eq("merchant_id", merchantId)
            .order("label"),
          "Cubes are taking too long to load. Check your Supabase tables and connection."
        )) as CubesResponse;

        if (cubesRes.error) {
          setLoadError(cubesRes.error.message);
          return;
        }

        setCubes((cubesRes.data as MerchantCube[]) ?? []);
        setLoadError(null);
      } catch (loadError) {
        setLoadError(loadError instanceof Error ? loadError.message : "Unable to load your cubes.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [profile, authLoading]);

  if (authLoading || loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>Profile not found.</p>;

  const outletMap = new Map<string, string>();
  cubes.forEach((cube) => {
    if (cube.outlets) outletMap.set(cube.outlets.id, cube.outlets.name);
  });
  const outlets = Array.from(outletMap.entries()).map(([id, name]) => ({ id, name }));

  const filteredCubes =
    selectedOutlet === "all"
      ? cubes
      : cubes.filter((cube) => cube.outlet_id === selectedOutlet);

  return (
    <div className="stack-lg">
      <div>
        <p className="eyebrow">View</p>
        <h1>My Cubes</h1>
      </div>

      {loadError && <p style={{ color: "#e74c3c", margin: 0 }}>{loadError}</p>}

      {outlets.length > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
            Filter by outlet:
          </span>
          <div className="nav-tabs">
            <button
              onClick={() => setSelectedOutlet("all")}
              className={selectedOutlet === "all" ? "nav-tab nav-tab-active" : "nav-tab"}
              style={{ fontSize: "0.85rem", padding: "0.45rem 0.75rem" }}
            >
              All ({cubes.length})
            </button>
            {outlets.map((outlet) => {
              const count = cubes.filter((cube) => cube.outlet_id === outlet.id).length;
              return (
                <button
                  key={outlet.id}
                  onClick={() => setSelectedOutlet(outlet.id)}
                  className={selectedOutlet === outlet.id ? "nav-tab nav-tab-active" : "nav-tab"}
                  style={{ fontSize: "0.85rem", padding: "0.45rem 0.75rem" }}
                >
                  {outlet.name} ({count})
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
              {filteredCubes.map((cube) => (
                <tr key={cube.id}>
                  <td style={{ fontWeight: 600 }}>{cube.label}</td>
                  <td style={{ color: "var(--text-muted)" }}>{cube.outlets?.name ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
