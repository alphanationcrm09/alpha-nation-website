import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const loginPath = "/admin/login";

  if (!url || !key) {
    if (request.nextUrl.pathname === loginPath) return NextResponse.next();
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, {
            ...options,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
          });
        });
      },
    },
  });

  const { data: { claims }, error } = await supabase.auth.getClaims();
  const isLogin = request.nextUrl.pathname === loginPath;
  const isSecurity = request.nextUrl.pathname === "/admin/security";

  if (error || !claims?.sub) {
    if (isLogin) return response;
    const destination = NextResponse.redirect(new URL(loginPath, request.url));
    response.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
    return destination;
  }

  const { data: staffRole, error: roleError } = await supabase
    .from("staff_roles")
    .select("active")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (roleError || staffRole?.active !== true) {
    await supabase.auth.signOut();
    if (isLogin) return response;
    const destination = NextResponse.redirect(new URL(loginPath, request.url));
    response.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
    return destination;
  }

  if (isLogin) {
    const destination = NextResponse.redirect(new URL("/admin", request.url));
    response.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
    return destination;
  }

  if (!isSecurity) {
    let mfaVerified = false;
    try {
      const [{ data: assurance }, { data: factors }] = await Promise.all([
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
        supabase.auth.mfa.listFactors(),
      ]);
      const hasVerifiedTotp = (factors?.totp || []).some((factor) => factor.status === "verified");
      mfaVerified = hasVerifiedTotp && assurance?.currentLevel === "aal2";
    } catch {
      mfaVerified = false;
    }
    if (!mfaVerified) {
      const destination = NextResponse.redirect(new URL("/admin/security", request.url));
      response.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
      return destination;
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
