"use client";

import { useState } from "react";
import Link from "next/link";
import { AlphaLogo } from "@/components/AlphaLogo";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("Checking credentials…");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json().catch(() => ({ error: "Login failed. Please try again." }));
      if (!response.ok) {
        setMessage(result.error || "Login failed. Please try again.");
        return;
      }
      window.location.assign("/admin");
    } catch {
      setMessage("Login service is unavailable. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="admin-login-wrap"><div className="admin-login-card">
    <Link href="/"><AlphaLogo /></Link>
    <p className="eyebrow">PRIVATE STAFF ACCESS</p>
    <h1>Admin login</h1>
    <p>Sign in with an account approved by the Alpha Nation owner.</p>
    <form onSubmit={login}>
      <label>Email address<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label>Password
        <span style={{ display: "block", position: "relative" }}>
          <input type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} style={{ paddingRight: "76px" }} />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", border: 0, background: "transparent", color: "inherit", cursor: "pointer", padding: "6px" }}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </span>
      </label>
      <button className="button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      {message && <p role="status">{message}</p>}
    </form>
    <small>Need access? Contact the website owner. Public registration is disabled.</small>
  </div></section>;
}
