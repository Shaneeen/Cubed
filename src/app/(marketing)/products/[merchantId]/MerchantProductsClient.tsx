"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/customer/ProductCard";
import { ProductPanel } from "@/components/customer/ProductPanel";
import { getMerchantById, getMerchantProducts, isMerchantAtOutlet } from "@/lib/merchants";
import { useOutlet } from "@/context/OutletContext";

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function MerchantProductsClient({ merchantId }: { merchantId: string }) {
  const router = useRouter();
  const { selectedOutlet, openSelector } = useOutlet();
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const cube = getMerchantById(merchantId);

  useEffect(() => {
    if (cube && !isMerchantAtOutlet(cube, selectedOutlet?.id)) {
      router.replace("/products");
    }
  }, [cube, selectedOutlet, router]);

  if (!cube) {
    return (
      <div className="stack-lg">
        <p className="hero-text">This merchant could not be found.</p>
        <Link href="/products" className="button-secondary">
          Back to merchants
        </Link>
      </div>
    );
  }

  const products = getMerchantProducts(cube, selectedOutlet?.id);
  const activeProduct = products.find((p) => p.id === activeProductId) ?? null;

  return (
    <div className="stack-lg">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="stack-md"
      >
        <nav aria-label="Breadcrumb" className="hero-text">
          <Link href="/products">Products</Link>
          {" › "}
          {selectedOutlet && <>{selectedOutlet.name}{" › "}</>}
          {cube.merchantName}
        </nav>

        <Link
          href="/products"
          className="button-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", width: "fit-content" }}
        >
          <ArrowLeft size={16} />
          Back to merchants
        </Link>

        {selectedOutlet && (
          <span className="outlet-pill">
            Viewing: {selectedOutlet.name}
            <a role="button" tabIndex={0} onClick={openSelector}>
              Change
            </a>
          </span>
        )}

        <div className="section-head">
          <p className="eyebrow">{cube.tagline}</p>
          <h1>{cube.merchantName}</h1>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currency={product.currency}
            onOpen={() => setActiveProductId(product.id)}
          />
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
