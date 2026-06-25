import { mockStore } from "@/lib/mockData";
import { getCatalogProductById } from "@/lib/mockCatalog";
import { getOutletProductIds } from "@/lib/outletProductStore";
import type { Cube, Product } from "@/types/cube";

/** Merchants (cubes) present at a given outlet. Many-to-many: a cube can list multiple outletIds. */
export function getMerchantsByOutlet(outletId: string | undefined): Cube[] {
  if (!outletId) return mockStore.cubes;
  return mockStore.cubes.filter((cube) => cube.outletIds?.includes(outletId));
}

export function getMerchantById(merchantId: string): Cube | undefined {
  return mockStore.cubes.find((cube) => cube.id === merchantId);
}

export function isMerchantAtOutlet(cube: Cube, outletId: string | undefined): boolean {
  if (!outletId) return true;
  return cube.outletIds?.includes(outletId) ?? false;
}

/**
 * Resolves a merchant's products for a given outlet from the per-outlet
 * product list (set via the Merchant Portal, persisted in localStorage —
 * see lib/outletProductStore.ts). Defaults to the merchant's full catalogue
 * when nothing has been customised yet or when outletId is unset.
 */
export function getMerchantProducts(cube: Cube, outletId: string | undefined): Product[] {
  const defaultIds = cube.products.map((product) => product.id);
  if (!outletId) return cube.products;

  const ids = getOutletProductIds(cube.id, outletId, defaultIds);
  return ids
    .map(
      (id) => cube.products.find((product) => product.id === id) ?? getCatalogProductById(id)
    )
    .filter((product): product is Product => Boolean(product));
}
