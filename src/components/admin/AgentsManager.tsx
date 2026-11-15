"use client";

import { useEffect, useState } from "react";

type Agent = { id: string; full_name: string; email: string | null; phone: string | null; status: string; states: string[]; work_days: string[]; start_time: string | null; end_time: string | null; timezone: string | null };
type License = { id: string; agent_id: string; state_code: string; npn: string | null; license_number: string | null; expires_at: string | null; verification_status: string; agents?: { full_name?: string } | null };

export default function AgentsManager() {
  const [rows, setRows] = useState<Agent[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [name, setName] = useState("");
  const [states, setStates] = useState("");
  const [days, setDays] = useState("Monday-Friday");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [licenseAgent, setLicenseAgent] = useState("");
  const [licenseState, setLicenseState] = useState("");
  const [npn, setNpn] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [agentsResponse, licensesResponse] = await Promise.all([
        fetch("/api/admin?resource=agents", { cache: "no-store" }),
        fetch("/api/admin?resource=licenses", { cache: "no-store" }),
      ]);
      const [agentsResult, licensesResult] = await Promise.all([agentsResponse.json(), licensesResponse.json()]);
      if (!agentsResponse.ok || !licensesResponse.ok) throw new Error(agentsResult.error || licensesResult.error || "Could not load agent records.");
      setRows(agentsResult.rows || []);
      setLicenses(licensesResult.rows || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load agent records.");
    } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  async function post(body: Record<string, unknown>) {
    const response = await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Request failed.");
    return result;
  }
  async function patch(body: Record<string, unknown>) {
    const response = await fetch("/api/admin", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Update failed.");
    return result;
  }

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await post({ action: "agent.create", fullName: name, states: states.split(",").map((value) => value.trim()), email, phone, saturday: days.toLowerCase().includes("saturday") });
      setName(""); setStates(""); setEmail(""); setPhone("");
      setMessage("Agent record added. Add and verify state licenses before activation.");
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Agent could not be added."); }
  }

  async function update(id: string, status: string) {
    try { await patch({ action: "agent.update", id, status }); setMessage("Agent updated."); await load(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Agent could not be updated."); }
  }

  async function remove(id: string) {
    if (!confirm("Remove this agent record? Related license records will also be removed.")) return;
    const response = await fetch(`/api/admin?kind=agent&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const result = await response.json();
    setMessage(response.ok ? "Agent removed." : result.error || "Agent could not be removed.");
    if (response.ok) await load();
  }

  async function addLicense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await post({ action: "license.create", agentId: licenseAgent, stateCode: licenseState, npn, licenseNumber: licenseNo, expiresAt });
      setLicenseState(""); setNpn(""); setLicenseNo(""); setExpiresAt("");
      setMessage("License record saved as unverified. Check the official state record before verification.");
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "License record could not be saved."); }
  }

  async function verifyLicense(id: string, status: string) {
    try { await patch({ action: "license.update", id, status }); setMessage("License verification status updated."); await load(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "License verification failed."); }
  }

  async function addKnown() {
    try {
      const result = await post({ action: "agents.seed" });
      setMessage(`${result.added} supplied agent profiles added. Existing profiles were left unchanged; licenses remain unverified.`);
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Agent profiles could not be added."); }
  }

  return <div className="admin-panel">
    <h2>Licensed-agent records</h2>
    <p>Agent profiles remain inactive until their current state licenses are recorded and verified.</p>
    <button className="button button-secondary" onClick={addKnown}>Add the five supplied agent profiles</button>
    <form className="admin-inline-form" onSubmit={add}>
      <label>Agent name<input required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} /></label>
      <label>States (comma-separated)<input value={states} onChange={(event) => setStates(event.target.value)} placeholder="CA, TX, FL" /></label>
      <label>Work days<input value={days} onChange={(event) => setDays(event.target.value)} placeholder="Monday-Friday" /></label>
      <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <label>Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
      <button className="button">Add agent</button>
    </form>
    {message && <p role="status">{message}</p>}
    {loading ? <p>Loading agent records…</p> : <>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>States</th><th>License status</th><th>Actions</th></tr></thead><tbody>
        {rows.map((agent) => <tr key={agent.id}><td>{agent.full_name}</td><td>{agent.states?.join(", ")}</td><td><select value={agent.status} onChange={(event) => update(agent.id, event.target.value)}><option value="pending_verification">Pending verification</option><option value="active">Active</option><option value="inactive">Inactive</option></select><small>Every assigned state needs a verified license record.</small></td><td><button className="text-button" onClick={() => remove(agent.id)}>Remove</button></td></tr>)}
      </tbody></table></div>
      <h3>State license records</h3>
      <form className="admin-inline-form" onSubmit={addLicense}>
        <label>Agent<select required value={licenseAgent} onChange={(event) => setLicenseAgent(event.target.value)}><option value="">Select agent</option>{rows.map((agent) => <option value={agent.id} key={agent.id}>{agent.full_name}</option>)}</select></label>
        <label>State code<input required maxLength={2} value={licenseState} onChange={(event) => setLicenseState(event.target.value.toUpperCase())} placeholder="TX" /></label>
        <label>NPN<input maxLength={40} value={npn} onChange={(event) => setNpn(event.target.value)} /></label>
        <label>License number<input maxLength={80} value={licenseNo} onChange={(event) => setLicenseNo(event.target.value)} /></label>
        <label>Expiry date<input type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} /></label>
        <button className="button">Add license record</button>
      </form>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Agent</th><th>State</th><th>NPN</th><th>License number</th><th>Expires</th><th>Verification</th></tr></thead><tbody>
        {licenses.map((license) => <tr key={license.id}><td>{license.agents?.full_name || "Agent"}</td><td>{license.state_code}</td><td>{license.npn || "—"}</td><td>{license.license_number || "—"}</td><td>{license.expires_at || "—"}</td><td><select value={license.verification_status} onChange={(event) => verifyLicense(license.id, event.target.value)}>{["unverified","pending","verified","expired","rejected"].map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}
      </tbody></table></div>
    </>}
    <p className="form-notice">Only mark a license verified after checking the official state regulator record. The website does not independently validate license data. NPN, license number and an unexpired expiry date are required before a record can be marked verified.</p>
  </div>;
}
