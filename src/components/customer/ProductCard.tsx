"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { StockBadge } from "@/components/customer/StockBadge";
import type { Product } from "@/types/cube";

export function ProductCard({
  product,
  currency,
  onOpen,
}: {
  product: Product;
  currency: string;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-surface text-left shadow-theme"
    >
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-surface-soft">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StockBadge status={product.stockStatus} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-text sm:text-base">
          {product.name}
        </h3>
        <p className="mt-auto text-sm font-medium text-primary-strong sm:text-base">
          {currency} {product.price.toFixed(2)}
        </p>
      </div>
    </motion.button>
  );
}
