"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlphaLogo } from "@/components/AlphaLogo";

export default function SetPasswordPage() {
  const [destination, setDestination] = useState("/customer");
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("next") || "/customer";
    const candidate = new URL(requested, window.location.origin);
    setDestination(candidate.origin === window.location.origin ? candidate.pathname + candidate.search + candidate.hash : "/customer");
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const authError = hash.get("error_description") || hash.get("error");
    if (accessToken && refreshToken) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      setBusy(true);
      setMessage("Verifying your secure password-reset link…");
      fetch("/api/customer/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "password.session", access_token: accessToken, refresh_token: refreshToken }),
      }).then(async response => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "The reset link could not be verified.");
        setMessage("Link verified. Choose your new password below.");
      }).catch(error => {
        setMessage(error instanceof Error ? error.message : "The reset link could not be verified. Request a new link.");
      }).finally(() => setBusy(false));
    } else if (authError) {
      setMessage("The password-reset link could not be verified or has expired. Request a new link.");
    }
  }, []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 12) { setMessage("Use at least 12 characters."); return; }
    if (password !== confirmPassword) { setMessage("The passwords do not match."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/customer/auth", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "password.update", password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Password could not be saved.");
      window.location.assign(destination);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Password could not be saved.");
    } finally { setBusy(false); }
  }

  return <section className="admin-login-wrap"><div className="admin-login-card">
    <Link href="/"><AlphaLogo /></Link>
    <p className="eyebrow">SECURE ACCOUNT SETUP</p>
    <h1>Create your password</h1>
    <p>Choose a password with at least 12 characters. Keep it private.</p>
    <form onSubmit={save}>
      <label>New password<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={password} onChange={event => setPassword(event.target.value)} /></label>
      <label>Confirm password<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} /></label>
      <button className="button" disabled={busy}>{busy ? "Saving…" : "Save password"}</button>
      {message && <p role="status">{message}</p>}
    </form>
  </div></section>;
}
