"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/AuthContext";
import type { Profile } from "@/types/auth";

type CubeRow = {
  id: string;
  label: string;
  merchant_id: string | null;
  profiles: { full_name: string | null; email: string } | null;
};

export default function OutletCubesPage() {
  const params = useParams<{ outletId: string }>();
  const outletId = params?.outletId ?? null;
  const { profile: adminProfile, loading: authLoading, error: authError } = useAuth();
  const [outletName, setOutletName] = useState<string | null>(null);
  const [cubes, setCubes] = useState<CubeRow[]>([]);
  const [merchants, setMerchants] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  async function loadData() {
    if (!outletId || !adminProfile) return;

    const [outletRes, cubesRes, merchantsRes] = await Promise.all([
      supabase.from("outlets").select("name").eq("id", outletId).single(),
      supabase
        .from("cubes")
        .select("id, label, merchant_id, profiles(full_name, email)")
        .eq("outlet_id", outletId)
        .order("label"),
      supabase
        .from("profiles")
        .select("*")
        .eq("role", "merchant")
        .eq("super_admin_id", adminProfile.id)
        .order("email"),
    ]);

    if (outletRes.error || cubesRes.error || merchantsRes.error) {
      setError(
        outletRes.error?.message ||
          cubesRes.error?.message ||
          merchantsRes.error?.message ||
          "Unable to load outlet data."
      );
      setLoading(false);
      return;
    }

    setOutletName(outletRes.data?.name ?? null);
    setCubes((cubesRes.data as unknown as CubeRow[]) ?? []);
    setMerchants(merchantsRes.data ?? []);
    setError(null);
    setLoading(false);
  }

  useEffect(() => {
    if (adminProfile && outletId) {
      void loadData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [adminProfile, authLoading, outletId]); // eslint-disable-line react-hooks/exhaustive-deps

  function resetForm() {
    setLabel("");
    setMerchantId("");
    setShowForm(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!outletId) {
      setError("Missing outlet id.");
      return;
    }

    setSaving(true);
    setError(null);
    const { error: insertError } = await supabase.from("cubes").insert({
      label,
      outlet_id: outletId,
      merchant_id: merchantId || null,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    resetForm();
    setSaving(false);
    loadData();
  }

  async function handleAssign(cubeId: string, newMerchantId: string | null) {
    const { error: updateError } = await supabase
      .from("cubes")
      .update({ merchant_id: newMerchantId })
      .eq("id", cubeId);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this cube?")) return;
    const { error: deleteError } = await supabase.from("cubes").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    loadData();
  }

  if (authLoading || loading) return <p>Loading…</p>;
  if (authError) return <p>{authError}</p>;
  if (!adminProfile) return <p>Profile not found.</p>;
  if (!outletId) return <p>Invalid outlet.</p>;

  return (
    <div className="admin-stack">
      <div>
        <Link href="/dashboard/outlets" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          ← Back to Outlets
        </Link>
      </div>

      <div className="admin-page-head">
        <div className="section-head">
          <p className="eyebrow">{outletName ?? "Outlet"}</p>
          <h1>Cubes</h1>
          <p className="section-copy">
            Create display slots and assign them to the merchants managed under
            this super admin account.
          </p>
        </div>
        <button className="button-primary" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? "Cancel" : "Add Cube"}
        </button>
      </div>

      {error && <p style={{ color: "#e74c3c", margin: 0 }}>{error}</p>}

      {showForm && (
        <form onSubmit={handleCreate} className="admin-form-card stack-md">
          <h2 style={{ margin: 0 }}>New Cube</h2>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Cube Label</span>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} required placeholder="e.g. A1, B3, Shelf-2" style={inputStyle} />
          </label>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Assign to Merchant (optional)</span>
            <select value={merchantId} onChange={(e) => setMerchantId(e.target.value)} style={inputStyle}>
              <option value="">Unassigned</option>
              {merchants.map((m) => (
                <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="button-primary" disabled={saving}>
            {saving ? "Creating…" : "Create Cube"}
          </button>
        </form>
      )}

      {cubes.length === 0 ? (
        <div className="info-card empty-state">
          <p>No cubes in this outlet yet. Click &quot;Add Cube&quot; to create one.</p>
        </div>
      ) : (
        <div className="admin-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Assigned To</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cubes.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.label}</td>
                  <td>
                    <select
                      value={c.merchant_id ?? ""}
                      onChange={(e) => handleAssign(c.id, e.target.value || null)}
                      style={{ ...inputStyle, fontSize: "0.8rem", padding: "0.35rem 0.5rem" }}
                    >
                      <option value="">Unassigned</option>
                      {merchants.map((m) => (
                        <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(c.id)} className="button-secondary btn-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.65rem 0.85rem",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
};
