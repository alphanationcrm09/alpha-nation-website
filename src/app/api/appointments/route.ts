import { NextRequest, NextResponse } from "next/server";
import {
  cleanText, consumeRateLimit, getPrivilegedSubmissionClient, isPublicSubmissionConfigured,
  validEmail, validPhone, verifyTurnstileDetailed, sendOwnerNotification, isActiveServiceState, createSubmissionFingerprint,
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
  const verification = await verifyTurnstileDetailed(request, body.turnstileToken, "appointment");
  if (!verification.ok) {
    console.error("Appointment Turnstile verification failed", { code: verification.code });
    return NextResponse.json(
      { error: "Security verification failed. Please retry the challenge.", diagnosticCode: verification.code },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const legal_first_name = cleanText(body.legalFirstName, 60);
  const legal_last_name = cleanText(body.legalLastName, 60);
  const full_name = `${legal_first_name} ${legal_last_name}`.trim();
  const residential_address = cleanText(body.residentialAddress, 240);
  const beneficiary_name = cleanText(body.beneficiaryName, 120);
  const beneficiary_relationship = cleanText(body.beneficiaryRelationship, 60);
  const phone = cleanText(body.phone, 32);
  const email = cleanText(body.email, 254) || null;
  const state_code = cleanText(body.stateCode, 2).toUpperCase();
  const zip_code = cleanText(body.zipCode, 10);
  const city = cleanText(body.city, 100);
  const insurance_type = cleanText(body.insuranceType, 80);
  const preferred_date = cleanText(body.preferredDate, 10);
  const preferred_time = cleanText(body.preferredTime, 20);
  const source = cleanText(body.source, 40) || "Website";
  const customer_timezone = cleanText(body.timeZone, 80);

  const validProducts = new Set(["Final Expense","Term Life Insurance","Whole Life Insurance","Mortgage Protection","Auto Insurance","Health Insurance","Medicare","ACA Health Insurance","Home Insurance","Credit Repair","Debt Relief"]);
  const productsRequiringCoverage = new Set(["Final Expense","Term Life Insurance","Whole Life Insurance","Mortgage Protection"]);
  const requiresCoverage = productsRequiringCoverage.has(insurance_type);
  const coverage_amount = requiresCoverage ? Number(body.coverageAmount) : null;
  const validCoverage = !requiresCoverage || (Number.isInteger(coverage_amount) && coverage_amount !== null && coverage_amount >= 2000 && coverage_amount <= 50000);
  const stateIsActive = await isActiveServiceState(client, state_code);
  if (legal_first_name.length < 1 || legal_last_name.length < 1 || full_name.length < 3
    || residential_address.length < 5 || beneficiary_name.length < 2 || beneficiary_relationship.length < 2
    || !validCoverage
    || !validPhone(phone) || (email && !validEmail(email))
    || !stateIsActive || !/^[0-9]{5}(-[0-9]{4})?$/.test(zip_code)
    || city.length < 2 || !validProducts.has(insurance_type)
    || !/^\d{4}-\d{2}-\d{2}$/.test(preferred_date)
    || !/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(preferred_time)
    || customer_timezone.length < 3) {
    return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
  }
  const selectedDate = new Date(`${preferred_date}T00:00:00Z`);
  let localToday = "";
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: customer_timezone, year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(new Date());
    const part = (type: string) => parts.find((item) => item.type === type)?.value || "";
    localToday = `${part("year")}-${part("month")}-${part("day")}`;
  } catch {
    return NextResponse.json({ error: "Please use a valid time zone setting." }, { status: 400 });
  }
  if (Number.isNaN(selectedDate.getTime()) || selectedDate.toISOString().slice(0, 10) !== preferred_date
    || preferred_date < localToday) {
    return NextResponse.json({ error: "Please select today or a future date." }, { status: 400 });
  }

  // Accept appointment requests from every supported US state. The team verifies
  // licensing, service eligibility, and agent availability before confirming.

  if (!await consumeRateLimit(request, "appointment", client)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

  const submission_fingerprint = createSubmissionFingerprint("appointment", {
    full_name, residential_address, beneficiary_name, beneficiary_relationship, coverage_amount: coverage_amount === null ? "" : String(coverage_amount),
    phone, email: email || "", state_code, zip_code, city, insurance_type, preferred_date, preferred_time, customer_timezone,
  });
  const { error } = await client.from("appointments").insert({
    full_name, legal_first_name, legal_last_name, residential_address, beneficiary_name,
    beneficiary_relationship, coverage_amount, phone, email, state_code, zip_code, city, insurance_type,
    preferred_date, preferred_time, customer_timezone, source, contact_consent: true,
    marketing_consent: false, application_consent: false, status: "new",
    submission_fingerprint,
  });
  if (error?.code === "23505" && submission_fingerprint) {
    return NextResponse.json({ ok: true, duplicate: true }, { headers: { "Cache-Control": "no-store" } });
  }
  if (error) {
    console.error("Appointment insert failed", { code: error.code });
    return NextResponse.json({ error: "We could not submit your request. Please try again.", diagnosticCode: error.code || "UNKNOWN" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
  await sendOwnerNotification("appointment", `New appointment request for ${insurance_type}, ${state_code}, preferred date ${preferred_date}.`);
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
