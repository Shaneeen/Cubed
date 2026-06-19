"use client";

import { useEffect } from "react";

const storageKey = "cubed-theme";

function resolveInitialTheme(): "light" | "dark" {
  const stored = window.localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = resolveInitialTheme();
  }, []);

  return <>{children}</>;
}
