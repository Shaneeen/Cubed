"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { StockBadge } from "@/components/customer/StockBadge";
import type { Product } from "@/types/cube";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    setIsDesktop(query.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-soft">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-bg-elevated/80 p-1.5 text-text shadow-theme backdrop-blur"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-bg-elevated/80 p-1.5 text-text shadow-theme backdrop-blur"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  i === index ? "w-4 bg-primary-strong" : "bg-bg-elevated/70"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProductDetails({ product }: { product: Product }) {
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [variant, setVariant] = useState<string | undefined>(
    product.variants?.find((v) => v.available)?.label
  );

  return (
    <div className="space-y-5">
      <ImageCarousel images={product.images} name={product.name} />

      <div className="space-y-2">
        <StockBadge status={product.stockStatus} />
        <h2 className="text-xl font-semibold tracking-tight text-text">
          {product.name}
        </h2>
        <p className="text-lg font-medium text-primary-strong">
          {product.currency} {product.price.toFixed(2)}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-text-muted">
        {product.description}
      </p>

      {product.variants && product.variants.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Variant
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.label}
                type="button"
                disabled={!v.available}
                onClick={() => setVariant(v.label)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  !v.available &&
                    "cursor-not-allowed border-border text-text-muted/50 line-through",
                  v.available &&
                    variant === v.label &&
                    "border-primary bg-primary text-primary-foreground",
                  v.available &&
                    variant !== v.label &&
                    "border-border text-text hover:border-primary-strong"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "min-w-10 rounded-full border px-3 py-1.5 text-sm transition-colors",
                  size === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-text hover:border-primary-strong"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductPanel({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isDesktop = useIsDesktop();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && product && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay forceMount asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              forceMount
              aria-describedby={undefined}
              asChild
              className={cn(
                "fixed z-50 outline-none",
                isDesktop
                  ? "left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
                  : "inset-x-0 bottom-0 w-full"
              )}
            >
              <motion.div
                initial={
                  isDesktop ? { opacity: 0, scale: 0.94 } : { y: "100%" }
                }
                animate={isDesktop ? { opacity: 1, scale: 1 } : { y: 0 }}
                exit={isDesktop ? { opacity: 0, scale: 0.94 } : { y: "100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 32 }}
              >
                <DialogPrimitive.Title className="sr-only">
                  {product.name}
                </DialogPrimitive.Title>
                <div
                  className={cn(
                    "relative max-h-[90vh] overflow-y-auto bg-popover p-6 text-popover-foreground shadow-theme",
                    isDesktop ? "rounded-3xl" : "rounded-t-3xl pb-10 pt-5"
                  )}
                >
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 z-10 rounded-full bg-bg-elevated/80 p-1.5 text-text shadow-theme backdrop-blur"
                  >
                    <X className="size-4" />
                  </button>

                  {!isDesktop && (
                    <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
                  )}

                  <ProductDetails product={product} />
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
