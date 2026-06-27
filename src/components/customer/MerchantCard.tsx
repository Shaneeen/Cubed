"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Cube } from "@/types/cube";

export function MerchantCard({ cube, onOpen }: { cube: Cube; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-surface text-left shadow-theme transition-shadow hover:border-primary hover:shadow-lg"
    >
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-surface-soft">
        {cube.logo ? (
          <Image
            src={cube.logo}
            alt={`${cube.merchantName} logo`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4 sm:p-5">
        <h3 className="text-sm font-semibold leading-snug text-text sm:text-base">
          {cube.merchantName}
        </h3>
        {cube.tagline && (
          <p className="text-sm text-text-muted">{cube.tagline}</p>
        )}
      </div>
    </motion.button>
  );
}
