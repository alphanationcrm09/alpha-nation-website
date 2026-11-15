"use client";

import { useState } from "react";
import Script from "next/script";

const codes = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
const inquiryTypes = ["Final Expense","Life Insurance","Medicare","ACA Health Insurance","Auto Insurance","Home Insurance","Credit Repair","Debt Relief","General question"];

export default function InquiryForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    if (String(fields.get("website") || "").trim()) return setMessage("We could not send your message. Please try again.");
    if (!fields.get("consent")) return setMessage("Please provide contact consent.");
    const turnstileToken = String(fields.get("cf-turnstile-response") || "");
    if (!turnstileToken) return setMessage("Please complete the security check.");

    setBusy(true);
    setMessage("Sending your inquiry…");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: String(fields.get("name") || "").trim(),
          phone: String(fields.get("phone") || "").trim(),
          email: String(fields.get("email") || "").trim(),
          stateCode: String(fields.get("state") || ""),
          zipCode: String(fields.get("zip") || "").trim(),
          inquiryType: String(fields.get("type") || "General question"),
          message: String(fields.get("message") || "").trim(),
          contactConsent: true,
          website: String(fields.get("website") || ""),
          turnstileToken,
        }),
      });
      const result = await response.json().catch(() => ({ error: "We could not send your message. Please try again." }));
      if (!response.ok) {
        window.turnstile?.reset();
        setMessage(result.error || "We could not send your message. Please try again.");
        return;
      }
      form.reset();
      window.turnstile?.reset();
      setMessage("Your inquiry has been received. Our team will follow up.");
    } catch {
      window.turnstile?.reset();
      setMessage("The inquiry could not be sent. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="form-card" onSubmit={submit}>
    <div className="form-grid">
      <label>Full name<input name="name" required minLength={2} maxLength={120} autoComplete="name" /></label>
      <label>Phone number<input name="phone" required minLength={7} maxLength={32} pattern="[0-9+() .-]{7,32}" type="tel" autoComplete="tel" /></label>
      <label>Email (optional)<input name="email" type="email" maxLength={254} autoComplete="email" /></label>
      <label>State<select name="state"><option value="">Select state</option>{codes.map((code) => <option key={code}>{code}</option>)}</select></label>
      <label>ZIP code (optional)<input name="zip" inputMode="numeric" maxLength={10} pattern="[0-9]{5}(-[0-9]{4})?" /></label>
      <label>What is your question about?<select name="type">{inquiryTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
    </div>
    <label className="message-label">Message<textarea name="message" rows={4} maxLength={3000} placeholder="How can our team help?" /></label>
    <div className="form-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="consent-panel"><label className="consent-check"><input type="checkbox" name="consent" required /> I agree that Alpha Nation may contact me about this inquiry. This is not marketing or insurance application consent.</label></div>
    {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /><div className="turnstile-wrap"><div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-action="inquiry" data-theme="dark" /><noscript>JavaScript is required for the security check.</noscript></div></> : <p className="form-notice">Online requests are temporarily unavailable while security verification is configured. Please email aalphanation@gmail.com.</p>}
    <button className="button" disabled={busy}>{busy ? "Sending…" : "Send inquiry"}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}

declare global { interface Window { turnstile?: { reset: () => void } } }
