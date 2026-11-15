"use client";

import { useMemo, useState } from "react";

const fields = [
  { key: "mortgage", label: "Mortgage balance", help: "Remaining home loan" },
  { key: "debts", label: "Other debts", help: "Loans, cards and obligations" },
  { key: "income", label: "Income replacement", help: "Amount set aside for future household income needs" },
  { key: "education", label: "Education expenses", help: "Expected education costs" },
  { key: "final", label: "Final expenses", help: "Funeral and related expenses" },
  { key: "otherNeeds", label: "Other financial needs", help: "Any additional responsibilities" },
  { key: "savings", label: "Savings and investments", help: "Funds available to your family" },
  { key: "existing", label: "Existing life insurance", help: "Current life insurance benefits" },
  { key: "otherResources", label: "Other available resources", help: "Other funds intended for these needs" },
] as const;

type Key = typeof fields[number]["key"];
type Values = Record<Key, string>;

const initial: Values = { mortgage: "0", debts: "0", income: "0", education: "0", final: "0", otherNeeds: "0", savings: "0", existing: "0", otherResources: "0" };
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function FinancialNeedsCalculator() {
  const [values, setValues] = useState<Values>(initial);
  const totals = useMemo(() => {
    const n = (key: Key) => Math.max(0, Number(values[key]) || 0);
    const needs = n("mortgage") + n("debts") + n("income") + n("education") + n("final") + n("otherNeeds");
    const resources = n("savings") + n("existing") + n("otherResources");
    return { needs, resources, gap: Math.max(0, needs - resources) };
  }, [values]);

  return <div className="an-calculator">
    <div className="an-calculator-fields">
      <div className="an-calculator-group"><span className="an-calc-kicker">01 / FINANCIAL RESPONSIBILITIES</span><h3>What might your family need?</h3>
        {fields.slice(0, 6).map((field) => <label className="an-calc-field" key={field.key}><span><b>{field.label}</b><small>{field.help}</small></span><span className="an-calc-input"><span>$</span><input inputMode="decimal" type="number" min="0" step="1000" value={values[field.key]} onChange={(e) => setValues((current) => ({ ...current, [field.key]: e.target.value }))} aria-label={field.label} /></span></label>)}
      </div>
      <div className="an-calculator-group"><span className="an-calc-kicker">02 / RESOURCES ALREADY AVAILABLE</span><h3>What resources do you have?</h3>
        {fields.slice(6).map((field) => <label className="an-calc-field" key={field.key}><span><b>{field.label}</b><small>{field.help}</small></span><span className="an-calc-input"><span>$</span><input inputMode="decimal" type="number" min="0" step="1000" value={values[field.key]} onChange={(e) => setValues((current) => ({ ...current, [field.key]: e.target.value }))} aria-label={field.label} /></span></label>)}
      </div>
    </div>
    <aside className="an-calc-result"><span className="an-calc-kicker">YOUR ESTIMATED COVERAGE GAP</span><p className="an-calc-result-label">Illustrative estimate</p><strong>{money.format(totals.gap)}</strong><div className="an-calc-breakdown"><div><span>Total estimated needs</span><b>{money.format(totals.needs)}</b></div><div><span>Available resources</span><b>{money.format(totals.resources)}</b></div></div><button type="button" className="an-calc-reset" onClick={() => setValues(initial)}>Reset calculator</button><p className="an-calc-disclaimer">This calculator provides an educational estimate, not a recommendation, quote or guarantee of coverage. It does not account for taxes, inflation, underwriting, policy costs or every personal circumstance. Review your needs with a qualified professional.</p></aside>
  </div>;
}
