"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Signed in, but failed to load your account.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user!.id)
      .single();

    if (profileError || !profile?.role) {
      setError(
        profileError?.message
          ? `Profile lookup failed: ${profileError.message}`
          : `Profile lookup failed for user ${user.id}.`
      );
      setLoading(false);
      return;
    }

    const role = profile?.role;
    const dest = role === "super_admin" ? "/dashboard" : "/merchant";
    window.location.href = dest;
  }

  return (
    <form onSubmit={handleLogin} className="info-card stack-md">
      {error && (
        <p style={{ color: "#e74c3c", margin: 0, fontSize: "0.875rem" }}>
          {error}
        </p>
      )}

      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={{
            padding: "0.65rem 0.85rem",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        />
      </label>

      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{
            padding: "0.65rem 0.85rem",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        />
      </label>

      <button
        type="submit"
        className="button-primary"
        disabled={loading}
        style={{ width: "100%", cursor: loading ? "wait" : "pointer" }}
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <section className="stack-lg" style={{ maxWidth: 420, margin: "2rem auto" }}>
      <div className="section-head">
        <p className="eyebrow">Authentication</p>
        <h1>Sign In</h1>
        <p className="section-copy">Log in to access your dashboard.</p>
      </div>

      <LoginForm />
    </section>
  );
}
