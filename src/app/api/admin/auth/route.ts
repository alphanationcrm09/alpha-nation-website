import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { readJsonObject } from "@/lib/public-submission";

export const dynamic = "force-dynamic";

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Invalid login request." }, { status: 400 });
  }
  const body = await readJsonObject(request, 4096);
  if (!body) return NextResponse.json({ error: "Invalid login request." }, { status: 400 });

  const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password || password.length > 1024) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });

  // Collect Supabase auth cookies and attach them to the exact login response.
  // This avoids relying on implicit cookies() response propagation in the Worker runtime.
  const pendingCookies: Array<{ name: string; value: string; options?: any }> = [];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Admin login is temporarily unavailable." }, { status: 503 });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) { pendingCookies.push(...cookiesToSet); },
    },
  });

  function json(body: Record<string, unknown>, status = 200) {
    const response = NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
    for (const cookie of pendingCookies) {
      response.cookies.set(cookie.name, cookie.value, {
        ...cookie.options,
        path: "/",
        sameSite: "lax",
        secure: true,
        httpOnly: true,
      });
    }
    return response;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return json({ error: "Login failed. Check your email and password." }, 401);

    const { data: role, error: roleError } = await supabase
      .from("staff_roles")
      .select("role,active")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (roleError || !role || role.active !== true) {
      await supabase.auth.signOut();
      return json({ error: "This account has not been approved for website admin access." }, 403);
    }

    return json({ ok: true, email: data.user.email, role: role.role });
  } catch {
    return json({ error: "Admin login is temporarily unavailable." }, 503);
  }
}

export async function GET() {
  try {
    const supabase = await (await import("@/lib/supabase/server")).createSupabaseServerClient();
    const { data, error } = await supabase.auth.getClaims();
    const claims = data?.claims;
    if (error || !claims?.sub) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    const { data: role } = await supabase.from("staff_roles").select("role,active").eq("user_id", claims.sub).maybeSingle();
    if (!role || role.active !== true) return NextResponse.json({ error: "Admin access is inactive." }, { status: 403 });
    const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance?.currentLevel !== "aal2") return NextResponse.json({ error: "Multi-factor verification required." }, { status: 403 });
    return NextResponse.json({ email: claims.email || "", role: role.role }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Admin session is unavailable." }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  try {
    const supabase = await (await import("@/lib/supabase/server")).createSupabaseServerClient();
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Sign out failed." }, { status: 503 });
  }
}
