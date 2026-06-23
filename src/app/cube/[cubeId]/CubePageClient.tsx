"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CubeHeader } from "@/components/customer/CubeHeader";
import { ProductCard } from "@/components/customer/ProductCard";
import { ProductPanel } from "@/components/customer/ProductPanel";
import type { Cube } from "@/types/cube";

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function CubePageClient({ cube, storeId }: { cube: Cube; storeId: string }) {
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const activeProduct = cube.products.find((p) => p.id === activeProductId) ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8 lg:space-y-10">
      <CubeHeader cube={cube} storeId={storeId} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={gridVariants}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5"
      >
        {cube.products.map((product) => (
          <motion.div key={product.id} variants={cardVariants} className="h-full">
            <ProductCard
              product={product}
              currency={product.currency}
              onOpen={() => setActiveProductId(product.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      <ProductPanel
        product={activeProduct}
        open={activeProductId !== null}
        onOpenChange={(open) => {
          if (!open) setActiveProductId(null);
        }}
      />
    </div>
  );
}
