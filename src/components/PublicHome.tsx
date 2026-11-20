import Link from "next/link";
import PublicCarriers from "@/components/PublicCarriers";
import QuoteJourney from "@/components/QuoteJourney";
import FinancialNeedsCalculator from "@/components/FinancialNeedsCalculator";

const solutions = [
  { title: "Life Insurance", text: "Explore protection options for the people who depend on you, and understand how coverage fits your family's plans.", href: "/life-insurance", number: "01" },
  { title: "Final Expense", text: "Learn about coverage designed to help beneficiaries manage funeral and end-of-life expenses.", href: "/final-expense", number: "02" },
  { title: "Term Life", text: "Consider coverage for a defined period while you manage a mortgage, raise a family or replace income.", href: "/term-life", number: "03" },
  { title: "Whole Life", text: "Understand permanent coverage, premiums, cash value and the policy details worth reviewing.", href: "/whole-life", number: "04" },
];

const planningTools = [
  ["Coverage calculator", "Estimate a potential coverage gap by comparing financial needs with available resources.", "/calculator"],
  ["How it works", "Understand the steps from an initial conversation through an insurer's application process.", "/how-it-works"],
  ["Beneficiary support", "Find guidance on claims, beneficiary updates and policy-related next steps.", "/beneficiary-services"],
];

export default function PublicHome() {
  return (
    <>
      <section className="an-hero">
        <div className="wrap an-hero-grid">
          <div className="an-hero-copy">
            <p className="eyebrow">THOUGHTFUL INSURANCE GUIDANCE</p>
            <h1>Protect what matters.<br /><em>Plan for what’s next.</em></h1>
            <p className="an-hero-lead">Clear information, useful planning tools and personal guidance to help you explore life insurance options with confidence.</p>
            <div className="an-hero-actions">
              <Link className="button" href="/quote">Get My Free Quote <span aria-hidden="true">↗</span></Link>
              <Link className="an-text-button" href="/request-appointment">Book a Call</Link>
            </div>
            <div className="an-trust-line"><span>People-first guidance</span><i /><span>State-specific availability</span><i /><span>No obligation to apply</span></div>
          </div>
          <div className="an-hero-visual an-hero-quote-visual"><QuoteJourney /></div>
        </div>
      </section>

      <section className="an-intro-band">
        <div className="wrap an-intro-band-inner">
          <p className="eyebrow">ALPHA NATION</p>
          <h2>Make informed decisions with a clearer view of your options.</h2>
          <p>Insurance is personal. Start with your priorities, understand the details and connect with a professional for the next step.</p>
        </div>
      </section>

      <section className="section an-tools-section" id="planning">
        <div className="wrap">
          <div className="section-heading an-heading-row">
            <div><p className="eyebrow">PLANNING & TOOLS</p><h2>Useful guidance before you choose.</h2></div>
            <p className="lead">Explore your coverage needs, learn how the process works and find support for an existing policy.</p>
          </div>
          <div className="an-tool-grid">
            {planningTools.map(([title, text, href], index) => <article className="an-tool-card" key={title}>
              <span className="an-tool-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p><Link href={href}>Explore <span aria-hidden="true">↗</span></Link>
            </article>)}
          </div>
        </div>
      </section>

      <section className="section an-calculator-section" id="financial-needs">
        <div className="wrap">
          <div className="an-calculator-intro">
            <p className="eyebrow">FINANCIAL NEEDS CALCULATOR</p>
            <h2>How much life insurance might your family need?</h2>
            <p>Start with the money your family might need and subtract resources already available. Consider mortgage balances, debts, future living expenses, education costs and final expenses, then account for savings, investments and existing life insurance.</p>
            <Link className="an-inline-link" href="/calculator">Open the full calculator ↗</Link>
          </div>
          <FinancialNeedsCalculator />
        </div>
      </section>

      <section className="section an-solutions-section" id="insurance">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">INSURANCE SOLUTIONS</p><h2>Explore protection for different needs.</h2><p className="lead">Learn the basics, compare policy features and ask about options available in your state.</p></div>
          <div className="an-solution-grid">
            {solutions.map((item) => <article className="an-solution-card" key={item.title}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><Link href={item.href}>Learn more <span aria-hidden="true">↗</span></Link></article>)}
          </div>
        </div>
      </section>

      <section className="section an-beneficiary-section" id="beneficiary-services">
        <div className="wrap an-beneficiary-grid">
          <div className="an-beneficiary-photo" role="img" aria-label="An adult daughter talking with an older parent" />
          <div>
            <p className="eyebrow">BENEFICIARY SERVICES</p>
            <h2>Help when a policy question matters most.</h2>
            <p>If you are a policyholder or beneficiary and need help understanding the next steps, find out how to contact the issuing carrier and what information to prepare.</p>
            <Link className="button" href="/beneficiary-services">Explore beneficiary support</Link>
            <p className="an-small-note">Claims decisions and benefit payments are determined by the issuing insurance carrier under the policy terms.</p>
          </div>
        </div>
      </section>

      <section className="section an-about-section" id="about">
        <div className="wrap an-about-grid">
          <div><p className="eyebrow">ABOUT ALPHA NATION</p><h2>A more considered way to explore insurance.</h2></div>
          <div><p>Alpha Nation connects individuals and families with insurance information and professionals who can help explain available options. Our focus is helping people ask better questions and understand the details before deciding whether to apply.</p><p>Carrier appointments, product availability, licensing, eligibility and policy terms are confirmed for each state and situation. We do not promise that every product is available everywhere.</p><Link className="an-inline-link" href="/contact">Talk with Alpha Nation <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section className="section an-carriers-section" id="carriers">
        <div className="wrap">
          <div className="an-carriers-heading"><div><p className="eyebrow">CARRIER RELATIONSHIPS</p><h2>Explore options from carrier partners.</h2></div><p>Our directory displays carriers currently marked active in our system. A listing does not guarantee product availability or appointment authority in your state.</p></div>
          <PublicCarriers />
          <Link className="an-inline-link" href="/carriers">Carrier information and availability <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="section an-process-section" id="how-it-works">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">HOW IT WORKS</p><h2>A straightforward place to begin.</h2></div>
          <div className="an-process-grid">
            <article><b>01</b><h3>Tell us what matters</h3><p>Share your state, age range and the type of protection you are exploring.</p></article>
            <article><b>02</b><h3>Review the possibilities</h3><p>A professional checks relevant requirements and explains available options.</p></article>
            <article><b>03</b><h3>Choose your next step</h3><p>If you decide to continue, the insurer's formal application and underwriting process determines eligibility.</p></article>
          </div>
          <Link className="an-inline-link" href="/how-it-works">See the full process ↗</Link>
        </div>
      </section>

      <section className="section an-faq-teaser"><div className="wrap an-faq-teaser-inner"><div><p className="eyebrow">QUESTIONS BEFORE YOU START?</p><h2>Understand the details that matter.</h2><p>Get clear answers about coverage, underwriting, beneficiaries and what happens after you apply.</p></div><Link className="button" href="/faq">Browse insurance FAQs ↗</Link></div></section>

      <section className="an-help-section" id="help">
        <div className="wrap an-help-inner"><div><p className="eyebrow">HERE WHEN YOU NEED US</p><h2>Have a question? Start a conversation.</h2><p>For coverage questions, beneficiary support or help finding the right next step, contact Alpha Nation.</p></div><div className="an-hero-actions"><Link className="button button-light" href="/contact">Contact our team</Link><Link className="an-text-button" href="/request-appointment">Book a Call</Link></div></div>
      </section>
    </>
  );
}
