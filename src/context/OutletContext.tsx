"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchPublicOutlets, type Outlet } from "@/lib/outlets";

const storageKey = "cubed-selected-outlet";

interface OutletContextValue {
  outlets: Outlet[];
  selectedOutlet: Outlet | undefined;
  isLoadingOutlets: boolean;
  outletError: string | null;
  isSelectorOpen: boolean;
  hasExistingSelection: boolean;
  setSelectedOutlet: (...args: [string]) => void;
  openSelector: () => void;
  closeSelector: () => void;
}

const OutletContext = createContext<OutletContextValue | undefined>(undefined);

export function OutletProvider({ children }: { children: React.ReactNode }) {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutletId, setSelectedOutletId] = useState<string | undefined>(undefined);
  const [isLoadingOutlets, setIsLoadingOutlets] = useState(true);
  const [outletError, setOutletError] = useState<string | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [hasExistingSelection, setHasExistingSelection] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadOutlets() {
      try {
        const publicOutlets = await fetchPublicOutlets();
        if (cancelled) return;

        setOutlets(publicOutlets);

        const stored = window.localStorage.getItem(storageKey);
        if (stored && publicOutlets.some((outlet) => outlet.id === stored)) {
          setSelectedOutletId(stored);
          setHasExistingSelection(true);
        } else {
          window.localStorage.removeItem(storageKey);
        }
      } catch (error) {
        if (!cancelled) {
          setOutletError(error instanceof Error ? error.message : "Unable to load outlets.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingOutlets(false);
        }
      }
    }

    loadOutlets();
    return () => {
      cancelled = true;
    };
  }, []);

  function setSelectedOutlet(id: string) {
    setSelectedOutletId(id);
    setHasExistingSelection(true);
    window.localStorage.setItem(storageKey, id);
    setIsSelectorOpen(false);
  }

  return (
    <OutletContext.Provider
      value={{
        outlets,
        selectedOutlet: outlets.find((outlet) => outlet.id === selectedOutletId),
        isLoadingOutlets,
        outletError,
        isSelectorOpen,
        hasExistingSelection,
        setSelectedOutlet,
        openSelector: () => setIsSelectorOpen(true),
        closeSelector: () => setIsSelectorOpen(false),
      }}
    >
      {children}
    </OutletContext.Provider>
  );
}

export function useOutlet() {
  const ctx = useContext(OutletContext);
  if (!ctx) {
    throw new Error("useOutlet must be used within an OutletProvider");
  }
  return ctx;
}
