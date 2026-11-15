"use client";

import { useEffect, useState } from "react";

type Row = Record<string, unknown> & { id: string; created_at: string; full_name: string; phone: string; email?: string | null; state_code?: string | null; status: string };

export default function RecordsManager({ kind }: { kind: "appointments" | "inquiries" }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const isAppointment = kind === "appointments";

  async function load() {
    try {
      const response = await fetch(`/api/admin?resource=${kind}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load records.");
      setRows(result.rows || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [kind]);

  async function updateStatus(id: string, status: string) {
    const response = await fetch("/api/admin", {
      method: "PATCH", headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "record.status", kind, id, status }),
    });
    const result = await response.json();
    setMessage(response.ok ? "Status updated." : result.error || "Status could not be updated.");
    if (response.ok) await load();
  }

  return <div className="admin-panel">
    <h2>{isAppointment ? "Appointment requests" : "Customer inquiries"}</h2>
    <p>{isAppointment ? "Preferred times are requests until your team confirms them with the customer." : "Review new inquiries and record follow-up progress."}</p>
    {message && <p role="status">{message}</p>}
    {loading ? <p>Loading records…</p> : <div className="admin-table-wrap"><table className="admin-table">
      <thead><tr>{(isAppointment ? ["Received","Customer","Phone","State","Service","Preferred date/time","Status"] : ["Received","Customer","Phone","State","Type","Message","Status"]).map((heading) => <th key={heading}>{heading}</th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr key={row.id}>
        <td>{new Date(row.created_at).toLocaleString()}</td>
        <td>{row.full_name}<small>{String(row.residential_address||"")}</small><small>{row.beneficiary_name ? `Beneficiary: ${row.beneficiary_name} (${row.beneficiary_relationship||"—"})` : ""}</small></td>
        <td><a href={`tel:${row.phone}`}>{row.phone}</a>{row.email && <small>{row.email}</small>}</td>
        <td>{row.state_code || "—"}</td>
        {isAppointment ? <>
          <td>{String(row.insurance_type || "")}<small>{row.coverage_amount ? `Coverage: ${Number(row.coverage_amount).toLocaleString()}` : ""}</small></td>
          <td>{String(row.preferred_date || "—")} {String(row.preferred_time || "")}<small>{String(row.customer_timezone || "")}</small></td>
          <td><select value={row.status} onChange={(event) => updateStatus(row.id, event.target.value)}>{["new","contacted","scheduled","confirmed","completed","reschedule_requested","cancellation_requested","cancelled","no_show"].map((status) => <option key={status}>{status}</option>)}</select></td>
        </> : <>
          <td>{String(row.inquiry_type || "")}</td><td className="record-message">{String(row.message || "—")}</td>
          <td><select value={row.status} onChange={(event) => updateStatus(row.id, event.target.value)}>{["new","in_progress","responded","closed"].map((status) => <option key={status}>{status}</option>)}</select></td>
        </>}
      </tr>)}</tbody>
    </table>{!rows.length && <p>No records yet.</p>}</div>}
  </div>;
}
