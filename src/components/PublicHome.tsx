"use client";

import Link from "next/link";
import PublicCarriers from "@/components/PublicCarriers";
import FinancialNeedsCalculator from "@/components/FinancialNeedsCalculator";

const solutions = [
  { title: "Final Expense", text: "Explore coverage designed to help loved ones manage funeral and other end-of-life expenses.", href: "/final-expense", number: "01", featured: true },
  { title: "Term Life", text: "Learn about coverage for a chosen period, including years when family or financial responsibilities are highest.", href: "/term-life", number: "02" },
  { title: "Whole Life", text: "Understand permanent coverage, premiums, cash value and the policy details worth reviewing.", href: "/whole-life", number: "03" },
  { title: "Mortgage Protection", text: "Explore ways life insurance might help your family manage a remaining home loan.", href: "/life-insurance", number: "04" },
  { title: "Health & ACA", text: "Review health coverage categories and questions to discuss with a properly licensed professional.", href: "/quote", number: "05" },
  { title: "Medicare", text: "Find general information and request guidance about Medicare-related options.", href: "/quote", number: "06" },
  { title: "Auto & Home", text: "Ask about property and vehicle coverage options available in your state.", href: "/quote", number: "07" },
  { title: "Credit & Debt Support", text: "Explore information and request a conversation about credit repair or debt relief services.", href: "/quote", number: "08" },
];

const planningTools = [
  ["Coverage calculator", "Estimate a potential coverage gap by comparing financial needs with resources already available.", "/calculator"],
  ["How it works", "Understand the steps from an initial conversation through an insurer's application process.", "/how-it-works"],
  ["Beneficiary support", "Find guidance on claims, beneficiary updates and policy-related next steps.", "/beneficiary-services"],
];

export default function PublicHome() {
  return (
    <>
      <section className="an-hero">
        <div className="wrap an-hero-grid">
          <div className="an-hero-copy">
            <p className="eyebrow">INSURANCE GUIDANCE, BUILT AROUND YOU</p>
            <h1>Protect what matters.<br /><em>Plan for what’s next.</em></h1>
            <p className="an-hero-lead">Explore life insurance and other coverage options with clear information, practical planning tools and personal guidance from Alpha Nation.</p>
            <div className="an-hero-actions">
              <Link className="button" href="/quote">Explore coverage options <span aria-hidden="true">↗</span></Link>
              <Link className="an-text-button" href="/calculator">Calculate your coverage needs</Link>
            </div>
            <div className="an-trust-line"><span>People-first guidance</span><i /><span>Carrier options to compare</span><i /><span>Support at every stage</span></div>
          </div>
          <div className="an-hero-visual">
            <div className="an-hero-photo" role="img" aria-label="A family spending time together outdoors" />
            <div className="an-hero-caption"><span className="an-caption-monogram">AN</span><span><b>For the people who matter</b><small>Thoughtful choices start here</small></span></div>
          </div>
        </div>
      </section>

      <section className="an-proof-strip">
        <div className="wrap an-proof-inner">
          <span><b>01</b> Understand your options</span>
          <span><b>02</b> Compare important details</span>
          <span><b>03</b> Choose your next step</span>
          <span>Guidance without pressure</span>
        </div>
      </section>

      <section className="section an-tools-section" id="planning">
        <div className="wrap">
          <div className="section-heading an-heading-row">
            <div><p className="eyebrow">A CLEARER PLACE TO START</p><h2>Life insurance, made easier to understand.</h2></div>
            <p className="lead">Start with what matters to you. Learn the basics, explore the numbers and connect with a professional when you’re ready.</p>
          </div>
          <div className="an-tool-grid">
            {planningTools.map(([title, text, href], index) => <article className="an-tool-card" key={title}>
              <span className="an-tool-index">0{index + 1} / GUIDE</span><h3>{title}</h3><p>{text}</p><Link href={href}>Explore <span aria-hidden="true">↗</span></Link>
            </article>)}
          </div>
        </div>
      </section>

      <section className="section an-solutions-section" id="insurance">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">COVERAGE & SERVICES</p><h2>Explore protection for different parts of life.</h2><p className="lead">Learn about the options, compare the details and ask about availability in your state. Product access and eligibility depend on the carrier and your circumstances.</p></div>
          <div className="an-solution-grid">
            {solutions.map((item) => <article className={`an-solution-card ${item.number === "01" ? "is-featured" : ""}`} key={item.title}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><Link href={item.href}>Learn more <span aria-hidden="true">↗</span></Link></article>)}
          </div>
        </div>
      </section>

      <section className="section an-calculator-section" id="financial-needs">
        <div className="wrap">
          <div className="an-calculator-intro">
            <p className="eyebrow">PLAN WITH A CLEARER PICTURE</p>
            <h2>How much life insurance might your family need?</h2>
            <p>Estimate financial responsibilities such as a mortgage, debts, income replacement, education and final expenses. Then subtract savings, investments and existing coverage. This tool is an educational estimate, not a quote or recommendation.</p>
            <Link className="an-inline-link" href="/calculator">Open the full calculator ↗</Link>
          </div>
          <FinancialNeedsCalculator />
        </div>
      </section>

      <section className="section an-beneficiary-section" id="beneficiary-services">
        <div className="wrap an-beneficiary-grid">
          <div className="an-beneficiary-photo" role="img" aria-label="A woman in a warm natural portrait" />
          <div>
            <p className="eyebrow">HERE FOR THE NEXT STEP</p>
            <h2>Support for policyholders and beneficiaries.</h2>
            <p>If you have a question about an existing policy, a beneficiary update or a claim, start with the issuing carrier. Alpha Nation can help direct you to the appropriate next step.</p>
            <Link className="button" href="/beneficiary-services">Explore beneficiary support</Link>
            <p className="an-small-note">Claims decisions, policy status and benefit payments are determined by the issuing insurance carrier under the policy terms.</p>
          </div>
        </div>
      </section>

      <section className="section an-about-section" id="about">
        <div className="wrap an-about-grid">
          <div><p className="eyebrow">ABOUT ALPHA NATION</p><h2>Better questions lead to more informed decisions.</h2></div>
          <div><p>Alpha Nation connects individuals and families with insurance information and professionals who can help explain available options. Our focus is helping people understand the details before deciding whether to apply.</p><p>Carrier appointments, product availability, licensing, eligibility and policy terms are confirmed for each state and situation. We do not promise that every product is available everywhere.</p><Link className="an-inline-link" href="/contact">Talk with Alpha Nation <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section className="section an-carriers-section" id="carriers">
        <div className="wrap">
          <div className="an-carriers-heading"><div><p className="eyebrow">CARRIER RELATIONSHIPS</p><h2>Compare options from carrier partners.</h2></div><p>Our directory displays carriers currently marked active in our system. A listing does not guarantee product availability or appointment authority in your state.</p></div>
          <PublicCarriers />
          <Link className="an-inline-link" href="/carriers">Carrier information and availability <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="section an-process-section" id="how-it-works">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">HOW IT WORKS</p><h2>Three steps to a more informed choice.</h2><p className="lead">A simple path from your first question to understanding the insurer’s formal application process.</p></div>
          <div className="an-process-grid">
            <article><b>01</b><h3>Tell us what matters</h3><p>Share your state, age range and the type of protection you are exploring. Never submit sensitive identity or medical records through this website.</p></article>
            <article><b>02</b><h3>Review available options</h3><p>A properly licensed professional checks relevant requirements and explains the products and carriers they are authorized to discuss.</p></article>
            <article><b>03</b><h3>Decide what comes next</h3><p>If you choose to continue, the insurer’s formal application and underwriting process determines eligibility and final terms.</p></article>
          </div>
          <Link className="an-inline-link" href="/how-it-works">See the full process ↗</Link>
        </div>
      </section>

      <section className="section an-faq-teaser"><div className="wrap an-faq-teaser-inner"><div><p className="eyebrow">QUESTIONS BEFORE YOU START?</p><h2>Understand the details that matter.</h2><p>Get clear answers about coverage, underwriting, beneficiaries and what happens after you apply.</p></div><Link className="button" href="/faq">Browse insurance FAQs ↗</Link></div></section>

      <section className="an-help-section" id="help">
        <div className="wrap an-help-inner"><div><p className="eyebrow">START A CONVERSATION</p><h2>Have a question? We’re here to help.</h2><p>For coverage questions, beneficiary support or help finding the right next step, contact Alpha Nation.</p></div><div className="an-hero-actions"><Link className="button button-light" href="/contact">Contact our team</Link><Link className="an-text-button" href="/quote">Request information</Link></div></div>
      </section>
    </>
  );
}