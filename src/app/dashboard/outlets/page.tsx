"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/AuthContext";
import type { Outlet } from "@/types/models";

export default function OutletsPage() {
  const { profile, loading: authLoading, error: authError } = useAuth();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [descriptor, setDescriptor] = useState("");
  const [publicHref, setPublicHref] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  async function loadOutlets() {
    const { data, error: loadError } = await supabase.rpc(
      "get_super_admin_outlet_overview"
    );

    if (loadError) {
      setError("Unable to load outlets.");
      setLoading(false);
      return;
    }

    setOutlets(data ?? []);
    setError(null);
    setLoading(false);
  }

  useEffect(() => {
    loadOutlets();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function startEdit(outlet: Outlet) {
    setEditingId(outlet.id);
    setName(outlet.name);
    setAddress(outlet.address ?? "");
    setDescriptor(outlet.descriptor ?? "");
    setPublicHref(outlet.public_href ?? "");
    setIsPublic(outlet.is_public);
    setShowForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setAddress("");
    setDescriptor("");
    setPublicHref("");
    setIsPublic(true);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (editingId) {
      const { error: updateError } = await supabase
        .from("outlets")
        .update({
          name,
          address: address || null,
          descriptor: descriptor || null,
          public_href: publicHref || null,
          is_public: isPublic,
        })
        .eq("id", editingId);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      if (!profile) {
        setError("Profile not found.");
        setSaving(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("outlets")
        .insert({
          name,
          address: address || null,
          descriptor: descriptor || null,
          public_href: publicHref || null,
          is_public: isPublic,
          super_admin_id: profile.id,
        });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    resetForm();
    setSaving(false);
    loadOutlets();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this outlet? All its cubes will also be deleted.")) return;
    const { error: deleteError } = await supabase.from("outlets").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    loadOutlets();
  }

  if (authLoading || loading) return <p>Loading…</p>;
  if (authError) return <p>{authError}</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div className="section-head">
          <p className="eyebrow">Outlet CRUD</p>
          <h1>Outlets</h1>
          <p className="section-copy">
            Create the storefronts customers browse, then drill into each outlet
            to configure cubes and merchant placement.
          </p>
        </div>
        <button className="button-primary" onClick={() => { showForm ? resetForm() : setShowForm(true); }}>
          {showForm ? "Cancel" : "Add Outlet"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form-card stack-md">
          <h2 style={{ margin: 0 }}>{editingId ? "Edit Outlet" : "New Outlet"}</h2>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Outlet Name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
          </label>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Address (optional)</span>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Location descriptor</span>
            <input
              type="text"
              value={descriptor}
              onChange={(e) => setDescriptor(e.target.value)}
              placeholder="e.g. Community mall in Tampines Central"
              style={inputStyle}
            />
          </label>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Public floorplan URL</span>
            <input
              type="text"
              value={publicHref}
              onChange={(e) => setPublicHref(e.target.value)}
              placeholder="/ourtampineshubfloorplan"
              style={inputStyle}
            />
          </label>
          <label style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Show this outlet to customers
            </span>
          </label>
          <button type="submit" className="button-primary" disabled={saving}>
            {saving ? "Saving…" : editingId ? "Update Outlet" : "Create Outlet"}
          </button>
        </form>
      )}

      {error && <p style={{ color: "#e74c3c", margin: 0 }}>{error}</p>}

      {outlets.length === 0 ? (
        <div className="info-card empty-state">
          <p>No outlets yet. Click &quot;Add Outlet&quot; to create your first store location.</p>
        </div>
      ) : (
        <div className="admin-outlet-grid">
          {outlets.map((o) => (
            <article key={o.id} className="admin-outlet-card">
              <div className="admin-outlet-card-top">
                <p className="eyebrow">Outlet</p>
                <h2>{o.name}</h2>
                <p>{o.descriptor || o.address || "Location details not added yet."}</p>
              </div>

              <div className="admin-outlet-meta">
                <span>{o.is_public ? "Visible to customers" : "Hidden from customers"}</span>
                {typeof (o as Outlet & { cube_count?: number }).cube_count === "number" ? (
                  <span>{(o as Outlet & { cube_count?: number }).cube_count} cubes</span>
                ) : null}
                {typeof (o as Outlet & { occupied_cube_count?: number }).occupied_cube_count === "number" ? (
                  <span>{(o as Outlet & { occupied_cube_count?: number }).occupied_cube_count} assigned</span>
                ) : null}
                <span>Created {new Date(o.created_at).toLocaleDateString()}</span>
              </div>

              {o.public_href ? (
                <p className="hero-text" style={{ margin: 0 }}>
                  Public route: <code>{o.public_href}</code>
                </p>
              ) : null}

              <div className="admin-outlet-actions">
                <Link href={`/dashboard/outlets/${o.id}/cubes`} className="button-primary">
                  Manage Cubes
                </Link>
                <button onClick={() => startEdit(o)} className="button-secondary">
                  Edit
                </button>
                <button onClick={() => handleDelete(o.id)} className="button-secondary">
                  Delete
                </button>
              </div>
            </article>
          ))}
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
