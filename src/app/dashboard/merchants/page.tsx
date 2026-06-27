"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/AuthContext";
import type { Profile } from "@/types/auth";

export default function MerchantsPage() {
  const { profile: adminProfile, loading: authLoading, error: authError } = useAuth();
  const [merchants, setMerchants] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadMerchants() {
    if (!adminProfile) return;

    const supabase = createBrowserSupabaseClient();
    const { data, error: loadError } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "merchant")
      .eq("super_admin_id", adminProfile.id)
      .order("created_at", { ascending: false });

    if (loadError) {
      setError("Unable to load merchants.");
      setLoading(false);
      return;
    }

    setMerchants(data ?? []);
    setError(null);
    setLoading(false);
  }

  useEffect(() => {
    if (adminProfile) loadMerchants();
  }, [adminProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/admin/create-merchant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, full_name: fullName, password }),
    });

    const result = await res.json();
    if (!res.ok) {
      setError(result.error ?? "Failed to create merchant");
      setSaving(false);
      return;
    }

    setEmail("");
    setFullName("");
    setPassword("");
    setShowForm(false);
    setSaving(false);
    loadMerchants();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this merchant? This cannot be undone.")) return;

    const res = await fetch("/api/admin/delete-merchant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchant_id: id }),
    });

    if (res.ok) {
      setError(null);
      loadMerchants();
      return;
    }

    const result = await res.json();
    setError(result.error ?? "Failed to remove merchant");
  }

  if (authLoading || loading) return <p>Loading…</p>;
  if (authError) return <p>{authError}</p>;
  if (!adminProfile) return <p>Profile not found.</p>;

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div className="section-head">
          <p className="eyebrow">Merchant CRUD</p>
          <h1>Merchants</h1>
          <p className="section-copy">
            Create merchant logins, track who belongs to your store, and remove
            accounts that should no longer occupy cubes.
          </p>
        </div>
        <button className="button-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Merchant"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="admin-form-card stack-md">
          <h2 style={{ margin: 0 }}>New Merchant</h2>
          {error && <p style={{ color: "#e74c3c", margin: 0, fontSize: "0.875rem" }}>{error}</p>}
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </label>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Full Name</span>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={inputStyle} />
          </label>
          <button type="submit" className="button-primary" disabled={saving}>
            {saving ? "Creating…" : "Create Merchant"}
          </button>
        </form>
      )}

      <section className="admin-compact-metrics">
        <div className="admin-compact-card">
          <strong>{merchants.length}</strong>
          <span>Merchant accounts</span>
        </div>
        <div className="admin-compact-card">
          <strong>{merchants.filter((merchant) => merchant.full_name).length}</strong>
          <span>Named profiles</span>
        </div>
      </section>

      {merchants.length === 0 ? (
        <div className="info-card empty-state">
          <p>No merchants yet. Click &quot;Add Merchant&quot; to create one.</p>
        </div>
      ) : (
        <div className="admin-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.full_name || "—"}</td>
                  <td>{m.email}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(m.id)} className="button-secondary btn-sm">
                      Remove
                    </button>
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
