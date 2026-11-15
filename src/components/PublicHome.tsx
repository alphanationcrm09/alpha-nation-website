import Link from "next/link";
import PublicCarriers from "@/components/PublicCarriers";
import FinancialNeedsCalculator from "@/components/FinancialNeedsCalculator";

const solutions = [
  { title: "Life Insurance", text: "Explore term and permanent life insurance options for the people who depend on you.", href: "/quote", number: "01" },
  { title: "Final Expense", text: "Understand coverage designed to help prepare for funeral and end-of-life expenses.", href: "/quote", number: "02" },
  { title: "Mortgage Protection", text: "Consider how life insurance could support your household if the unexpected happens.", href: "/quote", number: "03" },
  { title: "Health & Medicare", text: "Get guidance on individual, family, ACA and Medicare-related coverage options.", href: "/quote", number: "04" },
];

const planningTools = [
  ["Life insurance needs", "Estimate a coverage amount using your family's financial responsibilities and resources.", "#financial-needs"],
  ["Coverage conversation", "Prepare questions and request a discussion with an insurance professional.", "/quote"],
  ["Beneficiary support", "Find help with beneficiary questions and policy-related next steps.", "#beneficiary-services"],
];

export default function PublicHome() {
  return (
    <>
      <section className="an-hero">
        <div className="wrap an-hero-grid">
          <div className="an-hero-copy">
            <p className="eyebrow">THOUGHTFUL INSURANCE GUIDANCE</p>
            <h1>Protect what matters.<br /><em>Plan for what’s next.</em></h1>
            <p className="an-hero-lead">Clear information and personal guidance to help individuals and families explore insurance options at every stage of life.</p>
            <div className="an-hero-actions">
              <Link className="button" href="/quote">Explore insurance options <span aria-hidden="true">↗</span></Link>
              <Link className="an-text-button" href="#financial-needs">Calculate your needs</Link>
            </div>
            <div className="an-trust-line"><span>People-first guidance</span><i /><span>Multiple carrier options</span><i /><span>Support at every stage</span></div>
          </div>
          <div className="an-hero-visual">
            <div className="an-hero-photo" role="img" aria-label="A multigenerational family spending time together" />
            <div className="an-hero-caption"><span className="an-caption-monogram">AN</span><span><b>For every generation</b><small>Guidance built around real life</small></span></div>
          </div>
        </div>
      </section>

      <section className="an-intro-band">
        <div className="wrap an-intro-band-inner">
          <p className="eyebrow">ALPHA NATION</p>
          <h2>Make informed decisions with a clearer view of your options.</h2>
          <p>Insurance is personal. We help you understand the questions, compare available options and connect with a professional for the next step.</p>
        </div>
      </section>

      <section className="section an-tools-section" id="planning">
        <div className="wrap">
          <div className="section-heading an-heading-row">
            <div><p className="eyebrow">PLANNING & TOOLS</p><h2>Start with what you need to know.</h2></div>
            <p className="lead">Useful starting points for understanding your coverage, planning ahead and getting support.</p>
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
            <p>Alpha Nation’s needs-based approach starts with the money your family might need and subtracts resources already available. Consider mortgage balances, debts, future living expenses, education costs and final expenses, then account for savings, investments and existing life insurance.</p>
          </div>
          <FinancialNeedsCalculator />
        </div>
      </section>

      <section className="section an-solutions-section" id="insurance">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">INSURANCE SOLUTIONS</p><h2>Coverage conversations for every stage of life.</h2><p className="lead">Explore the categories below. Products, eligibility and availability vary by carrier and state.</p></div>
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
            <p>If you are a policyholder or beneficiary and need help understanding the next steps, contact our team. We can help direct your inquiry and explain where to request policy or claims information.</p>
            <Link className="button" href="/contact">Get assistance</Link>
            <p className="an-small-note">Claims decisions and benefit payments are determined by the issuing insurance carrier under the policy terms.</p>
          </div>
        </div>
      </section>

      <section className="section an-about-section" id="about">
        <div className="wrap an-about-grid">
          <div><p className="eyebrow">ABOUT ALPHA NATION</p><h2>A more considered way to explore insurance.</h2></div>
          <div><p>Alpha Nation is an insurance brokerage connected with a range of insurance carriers and a wider network of insurance agents and professionals. We help individuals and families explore life, health and senior-related coverage information and request conversations about options that fit their circumstances.</p><p>Carrier appointments, product availability, licensing, eligibility and policy terms are confirmed for each state and situation. We do not promise that every product is available everywhere.</p><Link className="an-inline-link" href="/contact">Talk with Alpha Nation <span aria-hidden="true">↗</span></Link></div>
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
            <article><b>01</b><h3>Tell us what matters</h3><p>Share your state and the type of coverage or support you are looking for.</p></article>
            <article><b>02</b><h3>Review the possibilities</h3><p>Our team checks relevant requirements and helps direct your inquiry.</p></article>
            <article><b>03</b><h3>Choose your next step</h3><p>An appropriately licensed professional can explain available options if you decide to continue.</p></article>
          </div>
        </div>
      </section>

      <section className="an-help-section" id="help">
        <div className="wrap an-help-inner"><div><p className="eyebrow">HERE WHEN YOU NEED US</p><h2>Have a question? Start a conversation.</h2><p>For coverage questions, beneficiary support or help finding the right next step, contact Alpha Nation.</p></div><div className="an-hero-actions"><Link className="button button-light" href="/contact">Contact our team</Link><Link className="an-text-button" href="/quote">Request an appointment</Link></div></div>
      </section>
    </>
  );
}
