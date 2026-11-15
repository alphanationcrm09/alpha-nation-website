import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

async function authorizedStaff() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) return null;
  const { data: role } = await supabase.from("staff_roles").select("active").eq("user_id", claims.sub).maybeSingle();
  if (role?.active !== true) return null;
  return supabase;
}

export async function GET() {
  try {
    const supabase = await authorizedStaff();
    if (!supabase) return NextResponse.json({ error: "Active staff access required." }, { status: 401 });
    const [{ data: factors }, { data: assurance }] = await Promise.all([
      supabase.auth.mfa.listFactors(),
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    ]);
    return NextResponse.json({
      factors: (factors?.totp || []).map((factor) => ({ id: factor.id, friendlyName: factor.friendly_name, status: factor.status })),
      currentLevel: assurance?.currentLevel || "aal1",
      nextLevel: assurance?.nextLevel || "aal1",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Security settings are unavailable." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  try {
    const supabase = await authorizedStaff();
    if (!supabase) return NextResponse.json({ error: "Active staff access required." }, { status: 401 });
    const body = await request.json();
    if (body?.action === "enroll") {
      const [{ data: existingFactors }, { data: assurance }] = await Promise.all([
        supabase.auth.mfa.listFactors(),
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
      ]);
      const alreadySecured = (existingFactors?.totp || []).some((factor) => factor.status === "verified");
      if (alreadySecured && assurance?.currentLevel !== "aal2") {
        return NextResponse.json({ error: "Verify your existing authenticator before adding another device." }, { status: 403 });
      }
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Alpha Nation Admin" });
      if (error || !data?.id || !data.totp) return NextResponse.json({ error: "Could not start authenticator setup." }, { status: 400 });
      return NextResponse.json({ factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret, uri: data.totp.uri }, { headers: { "Cache-Control": "no-store" } });
    }
    if (body?.action === "remove-unverified") {
      const factorId = typeof body.factorId === "string" ? body.factorId : "";
      if (!/^[0-9a-f-]{36}$/i.test(factorId)) return NextResponse.json({ error: "Invalid authenticator factor." }, { status: 400 });
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const factor = (factors?.all || []).find((item) => item.id === factorId);
      if (!factor || factor.status !== "unverified") return NextResponse.json({ error: "Only an unfinished authenticator setup can be removed here." }, { status: 400 });
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) return NextResponse.json({ error: "Could not remove the unfinished setup." }, { status: 400 });
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }
    if (body?.action === "verify") {
      const factorId = typeof body.factorId === "string" ? body.factorId : "";
      const code = typeof body.code === "string" ? body.code.replace(/\s/g, "") : "";
      if (!/^[0-9a-f-]{36}$/i.test(factorId) || !/^\d{6,8}$/.test(code)) return NextResponse.json({ error: "Enter the current authenticator code." }, { status: 400 });
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
      if (error) return NextResponse.json({ error: "The authenticator code was not accepted. Try the current code again." }, { status: 400 });
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json({ error: "Unknown security action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Security setup is temporarily unavailable." }, { status: 503 });
  }
}
