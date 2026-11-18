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
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const isLogin = request.nextUrl.pathname === loginPath;
  const isSecurity = request.nextUrl.pathname === "/admin/security";

  function redirect(path: string) {
    const destination = NextResponse.redirect(new URL(path, request.url));
    for (const cookie of response.cookies.getAll()) {
      destination.cookies.set(cookie);
    }
    for (const header of ["cache-control", "expires", "pragma"]) {
      const value = response.headers.get(header);
      if (value) destination.headers.set(header, value);
    }
    return destination;
  }

  if (error || !claims?.sub) {
    if (isLogin) return response;
    return redirect(loginPath);
  }

  const { data: staffRole, error: roleError } = await supabase
    .from("staff_roles")
    .select("active")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (roleError || staffRole?.active !== true) {
    await supabase.auth.signOut();
    if (isLogin) return response;
    return redirect(loginPath);
  }

  if (isLogin) return redirect("/admin");

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
    if (!mfaVerified) return redirect("/admin/security");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
