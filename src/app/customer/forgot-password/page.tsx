"use client";
import { useState } from "react";
import Link from "next/link";
import { AlphaLogo } from "@/components/AlphaLogo";

export default function CustomerForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/customer/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "password.request", email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The reset request could not be sent.");
      setMessage(result.message || "If an account exists for this email, a reset link has been sent.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The reset request could not be sent.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="admin-login-wrap"><div className="admin-login-card">
    <Link href="/"><AlphaLogo /></Link>
    <p className="eyebrow">CUSTOMER PORTAL</p>
    <h1>Reset your password</h1>
    <p>Enter the email address linked to your Alpha Nation customer account. If an account exists, we will send a secure reset link.</p>
    <form onSubmit={requestReset}>
      <label>Email address<input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} /></label>
      <button className="button" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
      {message && <p role="status">{message}</p>}
    </form>
    <p><Link className="an-inline-link" href="/customer/login">Back to customer login</Link></p>
  </div></section>;
}
