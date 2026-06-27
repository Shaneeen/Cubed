// TEMPORARY MOCK CATALOG — replace with a DB/API call when merchant products
// move to Supabase. This represents the pool of products a merchant could
// pick from in the "Add product" flow in the Merchant Portal. Keep the
// `Product` shape so swapping the data source later requires no call-site
// changes (see `getMerchantProducts` in `src/lib/merchants.ts`).
import type { Product } from "@/types/cube";

function img(seed: string, w = 800, h = 800) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export const mockCatalogProducts: Product[] = [
  {
    id: "catalog-charm-bracelet",
    name: "Linked Charm Bracelet",
    price: 88,
    currency: "SGD",
    images: [img("catalog-charm-bracelet")],
    description: "Delicate chain bracelet with three rotating seasonal charms.",
    stockStatus: "in_stock",
  },
  {
    id: "catalog-signet-ring",
    name: "Engraved Signet Ring",
    price: 142,
    currency: "SGD",
    images: [img("catalog-signet-ring")],
    description: "Classic signet silhouette, hand-engraved on request.",
    stockStatus: "in_stock",
    sizes: ["5", "6", "7", "8"],
  },
  {
    id: "catalog-pearl-studs",
    name: "Freshwater Pearl Studs",
    price: 64,
    currency: "SGD",
    images: [img("catalog-pearl-studs")],
    description: "Small freshwater pearls set on hypoallergenic posts.",
    stockStatus: "in_stock",
  },
  {
    id: "catalog-chain-anklet",
    name: "Fine Chain Anklet",
    price: 52,
    currency: "SGD",
    images: [img("catalog-chain-anklet")],
    description: "Lightweight cable chain anklet with a lobster clasp.",
    stockStatus: "in_stock",
  },
];

export function getCatalogProductById(id: string): Product | undefined {
  return mockCatalogProducts.find((product) => product.id === id);
}
