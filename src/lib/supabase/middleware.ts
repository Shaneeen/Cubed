import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type AppRole = "super_admin" | "merchant";

async function getProfileRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) return null;
    return (data?.role as AppRole | undefined) ?? null;
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase unreachable or misconfigured — treat as unauthenticated
  }

  const { pathname } = request.nextUrl;

  const publicPrefixes = [
    "/",
    "/about",
    "/aboutus",
    "/contact",
    "/products",
    "/cube",
    "/store",
    "/events",
    "/faq",
    "/consignment",
    "/entrepreneur",
    "/sprout-a-cube",
    "/3monthrent",
    "/one-month-trial",
    "/rentnow50-off",
    "/ourtampineshubfloorplan",
    "/pasirrismallfloorplan",
    "/woodleighmallfloorplan",
    "/copy-of-c-o-n-t-a-c-t",
    "/blank",
    "/login",
    "/unauthorized",
    "/dev",
    "/admin",
  ];
  const isPublic =
    pathname === "/" ||
    publicPrefixes.some(
      (prefix) => prefix !== "/" && (pathname === prefix || pathname.startsWith(`${prefix}/`))
    );

  // Not logged in → redirect to login (except public pages)
  if (!user && !isPublic) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Logged in and visiting /login → redirect to their dashboard
  if (user && pathname === "/login") {
    const role = await getProfileRole(supabase, user.id);
    const dest =
      role === "super_admin"
        ? "/dashboard"
        : role === "merchant"
          ? "/merchant"
          : "/unauthorized";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = dest;
    return NextResponse.redirect(redirectUrl);
  }

  // Role-based route protection
  if (user && pathname.startsWith("/dashboard")) {
    const role = await getProfileRole(supabase, user.id);
    if (role !== "super_admin") {
      const dest = request.nextUrl.clone();
      dest.pathname = "/unauthorized";
      return NextResponse.redirect(dest);
    }
  }

  if (user && pathname.startsWith("/merchant")) {
    const role = await getProfileRole(supabase, user.id);
    if (role !== "merchant") {
      const dest = request.nextUrl.clone();
      dest.pathname = "/unauthorized";
      return NextResponse.redirect(dest);
    }
  }

  return supabaseResponse;
}
