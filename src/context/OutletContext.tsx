"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getOutletById, type Outlet } from "@/lib/outlets";

const storageKey = "cubed-selected-outlet";

interface OutletContextValue {
  selectedOutlet: Outlet | undefined;
  isSelectorOpen: boolean;
  hasExistingSelection: boolean;
  setSelectedOutlet: (...args: [string]) => void;
  openSelector: () => void;
  closeSelector: () => void;
}

const OutletContext = createContext<OutletContextValue | undefined>(undefined);

export function OutletProvider({ children }: { children: React.ReactNode }) {
  const [selectedOutletId, setSelectedOutletId] = useState<string | undefined>(undefined);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [hasExistingSelection, setHasExistingSelection] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored && getOutletById(stored)) {
      setSelectedOutletId(stored);
      setHasExistingSelection(true);
    } else {
      setIsSelectorOpen(true);
    }
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
        selectedOutlet: getOutletById(selectedOutletId),
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
