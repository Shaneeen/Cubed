"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MerchantCard } from "@/components/customer/MerchantCard";
import { getMerchantsByOutlet } from "@/lib/merchants";
import { useOutlet } from "@/context/OutletContext";

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function ProductsPageClient() {
  const router = useRouter();
  const { selectedOutlet, openSelector } = useOutlet();

  const merchants = getMerchantsByOutlet(selectedOutlet?.id);

  return (
    <div className="stack-lg">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0 }}
        className="section-head"
      >
        <p className="eyebrow">Products</p>
        <h1>Merchants</h1>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
      >
        {selectedOutlet ? (
          <span className="outlet-pill">
            Viewing: {selectedOutlet.name}
            <a role="button" tabIndex={0} onClick={openSelector}>
              Change
            </a>
          </span>
        ) : (
          <div className="info-card stack-md">
            <p className="hero-text">
              Select an outlet to see which merchants are available there.
            </p>
            <button type="button" className="button-secondary" onClick={openSelector}>
              Choose an outlet
            </button>
          </div>
        )}
      </motion.div>

      {merchants.length === 0 ? (
        <motion.p
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.16 }}
          className="hero-text"
        >
          No merchants are set up at this outlet yet.
        </motion.p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.16 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5"
        >
          {merchants.map((cube) => (
            <MerchantCard
              key={cube.id}
              cube={cube}
              onOpen={() => router.push(`/products/${cube.id}`)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
