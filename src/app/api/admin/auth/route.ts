import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 4096) return NextResponse.json({ error: "Invalid login request." }, { status: 413 });
  let body: { email?: unknown; password?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid login request." }, { status: 400 }); }
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password || password.length > 1024) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return NextResponse.json({ error: "Login failed. Check your email and password." }, { status: 401 });
    const { data: role, error: roleError } = await supabase.from("staff_roles").select("role,active").eq("user_id", data.user.id).maybeSingle();
    if (roleError || !role || role.active !== true) {
      await supabase.auth.signOut();
      return NextResponse.json({ error: "This account has not been approved for website admin access." }, { status: 403 });
    }
    return NextResponse.json({ ok: true, email: data.user.email, role: role.role }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Admin login is temporarily unavailable." }, { status: 503 });
  }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getClaims();
    const claims = data;
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
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Sign out failed." }, { status: 503 });
  }
}
