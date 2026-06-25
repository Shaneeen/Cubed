"use client";

import { motion, useReducedMotion } from "framer-motion";

export function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const prefersReducedMotion = useReducedMotion();
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bar-chart" role="img" aria-label="Sales by product">
      {data.map((entry, i) => (
        <div key={entry.label} className="bar-chart-col">
          <div className="bar-chart-track">
            <motion.div
              className="bar-chart-bar"
              initial={prefersReducedMotion ? false : { scaleY: 0 }}
              animate={{ scaleY: entry.value / max }}
              transition={{ duration: 0.5, ease: "easeOut", delay: prefersReducedMotion ? 0 : i * 0.08 }}
              style={{ transformOrigin: "bottom" }}
            />
          </div>
          <span className="bar-chart-label">{entry.label}</span>
        </div>
      ))}
    </div>
  );
}
