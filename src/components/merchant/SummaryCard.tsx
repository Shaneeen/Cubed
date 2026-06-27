"use client";

import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

export function SummaryCard({
  label,
  value,
  prefix = "",
  suffix = "",
  delay = 0,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) {
  const count = useCountUp(value);

  return (
    <motion.div
      className="dashboard-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
    >
      <p className="eyebrow">{label}</p>
      <p className="metric-value">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </p>
    </motion.div>
  );
}
