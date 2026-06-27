import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export interface Outlet {
  id: string;
  name: string;
  descriptor: string | null;
  href: string;
  address?: string | null;
}

export const outlets: Outlet[] = [];

export function getOutletById(id: string | null | undefined): Outlet | undefined {
  return outlets.find((outlet) => outlet.id === id);
}

type PublicOutletRow = {
  id: string;
  name: string;
  address: string | null;
  descriptor: string | null;
  public_href: string | null;
};

export async function fetchPublicOutlets(): Promise<Outlet[]> {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase
    .from("outlets")
    .select("id, name, address, descriptor, public_href")
    .eq("is_public", true)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PublicOutletRow[]).map((outlet) => ({
    id: outlet.id,
    name: outlet.name,
    address: outlet.address,
    descriptor: outlet.descriptor,
    href: outlet.public_href ?? "/products",
  }));
}
