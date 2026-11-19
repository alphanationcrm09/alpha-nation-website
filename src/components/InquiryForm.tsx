"use client";

import { useEffect, useState } from "react";
import TurnstileChallenge from "@/components/TurnstileChallenge";

type StateOption = { state_code: string; state_name: string };
const inquiryTypes = ["Final Expense","Life Insurance","Medicare","ACA Health Insurance","Auto Insurance","Home Insurance","Credit Repair","Debt Relief","General question"];

export default function InquiryForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [states, setStates] = useState<StateOption[]>([]);

  useEffect(() => {
    fetch("/api/states", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("State list unavailable.");
        const result = await response.json();
        setStates(Array.isArray(result.rows) ? result.rows : []);
      })
      .catch(() => setStates([]));
  }, []);

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
      <label>State (optional)<select name="state"><option value="">Select state</option>{states.map((item) => <option key={item.state_code} value={item.state_code}>{item.state_name}</option>)}</select></label>
      <label>ZIP code (optional)<input name="zip" inputMode="numeric" maxLength={10} pattern="[0-9]{5}(-[0-9]{4})?" /></label>
      <label>What is your question about?<select name="type">{inquiryTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
    </div>
    <label className="message-label">Message<textarea name="message" rows={4} maxLength={3000} placeholder="How can our team help?" /></label>
    <div className="form-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="consent-panel"><label className="consent-check"><input type="checkbox" name="consent" required /> I agree that Alpha Nation may contact me about this inquiry. This is not marketing or insurance application consent.</label></div>
    <TurnstileChallenge action="inquiry" theme="dark" />
    <button className="button" disabled={busy}>{busy ? "Sending…" : "Send inquiry"}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
