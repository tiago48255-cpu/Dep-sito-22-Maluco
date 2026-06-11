import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const redirectToLogin = () => {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  };

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) return redirectToLogin();
    // TODO: check admin role from DB
  }

  // Protect motoboy routes
  if (pathname.startsWith("/motoboy")) {
    if (!user) return redirectToLogin();
  }

  // Protect checkout, order history, profile and tracking
  if (
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/pedidos") ||
    pathname.startsWith("/perfil")
  ) {
    if (!user) return redirectToLogin();
  }

  return supabaseResponse;
}
