import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const stateCodes = new Set("AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" "));
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const appointmentStatuses = new Set("new contacted scheduled confirmed completed reschedule_requested cancellation_requested cancelled no_show".split(" "));
const inquiryStatuses = new Set("new in_progress responded closed".split(" "));
const carrierStatuses = new Set(["active", "inactive", "pending_verification"]);
const licenseStatuses = new Set(["unverified", "pending", "verified", "expired", "rejected"]);

async function authorize() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data;
  if (error || !claims?.sub) return null;
  const { data: role, error: roleError } = await supabase.from("staff_roles").select("role,active").eq("user_id", claims.sub).maybeSingle();
  if (roleError || !role || role.active !== true) return null;
  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.currentLevel !== "aal2") return null;
  return { supabase, claims, role };
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authorize();
    if (!auth) return fail("Admin access required.", 401);
    const resource = request.nextUrl.searchParams.get("resource");
    const db = auth.supabase;
    if (resource === "dashboard") {
      const [a, i, g, c] = await Promise.all([
        db.from("appointments").select("id", { count: "exact", head: true }),
        db.from("inquiries").select("id", { count: "exact", head: true }),
        db.from("agents").select("id", { count: "exact", head: true }),
        db.from("carriers").select("id", { count: "exact", head: true }),
      ]);
      if (a.error || i.error || g.error || c.error) return fail("Could not load admin summary.", 500);
      return NextResponse.json({ email: auth.claims.email || "", role: auth.role.role, counts: { appointments: a.count || 0, inquiries: i.count || 0, agents: g.count || 0, carriers: c.count || 0 } }, { headers: { "Cache-Control": "no-store" } });
    }
    if (resource === "appointments" || resource === "inquiries") {
      const { data, error } = await db.from(resource).select("*").order("created_at", { ascending: false }).limit(500);
      if (error) return fail("Could not load records.", 500);
      return NextResponse.json({ rows: data || [] }, { headers: { "Cache-Control": "no-store" } });
    }
    if (resource === "carriers") {
      const { data, error } = await db.from("carriers").select("id,name,display_name,status,website_url").order("name");
      if (error) return fail("Could not load carriers.", 500);
      return NextResponse.json({ rows: data || [] }, { headers: { "Cache-Control": "no-store" } });
    }
    if (resource === "agents") {
      const { data, error } = await db.from("agents").select("*").order("full_name");
      if (error) return fail("Could not load agents.", 500);
      return NextResponse.json({ rows: data || [] }, { headers: { "Cache-Control": "no-store" } });
    }
    if (resource === "licenses") {
      const { data, error } = await db.from("agent_licenses").select("*,agents(full_name)").order("state_code");
      if (error) return fail("Could not load license records.", 500);
      return NextResponse.json({ rows: data || [] }, { headers: { "Cache-Control": "no-store" } });
    }
    return fail("Unknown admin resource.", 404);
  } catch {
    return fail("Admin service is temporarily unavailable.", 503);
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return fail("Request origin rejected.", 403);
  try {
    const auth = await authorize();
    if (!auth) return fail("Admin access required.", 401);
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail("Invalid request.");
    const db = auth.supabase;

    if (body.action === "carrier.create") {
      const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
      const website = typeof body.website === "string" ? body.website.trim().slice(0, 300) : "";
      if (name.length < 2) return fail("Enter a valid carrier name.");
      if (website) { try { if (new URL(website).protocol !== "https:") return fail("Carrier websites must use HTTPS."); } catch { return fail("Enter a valid carrier website URL."); } }
      const { error } = await db.from("carriers").insert({ name, display_name: name, website_url: website || null, status: "pending_verification" });
      if (error) return fail("Carrier could not be added.", 400);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }

    if (body.action === "agent.create") {
      const full_name = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 120) : "";
      const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
      const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 32) : "";
      const rawTerritory = Array.isArray(body.states) ? body.states.filter((value: unknown): value is string => typeof value === "string").map((value: string) => value.toUpperCase()) : [];
      const territory = Array.from(new Set<string>(rawTerritory));
      const workDays = body.saturday === true ? ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] : ["Monday","Tuesday","Wednesday","Thursday","Friday"];
      if (full_name.length < 2 || !territory.length || rawTerritory.some((value: string) => !stateCodes.has(value))) return fail("Enter an agent name and only valid two-letter state codes.");
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Enter a valid agent email address.");
      if (phone && !/^[0-9+() .-]{7,32}$/.test(phone)) return fail("Enter a valid agent phone number.");
      const { error } = await db.from("agents").insert({ full_name, email: email || null, phone: phone || null, states: territory, work_days: workDays, start_time: "08:00", end_time: "20:00", status: "pending_verification" });
      if (error) return fail("Agent record could not be added.", 400);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }

    if (body.action === "agents.seed") {
      const known = [
        { name:"David Wright", states:"AL, AZ, AR, CO, FL, GA, IL, IN, IA, KS, KY, LA, MD, MI, MS, MO, NE, NC, OH, OK, OR, PA, SC, TN, UT, VA, WA, WV, WI", saturday:false },
        { name:"Stevey Mitchell", states:"AR, AL, CT, CA, DE, DC, FL, GA, IA, MD, MA, MO, NJ, NC, OH, PA, SC, TX, VA, NM, UT, TN", saturday:false },
        { name:"Michael Mac Quoid", states:"AL, AR, AZ, CA, CO, FL, GA, ID, KY, MD, MI, MO, MS, ND, NE, NM, NC, NV, OH, OK, PA, SC, TN, TX, UT, WA, WI, WV, VA", saturday:false },
        { name:"Allan Kostabi", states:"AL, AR, AZ, CA, CO, FL, GA, ID, KY, MD, MI, MO, MS, ND, NE, NM, NC, NV, OH, OK, PA, SC, TN, TX, UT, WA, WI, WV, VA", saturday:false },
        { name:"Jonathan Zaky", states:"CA, DC, ID, MD, SC, FL, KY, MA, MO, NH, NC, OR, GA, MI, OH, TX, NE, IN", saturday:true },
      ];
      const { data: existing, error } = await db.from("agents").select("full_name");
      if (error) return fail("Could not check existing agent profiles.", 500);
      const names = new Set((existing || []).map((row: { full_name: string }) => row.full_name));
      const missing = known.filter((agent) => !names.has(agent.name)).map((agent) => ({
        full_name: agent.name, states: agent.states.split(",").map((value: string) => value.trim()),
        work_days: agent.saturday ? ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] : ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        start_time: "08:00", end_time: "20:00", status: "pending_verification",
      }));
      if (missing.length) {
        const { error: insertError } = await db.from("agents").insert(missing);
        if (insertError) return fail("Could not add supplied agent profiles.", 400);
      }
      return NextResponse.json({ ok: true, added: missing.length }, { headers: { "Cache-Control": "no-store" } });
    }

    if (body.action === "license.create") {
      const agentId = typeof body.agentId === "string" ? body.agentId : "";
      const stateCode = typeof body.stateCode === "string" ? body.stateCode.toUpperCase() : "";
      const npn = typeof body.npn === "string" ? body.npn.trim().slice(0, 40) : "";
      const licenseNumber = typeof body.licenseNumber === "string" ? body.licenseNumber.trim().slice(0, 80) : "";
      const expiresAt = typeof body.expiresAt === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.expiresAt) ? body.expiresAt : null;
      if (!uuid.test(agentId) || !stateCodes.has(stateCode)) return fail("Select an agent and a valid state.");
      const { error } = await db.from("agent_licenses").insert({ agent_id: agentId, state_code: stateCode, npn: npn || null, license_number: licenseNumber || null, expires_at: expiresAt, verification_status: "unverified" });
      if (error) return fail("License record could not be saved. Check for an existing record.", 400);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }
    return fail("Unknown admin action.", 404);
  } catch {
    return fail("Admin service is temporarily unavailable.", 503);
  }
}

export async function PATCH(request: NextRequest) {
  if (!sameOrigin(request)) return fail("Request origin rejected.", 403);
  try {
    const auth = await authorize();
    if (!auth) return fail("Admin access required.", 401);
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail("Invalid request.");
    const db = auth.supabase;
    const id = typeof body.id === "string" ? body.id : "";
    if (!uuid.test(id)) return fail("Invalid record ID.");

    if (body.action === "record.status") {
      const kind = body.kind === "appointments" ? "appointments" : body.kind === "inquiries" ? "inquiries" : null;
      const status = typeof body.status === "string" ? body.status : "";
      if (!kind || !(kind === "appointments" ? appointmentStatuses : inquiryStatuses).has(status)) return fail("Invalid record status.");
      const { error } = await db.from(kind).update({ status, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) return fail("Record status could not be updated.", 400);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }

    if (body.action === "carrier.update") {
      const status = typeof body.status === "string" ? body.status : "";
      if (!carrierStatuses.has(status)) return fail("Invalid carrier status.");
      const { error } = await db.from("carriers").update({ status }).eq("id", id);
      if (error) return fail("Carrier could not be updated.", 400);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }

    if (body.action === "agent.update") {
      const status = typeof body.status === "string" ? body.status : "";
      if (!carrierStatuses.has(status)) return fail("Invalid agent status.");
      if (status === "active") {
        const { data: agent, error: agentError } = await db.from("agents").select("states").eq("id", id).maybeSingle();
        if (agentError || !agent) return fail("Agent record not found.", 404);
        const today = new Date().toISOString().slice(0, 10);
        const { data: verified, error: licenseError } = await db.from("agent_licenses").select("state_code,expires_at").eq("agent_id", id).eq("verification_status", "verified").gte("expires_at", today);
        if (licenseError) return fail("Could not verify agent license records.", 500);
        const licensed = new Set((verified || []).map((row) => row.state_code));
        const missing = (agent.states || []).filter((state: string) => !licensed.has(state));
        if (!agent.states?.length || missing.length) return fail(`Cannot activate this agent. Verified license records are missing for: ${missing.join(", ") || "all assigned states"}.`);
      }
      const { error } = await db.from("agents").update({ status }).eq("id", id);
      if (error) return fail("Agent could not be updated.", 400);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }

    if (body.action === "license.update") {
      const status = typeof body.status === "string" ? body.status : "";
      if (!licenseStatuses.has(status)) return fail("Invalid license verification status.");
      if (status === "verified") {
        const { data: license, error } = await db.from("agent_licenses").select("npn,license_number,expires_at").eq("id", id).maybeSingle();
        if (error || !license) return fail("License record not found.", 404);
        if (!license.npn || !license.license_number || !license.expires_at) return fail("Enter the NPN, license number and expiry date before marking this record verified.");
        if (license.expires_at < new Date().toISOString().slice(0, 10)) return fail("This license has expired and cannot be marked verified.");
      }
      const { error } = await db.from("agent_licenses").update({ verification_status: status, verified_at: status === "verified" ? new Date().toISOString() : null }).eq("id", id);
      if (error) return fail("License verification status could not be updated.", 400);
      return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    }
    return fail("Unknown admin action.", 404);
  } catch {
    return fail("Admin service is temporarily unavailable.", 503);
  }
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return fail("Request origin rejected.", 403);
  try {
    const auth = await authorize();
    if (!auth) return fail("Admin access required.", 401);
    const id = request.nextUrl.searchParams.get("id") || "";
    const kind = request.nextUrl.searchParams.get("kind");
    if (!uuid.test(id)) return fail("Invalid record ID.");
    if (kind !== "carrier" && kind !== "agent") return fail("Unknown record type.");
    const { error } = kind === "carrier"
      ? await auth.supabase.from("carriers").delete().eq("id", id)
      : await auth.supabase.from("agents").delete().eq("id", id);
    if (error) return fail("Record could not be removed.", 400);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return fail("Admin service is temporarily unavailable.", 503);
  }
}
