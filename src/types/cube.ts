export interface Variant {
  label: string;
  available: boolean;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  description: string;
  stockStatus: StockStatus;
  sizes?: string[];
  variants?: Variant[];
}

export interface Cube {
  id: string;
  merchantName: string;
  tagline?: string;
  about: string;
  logo?: string;
  products: Product[];
}

export interface Store {
  id: string;
  name: string;
  cubes: Cube[];
}
