"use client";

import { useState } from "react";
import Script from "next/script";

const states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
const stateCodes: Record<string, string> = { Alabama:"AL", Alaska:"AK", Arizona:"AZ", Arkansas:"AR", California:"CA", Colorado:"CO", Connecticut:"CT", Delaware:"DE", "District of Columbia":"DC", Florida:"FL", Georgia:"GA", Hawaii:"HI", Idaho:"ID", Illinois:"IL", Indiana:"IN", Iowa:"IA", Kansas:"KS", Kentucky:"KY", Louisiana:"LA", Maine:"ME", Maryland:"MD", Massachusetts:"MA", Michigan:"MI", Minnesota:"MN", Mississippi:"MS", Missouri:"MO", Montana:"MT", Nebraska:"NE", Nevada:"NV", "New Hampshire":"NH", "New Jersey":"NJ", "New Mexico":"NM", "New York":"NY", "North Carolina":"NC", "North Dakota":"ND", Ohio:"OH", Oklahoma:"OK", Oregon:"OR", Pennsylvania:"PA", "Rhode Island":"RI", "South Carolina":"SC", "South Dakota":"SD", Tennessee:"TN", Texas:"TX", Utah:"UT", Vermont:"VT", Virginia:"VA", Washington:"WA", "West Virginia":"WV", Wisconsin:"WI", Wyoming:"WY" };
const products = ["Final Expense","Term Life Insurance","Whole Life Insurance","Mortgage Protection","Auto Insurance","Health Insurance","Medicare","ACA Health Insurance","Home Insurance","Credit Repair","Debt Relief"];
const localDateValue = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
};

export function BookingForm() {
  const [state, setState] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [source, setSource] = useState("Other");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    if (!fields.get("consent")) return setMessage("Please provide appointment contact consent.");
    if (String(fields.get("website") || "").trim()) return setMessage("We could not submit your request. Please try again.");
    const turnstileToken = String(fields.get("cf-turnstile-response") || "");
    if (!turnstileToken) return setMessage("Please complete the security check.");

    setBusy(true);
    setMessage("Sending your appointment request…");
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: String(fields.get("name") || "").trim(),
          phone: String(fields.get("phone") || "").trim(),
          email: String(fields.get("email") || "").trim(),
          stateCode: stateCodes[state],
          zipCode: String(fields.get("zip") || "").trim(),
          city: String(fields.get("city") || "").trim(),
          insuranceType: String(fields.get("interest") || "Final Expense"),
          preferredDate: date,
          preferredTime: slot,
          source,
          contactConsent: true,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          website: String(fields.get("website") || ""),
          turnstileToken,
        }),
      });
      const result = await response.json().catch(() => ({ error: "We could not submit your request. Please try again." }));
      if (!response.ok) {
        window.turnstile?.reset();
        setMessage(result.error || "We could not submit your request. Please try again.");
        return;
      }
      form.reset();
      setState("");
      setDate("");
      setSlot("");
      setSource("Other");
      window.turnstile?.reset();
      setMessage("Request received. Alpha Nation will contact you to confirm the appointment. Your preferred time is not confirmed until our team contacts you.");
    } catch {
      window.turnstile?.reset();
      setMessage("The request could not be sent. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="form-card" onSubmit={submit}>
    <div className="form-grid">
      <label>Full name<input name="name" autoComplete="name" required maxLength={120} minLength={2} placeholder="Your full name" /></label>
      <label>Phone number<input name="phone" type="tel" autoComplete="tel" required maxLength={32} minLength={7} pattern="[0-9+() .-]{7,32}" placeholder="Your phone number" /></label>
      <label>Email address <span>(optional)</span><input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" /></label>
      <label>State<select required value={state} onChange={(event) => setState(event.target.value)}><option value="">Select your state</option>{states.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>ZIP code<input name="zip" inputMode="numeric" autoComplete="postal-code" required maxLength={10} pattern="[0-9]{5}(-[0-9]{4})?" placeholder="ZIP code" /></label>
      <label>City<input name="city" autoComplete="address-level2" required maxLength={100} minLength={2} placeholder="City" /></label>
      <label>Insurance or service<select name="interest" defaultValue="Final Expense">{products.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Preferred date<input name="date" type="date" required value={date} onChange={(event) => setDate(event.target.value)} min={localDateValue()} /></label>
      <label>Preferred time<select required value={slot} onChange={(event) => setSlot(event.target.value)}><option value="">Choose a time</option>{Array.from({ length: 25 }, (_, index) => { const hour = 8 + Math.floor(index / 2); const minute = index % 2 ? 30 : 0; const label = `${hour % 12 || 12}:${minute ? "30" : "00"} ${hour < 12 ? "AM" : "PM"}`; return <option key={label}>{label}</option>; })}</select></label>
      <label>How did you hear about us?<select name="source" value={source} onChange={(event) => setSource(event.target.value)}>{["Google Search","Facebook","Instagram","Referral","Advertisement","Phone Call","Other"].map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>
    <div className="form-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="consent-panel"><p><b>Appointment contact consent</b></p><label className="consent-check"><input name="consent" type="checkbox" required /> I agree that Alpha Nation may contact me by phone or email about this appointment. This is not consent to receive marketing messages or submit an insurance application.</label></div>
    {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /><div className="turnstile-wrap"><div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-action="appointment" data-theme="dark" /><noscript>JavaScript is required for the security check.</noscript></div></> : <p className="form-notice">Online requests are temporarily unavailable while security verification is configured. Please email aalphanation@gmail.com.</p>}
    <p className="form-notice">Your preferred date and time are a request, not a confirmed booking. Our team will contact you to confirm the appointment and applicable time zone. Do not enter medical or health details here.</p>
    <button className="button" type="submit" disabled={busy}>{busy ? "Submitting…" : "Request appointment"}</button>
    {message && <p role="status" className="form-notice">{message}</p>}
  </form>;
}

declare global { interface Window { turnstile?: { reset: () => void } } }
