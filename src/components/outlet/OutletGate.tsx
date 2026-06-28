"use client";

import { useOutlet } from "@/context/OutletContext";
import { OutletSelector } from "@/components/outlet/OutletSelector";

export function OutletGate({ children }: { children: React.ReactNode }) {
  const { isSelectorOpen } = useOutlet();

  return (
    <>
      <div
        aria-hidden={isSelectorOpen}
        style={isSelectorOpen ? { pointerEvents: "none" } : undefined}
      >
        {children}
      </div>
      <OutletSelector />
    </>
  );
}
