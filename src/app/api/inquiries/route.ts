import { NextRequest, NextResponse } from "next/server";
import {
  cleanText, consumeRateLimit, getPrivilegedSubmissionClient, isPublicSubmissionConfigured,
  validEmail, validPhone, verifyTurnstile,
} from "@/lib/public-submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")
    || Number(request.headers.get("content-length") || 0) > 12000) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (!isPublicSubmissionConfigured()) return NextResponse.json({ error: "Online requests are temporarily unavailable." }, { status: 503 });
  const client = getPrivilegedSubmissionClient();
  if (!client) return NextResponse.json({ error: "Online requests are temporarily unavailable." }, { status: 503 });

  if (cleanText(body.website, 200)) return NextResponse.json({ error: "Request rejected." }, { status: 400 });
  if (body.contactConsent !== true) return NextResponse.json({ error: "Contact consent is required." }, { status: 400 });
  if (!await verifyTurnstile(request, body.turnstileToken, "inquiry")) return NextResponse.json({ error: "Security verification failed. Please retry the challenge." }, { status: 403 });

  const full_name = cleanText(body.fullName, 120);
  const phone = cleanText(body.phone, 32);
  const email = cleanText(body.email, 254) || null;
  const state_code = cleanText(body.stateCode, 2).toUpperCase() || null;
  const zip_code = cleanText(body.zipCode, 10) || null;
  const inquiry_type = cleanText(body.inquiryType, 80);
  const message = cleanText(body.message, 3000) || null;

  const validStates = new Set(["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]);
  const validTypes = new Set(["Final Expense","Life Insurance","Medicare","ACA Health Insurance","Auto Insurance","Home Insurance","Credit Repair","Debt Relief","General question"]);
  if (full_name.length < 2 || !validPhone(phone) || (email && !validEmail(email))
    || (state_code && !validStates.has(state_code))
    || (zip_code && !/^[0-9]{5}(-[0-9]{4})?$/.test(zip_code))
    || !validTypes.has(inquiry_type)) {
    return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
  }

  if (!await consumeRateLimit(request, "inquiry", client)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

  const { error } = await client.from("inquiries").insert({
    full_name, phone, email, state_code, zip_code, inquiry_type, message,
    source: "Website", contact_consent: true, status: "new",
  });
  if (error) return NextResponse.json({ error: "We could not send your message. Please try again." }, { status: 500 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
