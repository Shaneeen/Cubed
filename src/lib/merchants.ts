import { mockStore } from "@/lib/mockData";
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
 * Products are identical across outlets today. outletId is accepted so
 * per-outlet availability can be layered in later without changing call sites.
 */
export function getMerchantProducts(cube: Cube, _outletId: string | undefined): Product[] {
  return cube.products;
}
