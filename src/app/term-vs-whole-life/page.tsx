import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Term vs. Whole Life Insurance: Key Differences | Alpha Nation",
  description: "Compare term and whole life insurance in the U.S., including coverage duration, premiums, cash value and questions to ask before applying.",
  alternates: { canonical: "/term-vs-whole-life" },
};

const rows = [
  { feature: "Coverage period", term: "A selected period, often 10, 20 or 30 years. The contract explains what happens when the term ends.", whole: "Designed to provide lifelong coverage when required premiums are paid and policy conditions are met." },
  { feature: "Premiums", term: "Often has a lower initial premium for a similar death benefit. Renewal premiums, if available, may increase.", whole: "Typically costs more than comparable term coverage. Review the guaranteed premium schedule." },
  { feature: "Cash value", term: "Traditional term life generally does not build cash value.", whole: "Many whole life policies build cash value under contract terms. Loans or withdrawals affect policy values and benefits." },
  { feature: "Options", term: "Some contracts include renewal or conversion rights, subject to deadlines and conditions.", whole: "Some contracts include policy loans, dividends or paid-up options. Availability and terms vary." },
  { feature: "Common use", term: "Often considered for time-limited needs such as income replacement or a mortgage.", whole: "Sometimes considered for long-term coverage needs where the premium and features fit the household's plan." },
];

export default function Page() {
  return <>
    <PageHero eyebrow="LIFE INSURANCE EDUCATION" title="Term vs. whole life insurance: what is the difference?" description="Both are forms of life insurance, but they work differently. Compare how long coverage lasts, how premiums work and whether cash value is part of the policy." />
    <section className="section"><div className="wrap">
      <div className="section-heading"><p className="eyebrow">SIDE-BY-SIDE COMPARISON</p><h2>How the two policy types differ.</h2><p className="lead">These are general descriptions. Actual features, costs and guarantees depend on the insurer and policy contract.</p></div>
      <div className="table-wrap"><table><thead><tr><th scope="col">Feature</th><th scope="col">Term life</th><th scope="col">Whole life</th></tr></thead><tbody>{rows.map(row => <tr key={row.feature}><th scope="row">{row.feature}</th><td>{row.term}</td><td>{row.whole}</td></tr>)}</tbody></table></div>
    </div></section>
    <section className="section"><div className="wrap product-detail-grid">
      <article><p className="eyebrow">BEFORE YOU CHOOSE</p><h2>Questions worth asking.</h2><ul className="product-check-list">
        <li><span aria-hidden="true">✓</span>How many years will your dependents or financial responsibilities need support?</li>
        <li><span aria-hidden="true">✓</span>What premium fits your budget now and over the long term?</li>
        <li><span aria-hidden="true">✓</span>Which benefits and premiums are guaranteed in the contract?</li>
        <li><span aria-hidden="true">✓</span>What renewal and conversion rights apply to a term policy, and when do they expire?</li>
        <li><span aria-hidden="true">✓</span>How do cash value, loans, dividends and surrender charges work in a whole life policy?</li>
        <li><span aria-hidden="true">✓</span>Would the policy remain affordable if your household needs changed?</li>
      </ul></article>
      <aside className="product-note"><p className="eyebrow">IMPORTANT DETAILS</p><h3>Do not compare price alone.</h3><p>Compare the same applicant details, death benefit, underwriting assumptions and payment frequency. Review guaranteed values separately from non-guaranteed illustrations.</p><p>Do not cancel existing coverage until replacement coverage is approved, issued and in force. Review any new contestability period or exclusions.</p></aside>
    </div></section>
    <section className="section product-faq-section"><div className="wrap"><div className="section-heading"><p className="eyebrow">COMMON QUESTIONS</p><h2>Term and whole life FAQs.</h2></div><div className="product-faq-list">
      <details><summary>Is term life insurance cheaper than whole life?</summary><p>Term life often has a lower initial premium for a similar death benefit because it covers a defined period and generally has no cash value. Actual prices depend on age, health, coverage, term length, underwriting and state.</p></details>
      <details><summary>Does whole life insurance last forever?</summary><p>Whole life is designed as permanent coverage, subject to required premium payments, policy conditions and contract terms.</p></details>
      <details><summary>Can I convert term life to whole life?</summary><p>Some term policies include a conversion privilege. Eligible products, deadlines and conditions vary, so check the contract.</p></details>
      <details><summary>Which type builds cash value?</summary><p>Many whole life policies build cash value. Traditional term life generally does not. Access, loans, dividends and charges depend on the contract.</p></details>
      <details><summary>Which type is best for my family?</summary><p>There is no single best type for everyone. Consider the length of the financial need, budget, desired guarantees and policy features. An appropriately licensed professional can explain options available in your state.</p></details>
    </div></div></section>
    <section className="section"><div className="wrap"><div className="section-heading"><p className="eyebrow">RELATED GUIDES</p><h2>Read more about each option.</h2></div><div className="an-tool-grid">
      <article className="an-tool-card"><h3>Term life insurance</h3><p>Learn about term lengths, renewals and conversion provisions.</p><Link href="/term-life">Read the term life guide ↗</Link></article>
      <article className="an-tool-card"><h3>Whole life insurance</h3><p>Understand permanent coverage, premiums and cash value.</p><Link href="/whole-life">Read the whole life guide ↗</Link></article>
      <article className="an-tool-card"><h3>Life insurance basics</h3><p>Explore coverage needs and common life insurance terms.</p><Link href="/life-insurance">Read the life insurance guide ↗</Link></article>
      <article className="an-tool-card"><h3>Coverage calculator</h3><p>Estimate financial responsibilities as a starting point.</p><Link href="/calculator">Use the calculator ↗</Link></article>
    </div></div></section>
    <section className="product-cta"><div className="wrap"><div><p className="eyebrow">TAKE THE NEXT STEP</p><h2>Understand your options before applying.</h2><p>Request information and ask to be connected with an appropriately licensed professional where available.</p></div><Link className="button button-light" href="/quote">Request information ↗</Link></div></section>
    <section className="section"><div className="wrap"><p className="legal-note">This page provides general educational information, not financial, legal or insurance advice. It is not an offer, quote, application or guarantee of coverage. Licensing, carrier appointments, products, eligibility, terms and pricing vary by state and insurer. The insurer's issued policy and contract documents control coverage.</p></div></section>
  </>;
}
