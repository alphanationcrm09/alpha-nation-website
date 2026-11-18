import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}
function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return fail("Request origin rejected.", 403);
  try {
    const body = await request.json();
    const supabase = await createSupabaseServerClient();
    if (body?.action === "password.update") {
      const password = typeof body.password === "string" ? body.password : "";
      if (password.length < 12 || password.length > 128) return fail("Use a password with at least 12 characters.");
      const { data } = await supabase.auth.getClaims();
      if (!data?.claims?.sub) return fail("Your invitation session has expired. Open the email invitation again.", 401);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return fail("Password could not be saved. Request a new invitation if the link has expired.", 400);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!email || !password || password.length > 128) return fail("Enter your email and password.");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return fail("Sign-in failed. Check your email and password.", 401);
    const { data: profile, error: profileError } = await supabase.from("customer_profiles").select("user_id").eq("user_id", data.user.id).maybeSingle();
    if (profileError || !profile) {
      await supabase.auth.signOut();
      return fail("This account is not registered as an Alpha Nation customer.", 403);
    }
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return fail("Customer sign-in is temporarily unavailable.", 503);
  }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;
    if (error || typeof userId !== "string") return fail("Sign in to view your customer account.", 401);
    const [{ data: profile, error: profileError }, { data: policies, error: policyError }] = await Promise.all([
      supabase.from("customer_profiles").select("full_name,phone").eq("user_id", userId).maybeSingle(),
      supabase.from("customer_policies").select("policy_number,carrier_name,product_name,coverage_amount,policy_status,effective_date,beneficiary_name,beneficiary_relationship").eq("customer_id", userId).order("created_at", { ascending: false }),
    ]);
    if (profileError || policyError || !profile) return fail("Customer account could not be loaded.", 403);
    return NextResponse.json({ email: data.claims.email || "", profile, policies: policies || [] }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return fail("Customer account is temporarily unavailable.", 503);
  }
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return fail("Request origin rejected.", 403);
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return fail("Sign out failed.", 503);
  }
}
