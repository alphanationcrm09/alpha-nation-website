import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}
function callbackUrl(request: NextRequest, destination: string) {
  const origin = request.nextUrl.origin;
  const url = new URL("/auth/callback", origin);
  url.searchParams.set("next", destination);
  return url.toString();
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
    if (body?.action === "password.request") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Enter a valid email address.");
      const resetUrl = new URL("/set-password", request.nextUrl.origin);
      resetUrl.searchParams.set("next", "/customer");
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl.toString(),
      });
      if (error) return fail("The reset email could not be requested. Please try again later.", 400);
      return NextResponse.json({ ok: true, message: "If an account exists for this email, a password-reset link has been sent. Check your inbox and spam folder." }, { headers: { "Cache-Control": "no-store" } });
    }
    if (body?.action === "password.session") {
      const accessToken = typeof body.access_token === "string" ? body.access_token : "";
      const refreshToken = typeof body.refresh_token === "string" ? body.refresh_token : "";
      if (!accessToken || !refreshToken) return fail("The password-reset link is missing its secure session. Request a new link.", 401);
      const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (error || !data.user) return fail("The password-reset link is invalid or expired. Request a new link.", 401);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }
    if (body?.action === "password.update") {
      const password = typeof body.password === "string" ? body.password : "";
      if (password.length < 12 || password.length > 128) return fail("Use a password with at least 12 characters.");
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;
      if (userError || !user) return fail("Your password setup session has expired. Request a new reset link or invitation.", 401);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return fail("Password could not be saved. Request a new secure link if the previous link has expired.", 400);
      if (user.app_metadata?.must_change_password === true) {
        const admin = createSupabaseAdminClient();
        const { error: metadataError } = await admin.auth.admin.updateUserById(user.id, {
          app_metadata: { ...user.app_metadata, must_change_password: false },
        });
        if (metadataError) return fail("Your password was updated, but account activation is incomplete. Contact Alpha Nation support.", 500);
      }
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
    return NextResponse.json({ ok: true, mustChangePassword: data.user.app_metadata?.must_change_password === true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return fail("Customer sign-in is temporarily unavailable.", 503);
  }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (userError || !user) return fail("Sign in to view your customer account.", 401);
    if (user.app_metadata?.must_change_password === true) return fail("Change your temporary password before opening the customer portal.", 428);
    const userId = user.id;
    const [{ data: profile, error: profileError }, { data: policies, error: policyError }] = await Promise.all([
      supabase.from("customer_profiles").select("full_name,phone").eq("user_id", userId).maybeSingle(),
      supabase.from("customer_policies").select("policy_number,carrier_name,product_name,insurance_category,coverage_amount,policy_status,effective_date,beneficiary_name,beneficiary_relationship").eq("customer_id", userId).order("created_at", { ascending: false }),
    ]);
    if (profileError || policyError || !profile) return fail("Customer account could not be loaded.", 403);
    return NextResponse.json({ email: user.email || "", profile, policies: policies || [] }, { headers: { "Cache-Control": "no-store" } });
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
