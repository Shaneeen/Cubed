"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/auth";
import type { User } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function loadProfile(currentUser: User) {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (profileError) {
        setProfile(null);
        setError("Unable to load your account profile.");
        return;
      }

      setProfile(data);
      setError(null);
    }

    async function loadSession() {
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setUser(null);
        setProfile(null);
        setError("Unable to verify your session.");
        setLoading(false);
        return;
      }

      if (currentUser) {
        setUser(currentUser);
        await loadProfile(currentUser);
      } else {
        setUser(null);
        setProfile(null);
        setError(null);
      }

      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: string, session: { user: User | null } | null) => {
        const newUser = session?.user ?? null;
        setUser(newUser);

        if (newUser) {
          await loadProfile(newUser);
        } else {
          setProfile(null);
          setError(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setError(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
