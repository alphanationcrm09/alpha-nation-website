"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Factor = { id: string; friendlyName: string | null; status: "verified" | "unverified" };

export default function AdminSecurityPage() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [currentLevel, setCurrentLevel] = useState("aal1");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const response = await fetch("/api/admin/mfa", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load security settings.");
      setFactors(result.factors || []);
      setCurrentLevel(result.currentLevel || "aal1");
      const verified = (result.factors || []).find((factor: Factor) => factor.status === "verified");
      const pending = (result.factors || []).find((factor: Factor) => factor.status === "unverified");
      setFactorId(verified?.id || pending?.id || "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load security settings.");
    } finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  async function post(body: Record<string, string>) {
    const response = await fetch("/api/admin/mfa", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Security request failed.");
    return result;
  }

  async function startSetup() {
    setBusy(true); setMessage("");
    try {
      const result = await post({ action: "enroll" });
      setFactorId(result.factorId); setQrCode(result.qrCode); setSecret(result.secret);
      setMessage("Scan this QR code with an authenticator app, then enter the current six-digit code below.");
      await load();
      setFactorId(result.factorId);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not start setup."); }
    finally { setBusy(false); }
  }

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    try {
      await post({ action: "verify", factorId, code });
      setMessage("Multi-factor authentication verified. Opening the admin panel…");
      window.location.assign("/admin");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Verification failed."); }
    finally { setBusy(false); }
  }

  async function removePending() {
    if (!factorId || !confirm("Remove this unfinished authenticator setup and start again?")) return;
    setBusy(true);
    try {
      await post({ action: "remove-unverified", factorId });
      setFactorId(""); setQrCode(""); setSecret(""); setMessage("Unfinished setup removed. Start a new authenticator setup.");
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not remove unfinished setup."); }
    finally { setBusy(false); }
  }

  const verifiedFactor = factors.find((factor) => factor.status === "verified");
  const pendingFactor = factors.find((factor) => factor.status === "unverified");

  return <section className="admin-shell"><div className="wrap"><div className="admin-panel security-panel">
    <p className="eyebrow">ACCOUNT SECURITY</p>
    <h1>Secure your admin account</h1>
    <p>Alpha Nation admin access requires an authenticator code in addition to your password.</p>
    {loading ? <p>Checking authenticator status…</p> : <>
      {currentLevel === "aal2" && verifiedFactor && !qrCode ? <div className="notice-card"><b>Authenticator verified</b><p>Your current session has passed multi-factor verification.</p><Link className="button" href="/admin">Continue to admin panel</Link><button className="button button-secondary" onClick={startSetup} disabled={busy}>Add a backup authenticator</button></div> : <>
        {qrCode ? <div className="mfa-qr-panel"><p><b>1. Scan this QR code</b></p><img src={qrCode} alt="Authenticator setup QR code" /><p>If scanning does not work, enter this key manually:</p><code>{secret}</code></div> : verifiedFactor ? <p className="form-notice">An authenticator is already enrolled. Enter its current code to complete sign-in.</p> : pendingFactor ? <div className="notice-card"><b>Unfinished authenticator setup found</b><p>Restart the setup to display a fresh QR code.</p><button className="button button-secondary" onClick={removePending} disabled={busy}>Remove unfinished setup</button></div> : <button className="button" onClick={startSetup} disabled={busy}>{busy ? "Starting…" : "Set up authenticator"}</button>}
        {(qrCode || verifiedFactor) && <form className="admin-mfa-form" onSubmit={verify}><label>Authenticator code<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}" minLength={6} maxLength={8} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="6-digit code" /></label><button className="button" disabled={busy || !factorId}>{busy ? "Verifying…" : "Verify and continue"}</button></form>}
        {verifiedFactor && <p className="form-notice">Keep access to your authenticator. Do not share one-time codes. For account recovery, configure a second trusted authenticator after signing in.</p>}
      </>}
    </>}
    {message && <p role="status">{message}</p>}
    <p><Link href="/admin/login">Back to staff login</Link></p>
  </div></div></section>;
}
