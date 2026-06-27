"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Store } from "lucide-react";
import { outlets } from "@/lib/outlets";
import { getMerchantById } from "@/lib/merchants";
import { CURRENT_MERCHANT_ID } from "@/lib/merchantSession";

export function MerchantProductsOutletPicker() {
  const router = useRouter();
  const cube = getMerchantById(CURRENT_MERCHANT_ID);
  const myOutlets = outlets.filter((outlet) => cube?.outletIds?.includes(outlet.id));

  return (
    <div className="stack-lg">
      <div className="section-head">
        <p className="eyebrow">Products</p>
        <h1>Choose an outlet</h1>
        <p className="section-copy">
          Select one of your cubes to manage how your products appear to customers there.
        </p>
      </div>

      <div className="outlet-grid">
        {myOutlets.map((outlet, i) => (
          <motion.button
            key={outlet.id}
            type="button"
            className="outlet-card"
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.08 }}
            onClick={() => router.push(`/merchant/products/${outlet.id}`)}
          >
            <Store size={22} />
            <p className="card-label">{outlet.name}</p>
            <p className="hero-text">{outlet.descriptor}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
