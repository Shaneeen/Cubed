export type Outlet = {
  id: string;
  super_admin_id: string;
  name: string;
  address: string | null;
  descriptor: string | null;
  public_href: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type Cube = {
  id: string;
  outlet_id: string;
  label: string;
  merchant_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductStatus = "draft" | "active" | "hidden" | "sold_out";

export type ProductCategory = {
  id: string;
  merchant_id: string;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MerchantProduct = {
  id: string;
  merchant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  quantity: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
};
