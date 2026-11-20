import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const headers = { "Cache-Control": "no-store" };

async function authorizeOwner() {
  const db = await createSupabaseServerClient();
  const { data, error } = await db.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) return null;
  const { data: role, error: roleError } = await db.from("staff_roles").select("role,active").eq("user_id", userId).maybeSingle();
  if (roleError || role?.role !== "owner" || role.active !== true) return null;
  const { data: assurance } = await db.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.currentLevel !== "aal2") return null;
  return db;
}

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers });
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  try { return !!origin && new URL(origin).origin === new URL(request.url).origin; }
  catch { return false; }
}

function validAmount(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 2000 && Number(value) <= 1000000;
}

function validLabel(value: unknown): value is string {
  return typeof value === "string" && value.trim().length >= 1 && value.trim().length <= 80;
}

export async function GET() {
  try {
    const db = await authorizeOwner();
    if (!db) return fail("Owner access with MFA is required.", 403);
    const { data, error } = await db.from("quote_coverage_options").select("id,amount,label,sort_order,active").order("sort_order").order("amount");
    if (error) return fail("Coverage options could not be loaded.", 500);
    return NextResponse.json({ rows: data ?? [] }, { headers });
  } catch {
    return fail("Coverage settings are temporarily unavailable.", 503);
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return fail("Request origin rejected.", 403);
  try {
    const db = await authorizeOwner();
    if (!db) return fail("Owner access with MFA is required.", 403);
    const body = await request.json();
    if (!validAmount(body?.amount)) return fail("Enter an amount from $2,000 to $1,000,000.");
    const label = validLabel(body?.label) ? body.label.trim() : "$" + body.amount.toLocaleString("en-US");
    const sortOrder = Number.isInteger(body?.sortOrder) ? body.sortOrder : 100;
    const { error } = await db.from("quote_coverage_options").insert({ amount: body.amount, label, sort_order: sortOrder, active: true });
    if (error) return fail(error.code === "23505" ? "This coverage amount already exists." : "Coverage amount could not be added.");
    return NextResponse.json({ ok: true }, { headers });
  } catch {
    return fail("Coverage settings are temporarily unavailable.", 503);
  }
}

export async function PATCH(request: NextRequest) {
  if (!sameOrigin(request)) return fail("Request origin rejected.", 403);
  try {
    const db = await authorizeOwner();
    if (!db) return fail("Owner access with MFA is required.", 403);
    const body = await request.json();
    if (!uuid.test(typeof body?.id === "string" ? body.id : "")) return fail("Invalid coverage option.");
    const updates: { amount?: number; label?: string; active?: boolean; sort_order?: number; updated_at: string } = { updated_at: new Date().toISOString() };
    if (body.amount !== undefined) {
      if (!validAmount(body.amount)) return fail("Enter an amount from $2,000 to $1,000,000.");
      updates.amount = body.amount;
    }
    if (body.label !== undefined) {
      if (!validLabel(body.label)) return fail("Enter a label of 1 to 80 characters.");
      updates.label = body.label.trim();
    }
    if (body.active !== undefined) {
      if (typeof body.active !== "boolean") return fail("Invalid active status.");
      updates.active = body.active;
    }
    if (body.sortOrder !== undefined) {
      if (!Number.isInteger(body.sortOrder) || body.sortOrder < 0 || body.sortOrder > 10000) return fail("Invalid display order.");
      updates.sort_order = body.sortOrder;
    }
    const { error } = await db.from("quote_coverage_options").update(updates).eq("id", body.id);
    if (error) return fail(error.code === "23505" ? "This coverage amount already exists." : "Coverage option could not be updated.");
    return NextResponse.json({ ok: true }, { headers });
  } catch {
    return fail("Coverage settings are temporarily unavailable.", 503);
  }
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return fail("Request origin rejected.", 403);
  try {
    const db = await authorizeOwner();
    if (!db) return fail("Owner access with MFA is required.", 403);
    const id = request.nextUrl.searchParams.get("id") || "";
    if (!uuid.test(id)) return fail("Invalid coverage option.");
    const { error } = await db.from("quote_coverage_options").delete().eq("id", id);
    if (error) return fail("Coverage option could not be deleted.");
    return NextResponse.json({ ok: true }, { headers });
  } catch {
    return fail("Coverage settings are temporarily unavailable.", 503);
  }
}
