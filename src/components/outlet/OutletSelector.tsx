"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Store } from "lucide-react";
import { outlets } from "@/lib/outlets";
import { useOutlet } from "@/context/OutletContext";

export function OutletSelector() {
  const { isSelectorOpen, hasExistingSelection, setSelectedOutlet, closeSelector } = useOutlet();

  return (
    <AnimatePresence>
      {isSelectorOpen && (
        <motion.div
          className="outlet-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(event) => {
            if (hasExistingSelection && event.target === event.currentTarget) {
              closeSelector();
            }
          }}
          onKeyDown={(event) => {
            if (hasExistingSelection && event.key === "Escape") {
              closeSelector();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Select an outlet"
        >
          <motion.div
            className="outlet-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <p className="eyebrow">Cube Sprout</p>
            <h2>Which outlet are you visiting?</h2>
            <p className="hero-text">
              Pick an outlet to see what&apos;s available there. You can switch outlets anytime
              from the header.
            </p>

            <div className="outlet-grid">
              {outlets.map((outlet) => (
                <motion.button
                  key={outlet.id}
                  type="button"
                  className="outlet-card"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={() => setSelectedOutlet(outlet.id)}
                >
                  <Store size={22} />
                  <p className="card-label">{outlet.name}</p>
                  <p className="hero-text">{outlet.descriptor}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
