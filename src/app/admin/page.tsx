"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlphaLogo } from "@/components/AlphaLogo";

type Counts = { appointments: number; inquiries: number; agents: number; carriers: number };

export default function AdminHome() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [counts, setCounts] = useState<Counts>({ appointments: 0, inquiries: 0, agents: 0, carriers: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin?resource=dashboard", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Admin access could not be verified.");
        setEmail(result.email || "");
        setRole(result.role || "");
        setCounts(result.counts);
      })
      .catch((reason: Error) => {
        setError(reason.message);
        if (reason.message.includes("Admin access")) window.location.assign("/admin/login");
      })
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.assign("/admin/login");
  }

  return <section className="admin-shell"><div className="wrap">
    <header className="admin-head"><Link href="/"><AlphaLogo /></Link><div><span>{email} · {role}</span><button className="button button-small" onClick={logout}>Sign out</button></div></header>
    <p className="eyebrow">ALPHA NATION OPERATIONS</p>
    <h1>Admin panel</h1>
    <p className="lead">Manage website appointments, customer inquiries, carriers and licensed-agent records.</p>
    {loading ? <p>Loading secure workspace…</p> : error ? <div className="notice-card">{error}</div> : <>
      <div className="admin-metrics">{Object.entries({ Appointments: counts.appointments, Inquiries: counts.inquiries, Agents: counts.agents, Carriers: counts.carriers }).map(([label, value]) => <div className="metric-card" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      <div className="admin-nav-grid">{[["Appointments","/admin/appointments","Review and update appointment requests"],["Customer inquiries","/admin/inquiries","Read and manage website inquiries"],["Carriers","/admin/carriers","Add, edit, deactivate or remove carriers"],["Licensed agents","/admin/agents","Manage agents, territories and license verification"],["Service states","/admin/states","Choose which states appear on the booking form"]].map(([title, href, description]) => <Link href={href} className="info-card" key={href}><h2>{title}</h2><p>{description}</p><span>Open section →</span></Link>)}</div>
      <div className="notice-card"><b>Important</b><p>Only agents with verified, current authority for the customer's state and product should receive an assigned customer. The website stores preferred appointment requests; staff must confirm the time with the customer.</p></div>
    </>}
  </div></section>;
}
