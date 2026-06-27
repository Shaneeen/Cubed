import type { Product } from "@/types/cube";

export const mockCatalogProducts: Product[] = [];

export function getCatalogProductById(id: string): Product | undefined {
  return mockCatalogProducts.find((product) => product.id === id);
}
