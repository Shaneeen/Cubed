"use client";

import { motion } from "framer-motion";
import { SummaryCard } from "@/components/merchant/SummaryCard";
import { AreaChart } from "@/components/merchant/AreaChart";
import { BarChart } from "@/components/merchant/BarChart";
import { getMerchantById } from "@/lib/merchants";
import { CURRENT_MERCHANT_ID } from "@/lib/merchantSession";

const viewsOverTime = [120, 145, 138, 162, 190, 175, 210];

const recentActivity = [
  { text: "New order: Halo Solitaire Ring", time: "2 hours ago" },
  { text: "Thread Pendant Necklace viewed 18 times today", time: "5 hours ago" },
  { text: "Stock updated: Drift Hoop Earrings", time: "Yesterday" },
  { text: "New order: Stacked Band Set", time: "2 days ago" },
];

export function MerchantDashboardClient() {
  const cube = getMerchantById(CURRENT_MERCHANT_ID);
  const productCount = cube?.products.length ?? 0;

  const salesByProduct =
    cube?.products.slice(0, 5).map((product, i) => ({
      label: product.name.split(" ")[0],
      value: 8 + ((i * 7 + product.name.length) % 22),
    })) ?? [];

  return (
    <div className="stack-lg">
      <div className="section-head">
        <p className="eyebrow">Merchant Dashboard</p>
        <h1>{cube?.merchantName ?? "Merchant"}</h1>
      </div>

      <div className="dashboard-grid">
        <SummaryCard label="Products listed" value={productCount} delay={0} />
        <SummaryCard label="Views (30 days)" value={3482} delay={0.08} />
        <SummaryCard label="Orders (30 days)" value={96} delay={0.16} />
        <SummaryCard label="Revenue (30 days)" value={5240} prefix="$" delay={0.24} />
      </div>

      <div className="dashboard-charts">
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.32 }}
        >
          <p className="card-label">Views over the last week</p>
          <AreaChart values={viewsOverTime} />
        </motion.div>

        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.4 }}
        >
          <p className="card-label">Sales by product</p>
          <BarChart data={salesByProduct} />
        </motion.div>
      </div>

      <motion.div
        className="dashboard-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.48 }}
      >
        <p className="card-label">Recent activity</p>
        <ul className="activity-list">
          {recentActivity.map((entry, i) => (
            <motion.li
              key={entry.text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
            >
              <span>{entry.text}</span>
              <span className="hero-text">{entry.time}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
