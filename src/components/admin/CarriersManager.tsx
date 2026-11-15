"use client";

import { useEffect, useState } from "react";

type Carrier = { id: string; name: string; display_name: string | null; status: string; website_url: string | null };

export default function CarriersManager() {
  const [rows, setRows] = useState<Carrier[]>([]);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const response = await fetch("/api/admin?resource=carriers", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load carriers.");
      setRows(result.rows || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load carriers.");
    } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const response = await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "carrier.create", name, website }) });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) { setMessage(result.error || "Carrier could not be added."); return; }
    setName(""); setWebsite(""); setMessage("Carrier added. Verify relationship before publishing claims."); await load();
  }

  async function update(id: string, status: string) {
    const response = await fetch("/api/admin", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "carrier.update", id, status }) });
    const result = await response.json();
    setMessage(response.ok ? "Carrier updated." : result.error || "Carrier could not be updated.");
    if (response.ok) await load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this carrier from the website directory?")) return;
    const response = await fetch(`/api/admin?kind=carrier&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const result = await response.json();
    setMessage(response.ok ? "Carrier removed." : result.error || "Carrier could not be removed.");
    if (response.ok) await load();
  }

  return <div className="admin-panel">
    <h2>Carrier directory</h2><p>Add and manage carrier records. New carriers start as pending verification.</p>
    <form className="admin-inline-form" onSubmit={add}>
      <label>Carrier name<input value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} placeholder="Carrier name" /></label>
      <label>Website (optional)<input type="url" value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://" /></label>
      <button className="button" disabled={busy}>{busy ? "Adding…" : "Add carrier"}</button>
    </form>
    {message && <p role="status">{message}</p>}
    {loading ? <p>Loading carriers…</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Carrier</th><th>Status</th><th>Website</th><th>Actions</th></tr></thead><tbody>
      {rows.map((row) => <tr key={row.id}><td>{row.display_name || row.name}</td><td><select value={row.status} onChange={(event) => update(row.id, event.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option><option value="pending_verification">Pending verification</option></select></td><td>{row.website_url || "—"}</td><td><button className="text-button" onClick={() => remove(row.id)}>Remove</button></td></tr>)}
    </tbody></table></div>}
  </div>;
}
