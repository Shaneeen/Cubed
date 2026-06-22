"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Cube } from "@/types/cube";

export function CubeCard({ cube }: { cube: Cube }) {
  const previewImages = cube.products.slice(0, 3).map((p) => p.images[0]);

  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={`/cube/${cube.id}`}
        className="block overflow-hidden rounded-3xl border border-border bg-surface shadow-theme"
      >
        <div className="grid grid-cols-3 gap-0.5 bg-surface-soft p-0.5">
          {previewImages.map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden">
              <Image
                src={src}
                alt=""
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 p-4">
          {cube.logo && (
            <div className="size-10 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
              <Image
                src={cube.logo}
                alt=""
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-text">
              {cube.merchantName}
            </h3>
            {cube.tagline && (
              <p className="truncate text-xs text-text-muted">{cube.tagline}</p>
            )}
          </div>
          <span className="ml-auto whitespace-nowrap text-xs font-medium text-text-muted">
            {cube.products.length} items
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
