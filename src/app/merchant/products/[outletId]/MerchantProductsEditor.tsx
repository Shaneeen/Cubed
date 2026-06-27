"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Flame, Minus, Plus, Sparkles, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductCard } from "@/components/customer/ProductCard";
import { getMerchantById } from "@/lib/merchants";
import { CURRENT_MERCHANT_ID } from "@/lib/merchantSession";
import { getOutletById } from "@/lib/outlets";
import { mockCatalogProducts } from "@/lib/mockCatalog";
import {
  getOutletProductIds,
  getProductEffects,
  setOutletProductIds,
  setProductEffect,
  type ProductEffect,
} from "@/lib/outletProductStore";
import type { Product } from "@/types/cube";

const effectOptions: { value: ProductEffect; label: string; icon: typeof Flame }[] = [
  { value: "none", label: "None", icon: X },
  { value: "fiery", label: "Fiery", icon: Flame },
  { value: "shimmer", label: "Shimmer", icon: Sparkles },
];

export function MerchantProductsEditor({ outletId }: { outletId: string }) {
  const prefersReducedMotion = useReducedMotion();
  const cube = getMerchantById(CURRENT_MERCHANT_ID);
  const outlet = getOutletById(outletId);

  const [productIds, setProductIds] = useState<string[]>(() =>
    cube ? cube.products.map((p) => p.id) : []
  );
  const [effects, setEffects] = useState<Record<string, ProductEffect>>({});

  useEffect(() => {
    if (!cube) return;
    setProductIds(getOutletProductIds(cube.id, outletId, cube.products.map((p) => p.id)));
    setEffects(getProductEffects(cube.id, outletId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cube?.id, outletId]);

  if (!cube || !outlet) {
    return (
      <div className="stack-lg">
        <p className="hero-text">This outlet could not be found.</p>
        <Link href="/merchant/products" className="button-secondary">
          Back to outlets
        </Link>
      </div>
    );
  }

  function resolveProduct(id: string): Product | undefined {
    return cube!.products.find((p) => p.id === id) ?? mockCatalogProducts.find((p) => p.id === id);
  }

  const products = productIds.map(resolveProduct).filter((p): p is Product => Boolean(p));
  const addableProducts = mockCatalogProducts.filter((p) => !productIds.includes(p.id));

  function persist(nextIds: string[]) {
    setProductIds(nextIds);
    setOutletProductIds(cube!.id, outletId, nextIds);
  }

  function removeProduct(id: string) {
    persist(productIds.filter((p) => p !== id));
  }

  function addProduct(id: string) {
    if (productIds.includes(id)) return;
    persist([...productIds, id]);
  }

  function changeEffect(id: string, effect: ProductEffect) {
    setEffects((prev) => ({ ...prev, [id]: effect }));
    setProductEffect(cube!.id, outletId, id, effect);
  }

  const tileTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 360, damping: 28 };

  return (
    <div className="stack-lg">
      <div className="stack-md">
        <nav aria-label="Breadcrumb" className="hero-text">
          <Link href="/merchant/products">Products</Link> {" › "} {outlet.name}
        </nav>
        <Link
          href="/merchant/products"
          className="button-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", width: "fit-content" }}
        >
          <ArrowLeft size={16} />
          Back to outlets
        </Link>
        <div className="section-head">
          <p className="eyebrow">Managing</p>
          <h1>{outlet.name}</h1>
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
      >
        <AnimatePresence>
          {products.map((product) => {
            const effect = effects[product.id] ?? "none";
            return (
              <motion.div
                key={product.id}
                layout
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
                transition={tileTransition}
                className="merchant-product-tile"
              >
                <div className={`product-fx product-fx-${effect}`}>
                  <ProductCard product={product} currency={product.currency} onOpen={() => {}} />
                  <button
                    type="button"
                    className="merchant-tile-remove"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => removeProduct(product.id)}
                  >
                    <Minus size={14} />
                  </button>
                </div>
                <div className="effect-picker">
                  {effectOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className="effect-picker-btn"
                      data-active={effect === opt.value}
                      onClick={() => changeEffect(product.id, opt.value)}
                      aria-label={`${opt.label} effect`}
                    >
                      <opt.icon size={14} />
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <Dialog>
          <DialogTrigger asChild>
            <button type="button" className="add-product-tile">
              <Plus size={28} />
              <span>Add product</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>Add a product</DialogTitle>
            <p className="hero-text">
              Sample catalogue for now — in a future update this will pull directly from the
              database.
            </p>
            <div className="stack-md">
              {addableProducts.length === 0 && (
                <p className="hero-text">All catalogue products are already added.</p>
              )}
              {addableProducts.map((product) => (
                <div key={product.id} className="add-catalog-row">
                  <span>{product.name}</span>
                  <button type="button" className="button-secondary" onClick={() => addProduct(product.id)}>
                    Add
                  </button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
