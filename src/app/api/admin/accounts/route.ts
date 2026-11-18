import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}
function fail(error: string, status = 400) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}
async function authorize(request: NextRequest, ownerOnly = false) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || typeof userId !== "string") return null;
  const { data: role } = await supabase.from("staff_roles").select("role,active").eq("user_id", userId).maybeSingle();
  if (!role || role.active !== true || (ownerOnly && role.role !== "owner")) return null;
  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.currentLevel !== "aal2") return null;
  return { supabase, userId, role };
}
function callbackUrl(request: NextRequest, destination: string) {
  const url = new URL("/auth/callback", request.url);
  url.searchParams.set("next", destination);
  return url.toString();
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authorize(request);
    if (!auth) return fail("Owner access and multi-factor verification are required.", 403);
    const kind = request.nextUrl.searchParams.get("kind");
    const admin = createSupabaseAdminClient();
    if (kind === "staff") {
      const [{ data: roles, error }, { data: users, error: usersError }] = await Promise.all([
        admin.from("staff_roles").select("user_id,role,active,created_at").order("created_at", { ascending: false }),
        admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      ]);
      if (error || usersError) return fail("Staff accounts could not be loaded.", 500);
      const byId = new Map((users?.users || []).map(user => [user.id, user]));
      return NextResponse.json({ rows: (roles || []).map(row => ({ ...row, email: byId.get(row.user_id)?.email || "Unknown email" })) }, { headers: { "Cache-Control": "no-store" } });
    }
    if (kind === "customers") {
      const [{ data: profiles, error }, { data: policies, error: policyError }] = await Promise.all([
        auth.supabase.from("customer_profiles").select("user_id,full_name,phone,created_at").order("created_at", { ascending: false }).limit(500),
        auth.supabase.from("customer_policies").select("id,customer_id,policy_number,carrier_name,product_name,coverage_amount,policy_status,effective_date,beneficiary_name,beneficiary_relationship").order("created_at", { ascending: false }).limit(1000),
      ]);
      if (error || policyError) return fail("Customer accounts could not be loaded.", 500);
      const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const byId = new Map((users?.users || []).map(user => [user.id, user.email || ""]));
      return NextResponse.json({ rows: (profiles || []).map(profile => ({ ...profile, email: byId.get(profile.user_id) || "", policies: (policies || []).filter(policy => policy.customer_id === profile.user_id) })) }, { headers: { "Cache-Control": "no-store" } });
    }
    return fail("Unknown account type.", 404);
  } catch {
    return fail("Account service is unavailable. Check the Supabase server secret configuration.", 503);
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return fail("Request origin rejected.", 403);
  try {
    const auth = await authorize(request, true);
    if (!auth) return fail("Only the Owner can create accounts.", 403);
    const body = await request.json();
    const action = typeof body?.action === "string" ? body.action : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
    const fullName = typeof body?.fullName === "string" ? body.fullName.trim().slice(0, 120) : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || fullName.length < 2) return fail("Enter a valid name and email address.");
    const admin = createSupabaseAdminClient();

    if (action === "staff.invite") {
      const role = body.role === "admin" ? "admin" : body.role === "staff" ? "staff" : "";
      if (!role) return fail("Choose Staff or Admin. Owner access cannot be assigned here.");
      const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: callbackUrl(request, "/set-password?next=%2Fadmin%2Fsecurity"),
        data: { full_name: fullName, account_type: "staff" },
      });
      if (error || !data.user) return fail(error?.message || "Staff invitation could not be sent.", 400);
      const { error: roleError } = await admin.from("staff_roles").upsert({ user_id: data.user.id, role, active: true }, { onConflict: "user_id" });
      if (roleError) {
        await admin.auth.admin.deleteUser(data.user.id);
        return fail("Invitation was rolled back because the staff role could not be saved.", 500);
      }
      return NextResponse.json({ ok: true, message: "Staff invitation sent." }, { headers: { "Cache-Control": "no-store" } });
    }

    if (action === "customer.invite") {
      const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 32) : "";
      if (phone && !/^[0-9+() .-]{7,32}$/.test(phone)) return fail("Enter a valid phone number.");
      const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: callbackUrl(request, "/set-password?next=%2Fcustomer"),
        data: { full_name: fullName, account_type: "customer" },
      });
      if (error || !data.user) return fail(error?.message || "Customer invitation could not be sent.", 400);
      const { error: profileError } = await admin.from("customer_profiles").insert({ user_id: data.user.id, full_name: fullName, phone: phone || null });
      if (profileError) {
        await admin.auth.admin.deleteUser(data.user.id);
        return fail("Invitation was rolled back because the customer profile could not be saved.", 500);
      }
      return NextResponse.json({ ok: true, message: "Customer invitation sent." }, { headers: { "Cache-Control": "no-store" } });
    }

    if (action === "policy.create") {
      const customerId = typeof body.customerId === "string" ? body.customerId : "";
      const policyNumber = typeof body.policyNumber === "string" ? body.policyNumber.trim().slice(0, 80) : "";
      const carrier = typeof body.carrier === "string" ? body.carrier.trim().slice(0, 120) : "";
      const product = typeof body.product === "string" ? body.product.trim().slice(0, 120) : "";
      const coverage = body.coverage === "" || body.coverage == null ? null : Number(body.coverage);
      const status = ["active","pending","lapsed","cancelled","paid_up"].includes(body.status) ? body.status : "active";
      const effectiveDate = typeof body.effectiveDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.effectiveDate) ? body.effectiveDate : null;
      if (!/^[0-9a-f-]{36}$/i.test(customerId) || policyNumber.length < 2 || carrier.length < 2 || product.length < 2 || (coverage !== null && (!Number.isFinite(coverage) || coverage < 0))) return fail("Complete the policy number, customer, carrier and product. Coverage must be zero or greater.");
      const { error } = await auth.supabase.from("customer_policies").insert({
        customer_id: customerId, policy_number: policyNumber, carrier_name: carrier, product_name: product,
        coverage_amount: coverage, policy_status: status, effective_date: effectiveDate,
        beneficiary_name: typeof body.beneficiaryName === "string" ? body.beneficiaryName.trim().slice(0,120) || null : null,
        beneficiary_relationship: typeof body.beneficiaryRelationship === "string" ? body.beneficiaryRelationship.trim().slice(0,80) || null : null,
      });
      if (error) return fail("Policy could not be saved. Check the policy number and customer.", 400);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }
    return fail("Unknown account action.", 404);
  } catch {
    return fail("Account service is unavailable. Check the Supabase server secret configuration.", 503);
  }
}

export async function PATCH(request: NextRequest) {
  if (!sameOrigin(request)) return fail("Request origin rejected.", 403);
  try {
    const auth = await authorize(request, true);
    if (!auth) return fail("Only the Owner can change staff access.", 403);
    const body = await request.json();
    const userId = typeof body?.userId === "string" ? body.userId : "";
    if (!/^[0-9a-f-]{36}$/i.test(userId) || userId === auth.userId) return fail("Invalid account selection.");
    const admin = createSupabaseAdminClient();
    const { data: existing } = await admin.from("staff_roles").select("role").eq("user_id", userId).maybeSingle();
    if (!existing || existing.role === "owner") return fail("The Owner account cannot be changed here.", 403);
    if (body.action === "staff.status") {
      if (typeof body.active !== "boolean") return fail("Invalid account status.");
      const { error } = await admin.from("staff_roles").update({ active: body.active }).eq("user_id", userId);
      if (error) return fail("Staff access could not be updated.", 500);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }
    if (body.action === "staff.role") {
      if (body.role !== "staff" && body.role !== "admin") return fail("Choose Staff or Admin.");
      const { error } = await admin.from("staff_roles").update({ role: body.role }).eq("user_id", userId);
      if (error) return fail("Staff role could not be updated.", 500);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }
    return fail("Unknown account action.", 404);
  } catch {
    return fail("Account service is unavailable.", 503);
  }
}
