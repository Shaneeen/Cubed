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
