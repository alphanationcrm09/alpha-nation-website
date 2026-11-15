"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlphaLogo } from "@/components/AlphaLogo";

export default function AdminSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/admin/auth", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error("Session expired");
        setEmail(result.email || "");
      })
      .catch(() => window.location.assign("/admin/login"))
      .finally(() => setLoading(false));
  }, []);
  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.assign("/admin/login");
  }
  return <section className="admin-shell"><div className="wrap">
    <header className="admin-head"><Link href="/"><AlphaLogo /></Link><div><span>{email}</span><button className="button button-small" onClick={logout}>Sign out</button></div></header>
    <nav className="admin-subnav"><Link href="/admin">Overview</Link><Link href="/admin/appointments">Appointments</Link><Link href="/admin/inquiries">Inquiries</Link><Link href="/admin/carriers">Carriers</Link><Link href="/admin/agents">Agents</Link></nav>
    <p className="eyebrow">WEBSITE MANAGEMENT</p><h1>{title}</h1>
    {loading ? <p>Verifying secure session…</p> : children}
  </div></section>;
}
