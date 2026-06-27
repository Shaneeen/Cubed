import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase service role configuration.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "super_admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { merchant_id } = await request.json();

  if (!merchant_id) {
    return NextResponse.json({ error: "merchant_id is required" }, { status: 400 });
  }

  const serviceClient = createServiceClient();

  // Verify merchant belongs to this super admin
  const { data: merchant } = await serviceClient
    .from("profiles")
    .select("super_admin_id")
    .eq("id", merchant_id)
    .eq("role", "merchant")
    .single();

  if (!merchant || merchant.super_admin_id !== user.id) {
    return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
  }

  // Delete auth user (cascades to profile via FK)
  const { error } = await serviceClient.auth.admin.deleteUser(merchant_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
