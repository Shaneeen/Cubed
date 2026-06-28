"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Search, ShoppingBag } from "lucide-react";
import { ProductPanel } from "@/components/customer/ProductPanel";
import type { Cube } from "@/types/cube";

export function CubePageClient({ cube, storeId }: { cube: Cube; storeId: string }) {
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const activeProduct = cube.products.find((p) => p.id === activeProductId) ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-4 text-text">
      <header className="rounded-xl border border-border bg-bg-elevated p-4 shadow-theme backdrop-blur-2xl sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/store/${storeId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-text-muted transition hover:text-text"
          >
            <ArrowLeft size={16} />
            Store
          </Link>

          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-muted">
            <Search size={15} />
            Search coming soon
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              Merchant cube
            </p>
            <h1 className="text-4xl font-semibold leading-none tracking-normal text-text sm:text-5xl lg:text-6xl">
              {cube.merchantName}
            </h1>
            {cube.tagline && (
              <p className="text-base font-medium text-text-muted">{cube.tagline}</p>
            )}
            <p className="max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
              {cube.about || "This cube is ready for merchant details."}
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
            {cube.logo ? (
              <Image
                src={cube.logo}
                alt={`${cube.merchantName} logo`}
                width={72}
                height={72}
                className="size-16 rounded-lg object-cover"
              />
            ) : (
              <div className="grid size-16 place-items-center rounded-lg border border-border bg-surface-soft">
                <ShoppingBag size={24} />
              </div>
            )}
            <div>
              <strong className="block text-2xl leading-none text-text">
                {cube.products.length}
              </strong>
              <span className="text-sm text-text-muted">Products listed</span>
            </div>
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-border bg-bg-elevated p-4 shadow-theme backdrop-blur-2xl sm:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              Browse
            </p>
            <h2 className="text-2xl font-semibold text-text">Products</h2>
          </div>
        </div>

        {cube.products.length === 0 ? (
          <div className="grid justify-items-center gap-2 rounded-xl border border-dashed border-border p-10 text-center">
            <Package size={28} className="text-text-muted" />
            <h3 className="text-lg font-semibold text-text">No products yet</h3>
            <p className="max-w-md text-sm leading-relaxed text-text-muted">
              Once products are connected to this cube, they will appear here in
              a compact customer-facing grid.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } },
            }}
          >
            {cube.products.map((product) => (
              <motion.button
                type="button"
                key={product.id}
                className="grid min-h-52 overflow-hidden rounded-xl border border-border bg-surface text-left shadow-theme"
                onClick={() => setActiveProductId(product.id)}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative grid aspect-square place-items-center bg-surface-soft text-text-muted">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 220px"
                      className="object-cover"
                    />
                  ) : (
                    <Package size={24} />
                  )}
                </div>
                <div className="grid gap-2 p-3">
                  <h3 className="text-sm font-semibold leading-snug text-text">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-text">
                    {product.currency} {product.price.toFixed(2)}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </section>

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
