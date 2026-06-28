"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AreaChart({
  values,
  width = 480,
  height = 160,
}: {
  values: number[];
  width?: number;
  height?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const max = Math.max(...values, 1);
  const stepX = width / (values.length - 1);

  const points = values.map((v, i) => [i * stepX, height - (v / max) * height]);
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label="Views over time"
    >
      <motion.path
        d={areaPath}
        fill="var(--color-primary)"
        opacity={0.12}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={prefersReducedMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}
