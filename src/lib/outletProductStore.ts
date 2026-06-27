export type ProductEffect = "none" | "fiery" | "shimmer";

function productsKey(cubeId: string, outletId: string) {
  return `cubed-outlet-products:${cubeId}:${outletId}`;
}

function effectsKey(cubeId: string, outletId: string) {
  return `cubed-product-effects:${cubeId}:${outletId}`;
}

export function getOutletProductIds(
  cubeId: string,
  outletId: string,
  defaultIds: string[]
): string[] {
  if (typeof window === "undefined") return defaultIds;
  const stored = window.localStorage.getItem(productsKey(cubeId, outletId));
  if (!stored) return defaultIds;
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : defaultIds;
  } catch {
    return defaultIds;
  }
}

export function setOutletProductIds(cubeId: string, outletId: string, ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(productsKey(cubeId, outletId), JSON.stringify(ids));
}

export function getProductEffects(
  cubeId: string,
  outletId: string
): Record<string, ProductEffect> {
  if (typeof window === "undefined") return {};
  const stored = window.localStorage.getItem(effectsKey(cubeId, outletId));
  if (!stored) return {};
  try {
    return JSON.parse(stored) ?? {};
  } catch {
    return {};
  }
}

export function getProductEffect(
  cubeId: string,
  outletId: string,
  productId: string
): ProductEffect {
  return getProductEffects(cubeId, outletId)[productId] ?? "none";
}

export function setProductEffect(
  cubeId: string,
  outletId: string,
  productId: string,
  effect: ProductEffect
) {
  if (typeof window === "undefined") return;
  const effects = getProductEffects(cubeId, outletId);
  effects[productId] = effect;
  window.localStorage.setItem(effectsKey(cubeId, outletId), JSON.stringify(effects));
}
