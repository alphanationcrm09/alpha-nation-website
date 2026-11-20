"use client";

import { useEffect, useState } from "react";

type CoverageOption = { id: string; amount: number; label: string; sort_order: number; active: boolean };

export default function CoverageOptionsManager() {
  const [rows, setRows] = useState<CoverageOption[]>([]);
  const [amount, setAmount] = useState("5000");
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const response = await fetch("/api/admin/coverage-options", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load coverage options.");
      setRows(result.rows || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load coverage options.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function request(url: string, method: string, body?: unknown) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { "content-type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Coverage option could not be saved.");
      setMessage("Coverage options updated.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Coverage option could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isInteger(value) || value < 2000 || value > 1000000) {
      setMessage("Enter an amount from $2,000 to $1,000,000.");
      return;
    }
    await request("/api/admin/coverage-options", "POST", {
      amount: value,
      label: label.trim() || "$" + value.toLocaleString("en-US"),
      sortOrder: rows.length ? Math.max(...rows.map(row => row.sort_order)) + 10 : 10,
    });
    setAmount("");
    setLabel("");
  }

  async function update(row: CoverageOption, changes: Partial<CoverageOption>) {
    await request("/api/admin/coverage-options", "PATCH", {
      id: row.id,
      ...(changes.amount !== undefined ? { amount: changes.amount } : {}),
      ...(changes.label !== undefined ? { label: changes.label } : {}),
      ...(changes.active !== undefined ? { active: changes.active } : {}),
      ...(changes.sort_order !== undefined ? { sortOrder: changes.sort_order } : {}),
    });
  }

  async function move(index: number, direction: -1 | 1) {
    const otherIndex = index + direction;
    if (otherIndex < 0 || otherIndex >= rows.length) return;
    const current = rows[index];
    const other = rows[otherIndex];
    setBusy(true);
    setMessage("");
    try {
      const [first, second] = await Promise.all([
        fetch("/api/admin/coverage-options", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: current.id, sortOrder: other.sort_order }) }),
        fetch("/api/admin/coverage-options", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: other.id, sortOrder: current.sort_order }) }),
      ]);
      if (!first.ok || !second.ok) throw new Error("Display order could not be changed.");
      setMessage("Display order updated.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Display order could not be changed.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="admin-panel">
    <h2>Customer coverage amounts</h2>
    <p>These exact amounts appear on the customer Explore Options form. Changes are saved to the database and appear on the public form automatically. The form also keeps Custom amount and Not sure yet choices.</p>
    <form className="admin-inline-form" onSubmit={add}>
      <label>Coverage amount (USD)<input required type="number" min="2000" max="1000000" step="1000" value={amount} onChange={event => setAmount(event.target.value)} placeholder="5000" /></label>
      <label>Customer-facing label (optional)<input maxLength={80} value={label} onChange={event => setLabel(event.target.value)} placeholder="Auto: $5,000" /></label>
      <button className="button" disabled={busy}>Add amount</button>
    </form>
    <p className="form-notice">Amounts must be between $2,000 and $1,000,000. Duplicate amounts are not allowed.</p>
    {message && <p role="status">{message}</p>}
    {loading ? <p>Loading coverage options…</p> : rows.length === 0 ? <p>No active or inactive amounts found. Add the first amount above.</p> : <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>Amount</th><th>Display label</th><th>Status</th><th>Order</th><th>Actions</th></tr></thead>
        <tbody>{rows.map((row, index) => <tr key={row.id}>
          <td><input aria-label={"Amount for " + row.label} type="number" min="2000" max="1000000" step="1000" defaultValue={row.amount} onBlur={event => { const next = Number(event.target.value); if (next !== row.amount && Number.isInteger(next)) void update(row, { amount: next, label: "$" + next.toLocaleString("en-US") }); }} /></td>
          <td><input aria-label={"Label for " + row.label} maxLength={80} defaultValue={row.label} onBlur={event => { if (event.target.value.trim() && event.target.value.trim() !== row.label) void update(row, { label: event.target.value.trim() }); }} /></td>
          <td>{row.active ? "Active" : "Hidden"}</td>
          <td><button type="button" className="text-button" disabled={busy || index === 0} onClick={() => void move(index, -1)}>↑</button>{" "}<button type="button" className="text-button" disabled={busy || index === rows.length - 1} onClick={() => void move(index, 1)}>↓</button></td>
          <td><button type="button" className="text-button" disabled={busy} onClick={() => void update(row, { active: !row.active })}>{row.active ? "Hide" : "Show"}</button>{" "}<button type="button" className="text-button" disabled={busy} onClick={() => { if (window.confirm("Delete this coverage amount?")) void request("/api/admin/coverage-options?id=" + encodeURIComponent(row.id), "DELETE"); }}>Delete</button></td>
        </tr>)}</tbody>
      </table>
    </div>}
  </div>;
}
