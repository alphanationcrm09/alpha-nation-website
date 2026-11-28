import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Homeowners Insurance Coverage Guide: Limits, Deductibles & Exclusions | Alpha Nation",
  description: "Learn how homeowners insurance works, including dwelling coverage, personal property, liability, deductibles, replacement cost and common exclusions in the U.S.",
  alternates: { canonical: "/homeowners-insurance-guide" },
};

const faqs = [
  { q: "How is the dwelling coverage amount determined?", a: "Dwelling coverage is generally based on the estimated cost to repair or rebuild the home, not its market sale price or the value of the land. Construction materials, size, labor costs, features and local building costs can affect the estimate. Review the insurer's valuation and update it after major renovations." },
  { q: "Does homeowners insurance cover water damage?", a: "Coverage depends on the cause of the water damage and the policy wording. A sudden pipe leak may be treated differently from gradual seepage, sewer backup or surface flooding. Review exclusions, limits and any available water-backup endorsement." },
  { q: "Is my roof covered for every type of damage?", a: "Not necessarily. The policy may treat wind, hail, wear and tear, maintenance issues and roof age differently. Some contracts use replacement cost for certain losses while others apply actual cash value or special roof settlement terms." },
  { q: "What is a homeowners insurance deductible?", a: "A deductible is the amount you are responsible for paying toward a covered claim before the insurer pays the covered remainder, subject to limits and policy terms. Some policies have separate deductibles for specific risks, such as wind or named storms." },
  { q: "Does homeowners insurance cover my belongings outside the home?", a: "Some policies provide limited off-premises personal property coverage, but sublimits and exclusions can apply. Check the contract for belongings in a vehicle, storage unit or while traveling, and ask about scheduled coverage for valuable items." },
  { q: "Do I need separate flood insurance?", a: "Many standard homeowners policies exclude flood damage. Separate flood coverage may be available through the National Flood Insurance Program or private insurers. Availability, waiting periods, limits and exclusions depend on the policy and location." },
];

export default function Page() {
  return <>
    <PageHero eyebrow="HOMEOWNERS INSURANCE EDUCATION" title="A practical guide to homeowners insurance coverage." description="Understand the main parts of a homeowners policy, how deductibles and settlement methods work, and which exclusions deserve a closer look before choosing coverage." />
    <section className="section"><div className="wrap">
      <div className="section-heading"><p className="eyebrow">THE MAIN COVERAGE PARTS</p><h2>What a homeowners policy often includes.</h2><p className="lead">A standard policy often combines several protections. The exact coverages, limits and covered causes of loss depend on the policy form, insurer and property location.</p></div>
      <div className="an-tool-grid">
        <article className="an-tool-card"><h3>Dwelling coverage</h3><p>May help pay to repair or rebuild the house after a covered loss. The limit should be reviewed against estimated reconstruction costs, not simply the home's sale price.</p></article>
        <article className="an-tool-card"><h3>Other structures</h3><p>May cover detached structures such as a garage, fence or shed, subject to the policy's definition, limits and exclusions.</p></article>
        <article className="an-tool-card"><h3>Personal property</h3><p>May protect belongings such as furniture, clothing and electronics against specified covered losses. Special limits can apply to jewelry, collectibles and other valuables.</p></article>
        <article className="an-tool-card"><h3>Personal liability</h3><p>May provide coverage if you are legally responsible for certain bodily injury or property damage to others, subject to exclusions and limits.</p></article>
        <article className="an-tool-card"><h3>Medical payments to others</h3><p>Some policies include limited no-fault medical payments for certain injuries to visitors, regardless of legal liability, within policy conditions.</p></article>
        <article className="an-tool-card"><h3>Additional living expenses</h3><p>May help with certain extra living costs if a covered loss makes the home unfit to live in during repairs, subject to time and dollar limits.</p></article>
      </div>
    </div></section>
    <section className="section"><div className="wrap product-detail-grid">
      <article><p className="eyebrow">HOW TO COMPARE POLICIES</p><h2>Review more than the premium.</h2><ul className="product-check-list">
        <li><span aria-hidden="true">✓</span>Compare dwelling limits against a current rebuild-cost estimate.</li>
        <li><span aria-hidden="true">✓</span>Check personal property limits and whether belongings are settled at replacement cost or actual cash value.</li>
        <li><span aria-hidden="true">✓</span>Review liability limits and consider whether your household has additional exposure.</li>
        <li><span aria-hidden="true">✓</span>Understand each deductible, including any separate percentage or named-storm deductible.</li>
        <li><span aria-hidden="true">✓</span>Read exclusions and endorsements for water backup, valuable property, home businesses and other specific risks.</li>
        <li><span aria-hidden="true">✓</span>Ask how roof age, renovations, occupancy and claims history affect eligibility and settlement terms.</li>
      </ul></article>
      <aside className="product-note"><p className="eyebrow">IMPORTANT DISTINCTIONS</p><h3>Replacement cost is not market value.</h3><p>Market value reflects what a property might sell for, including land and local market conditions. Replacement cost estimates the expense to rebuild the structure. The two figures can differ substantially.</p><p>Actual cash value generally accounts for depreciation. Replacement-cost coverage generally does not subtract depreciation in the same way, but payment conditions, limits and claim procedures still apply.</p></aside>
    </div></section>
    <section className="section"><div className="wrap">
      <div className="section-heading"><p className="eyebrow">COMMON EXCLUSIONS AND GAPS</p><h2>Risks to check before a loss happens.</h2></div>
      <div className="product-faq-list">
        <details><summary>Flood and surface water</summary><p>Many homeowners policies exclude flood damage. Separate flood insurance may be needed, and coverage terms, limits and waiting periods should be checked before a policy is purchased.</p></details>
        <details><summary>Earthquake and earth movement</summary><p>Earthquake damage is commonly excluded or limited under standard forms. Separate coverage or an endorsement might be available depending on the location and insurer.</p></details>
        <details><summary>Maintenance and gradual damage</summary><p>Policies generally distinguish sudden accidental damage from wear and tear, deterioration, neglect or maintenance problems. The specific wording controls.</p></details>
        <details><summary>Water backup and sump overflow</summary><p>Sewer or drain backup and sump-pump overflow are often limited or excluded unless an endorsement is added. Ask what events and dollar limits apply.</p></details>
      </div>
    </div></section>
    <section className="section product-faq-section"><div className="wrap"><div className="section-heading"><p className="eyebrow">HOMEOWNERS INSURANCE FAQS</p><h2>Questions to ask before choosing coverage.</h2></div><div className="product-faq-list">{faqs.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div></div></section>
    <section className="section"><div className="wrap"><div className="section-heading"><p className="eyebrow">RELATED INFORMATION</p><h2>Continue exploring homeowners coverage.</h2></div><div className="an-tool-grid">
      <article className="an-tool-card"><h3>Home insurance overview</h3><p>Review the main parts of homeowners insurance and the factors that affect coverage.</p><Link href="/home-insurance">Visit the home insurance page ↗</Link></article>
      <article className="an-tool-card"><h3>Insurance FAQs</h3><p>Find answers about coverage, applications, underwriting and policy details.</p><Link href="/faq">Browse insurance FAQs ↗</Link></article>
      <article className="an-tool-card"><h3>Request information</h3><p>Ask about options and availability in your state.</p><Link href="/quote">Request information ↗</Link></article>
    </div></div></section>
    <section className="product-cta"><div className="wrap"><div><p className="eyebrow">TAKE THE NEXT STEP</p><h2>Review your home coverage with care.</h2><p>Request information and ask to be connected with an appropriately licensed professional where available.</p></div><Link className="button button-light" href="/quote">Request information ↗</Link></div></section>
    <section className="section"><div className="wrap"><p className="legal-note">This page provides general educational information, not insurance, legal or financial advice. It is not an offer, quote, application or guarantee of coverage. Licensing, carrier appointments, products, eligibility, terms, exclusions and pricing vary by state and insurer. The issued policy and contract documents control coverage.</p></div></section>
  </>;
}
