import Link from "next/link";
import QuoteJourney from "@/components/QuoteJourney";
import FinancialNeedsCalculator from "@/components/FinancialNeedsCalculator";

const solutions = [
  { title: "Life Insurance", text: "Understand the main types of life insurance and what to consider before choosing a policy.", href: "/life-insurance", number: "01" },
  { title: "Final Expense", text: "Learn how final expense coverage works and what beneficiaries should know.", href: "/final-expense", number: "02" },
  { title: "Term Life", text: "Explore coverage for a set period, often while raising a family or paying down a mortgage.", href: "/term-life", number: "03" },
  { title: "Whole Life", text: "Learn about lifelong coverage, premiums, cash value and the details to review.", href: "/whole-life", number: "04" },
];

const planningTools = [
  ["How it works", "See what happens when you ask about coverage and decide whether to apply.", "/how-it-works"],
  ["Beneficiary support", "Find guidance on contacting the issuing carrier and preparing for next steps.", "/beneficiary-services"],
  ["Insurance FAQs", "Get straightforward answers to common questions about coverage and applications.", "/faq"],
];

export default function PublicHome() {
  return (
    <>
      <section className="an-hero an-hero-reference">
        <div className="wrap an-hero-grid">
          <div className="an-hero-copy">
            <p className="eyebrow">ALPHA NATION · INSURANCE GUIDANCE</p>
            <h1>Insurance Guide <em>Without the Guesswork</em></h1>
            <p className="an-hero-lead">Get clear answers. Compare coverage options. Find the right next step for your needs with straightforward life insurance guidance.</p>
            <div className="an-hero-points">
              <span><b aria-hidden="true">✓</b> Trusted Coverage</span>
              <span><b aria-hidden="true">↗</b> Quick Quotes</span>
              <span><b aria-hidden="true">✦</b> Expert Support</span>
            </div>
          </div>
          <div className="an-hero-visual an-hero-quote-visual">
            <div className="an-hero-form-heading"><h2>Get Your Free Quote</h2><p>Find the right life insurance options for you.</p></div>
            <QuoteJourney />
          </div>
        </div>
      </section>

      <section className="section an-calculator-section" id="financial-needs">
        <div className="wrap">
          <div className="an-calculator-intro">
            <p className="eyebrow">FREE COVERAGE PLANNING TOOL</p>
            <h2>Understand the coverage your family might need.</h2>
            <p>Enter the expenses your family might need to cover, then subtract savings and insurance already in place. You can change the numbers at any time and see the estimate update.</p>
            <p className="an-calculator-helper">You don’t need to enter personal details. Use the calculator as a starting point for a conversation, not as a recommendation to buy a particular amount.</p>
          </div>
          <FinancialNeedsCalculator />
        </div>
      </section>

      <section className="section an-tools-section" id="planning">
        <div className="wrap">
          <div className="section-heading an-heading-row">
            <div><p className="eyebrow">HERE TO HELP YOU GET ORIENTED</p><h2>Take the next step at your own pace.</h2></div>
            <p className="lead">Read through the basics, see how the process works or find help with an existing policy. Start wherever it makes sense for you.</p>
          </div>
          <div className="an-tool-grid">
            {planningTools.map(([title, text, href], index) => <article className="an-tool-card" key={title}>
              <span className="an-tool-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p><Link href={href}>Read more <span aria-hidden="true">↗</span></Link>
            </article>)}
          </div>
        </div>
      </section>

      <section className="section an-solutions-section" id="insurance">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">COVERAGE OPTIONS</p><h2>Different needs call for different kinds of coverage.</h2><p className="lead">Get familiar with the basics. A licensed professional can help confirm which options are available in your state and fit your circumstances.</p></div>
          <div className="an-solution-grid">
            {solutions.map((item) => <article className="an-solution-card" key={item.title}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><Link href={item.href}>Learn about this coverage <span aria-hidden="true">↗</span></Link></article>)}
          </div>
        </div>
      </section>

      <section className="section an-beneficiary-section" id="beneficiary-services">
        <div className="wrap an-beneficiary-grid">
          <div className="an-beneficiary-photo" role="img" aria-label="An adult daughter talking with an older parent" />
          <div>
            <p className="eyebrow">FOR POLICYHOLDERS & BENEFICIARIES</p>
            <h2>When you have a policy question, start here.</h2>
            <p>If you need help with a claim, a beneficiary update or another policy question, we’ll point you toward the right next step and the issuing carrier.</p>
            <Link className="button" href="/beneficiary-services">Find beneficiary support</Link>
            <p className="an-small-note">Claims decisions and benefit payments are determined by the issuing insurance carrier under the policy terms.</p>
          </div>
        </div>
      </section>

      <section className="section an-about-section" id="about">
        <div className="wrap an-about-grid">
          <div><p className="eyebrow">ABOUT ALPHA NATION</p><h2>Clear insurance information. Real guidance when you need it.</h2></div>
          <div><p>Insurance decisions are personal. Alpha Nation helps individuals and families explore coverage information, understand the questions worth asking and connect with a professional for guidance.</p><p>We’ll confirm licensing, carrier appointments, product availability, eligibility and policy terms for the relevant state and situation. Not every product is available everywhere.</p><Link className="an-inline-link" href="/contact">Contact Alpha Nation <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section className="section an-process-section" id="how-it-works">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">WHAT HAPPENS NEXT</p><h2>A simple process, with room for your questions.</h2></div>
          <div className="an-process-grid">
            <article><b>01</b><h3>Tell us what you’re looking for</h3><p>Share a few basics, such as your state and the kind of coverage you have in mind.</p></article>
            <article><b>02</b><h3>Talk through the options</h3><p>A properly licensed professional can explain relevant options and answer your questions.</p></article>
            <article><b>03</b><h3>Decide whether to continue</h3><p>If you choose to apply, the insurer reviews the application and determines eligibility and final terms.</p></article>
          </div>
          <Link className="an-inline-link" href="/how-it-works">See how it works <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="section an-faq-teaser"><div className="wrap an-faq-teaser-inner"><div><p className="eyebrow">QUESTIONS ARE WELCOME</p><h2>It’s okay if you’re still figuring things out.</h2><p>Browse straightforward answers about coverage, applications, underwriting and what happens after you apply.</p></div><Link className="button" href="/faq">Read the FAQs <span aria-hidden="true">↗</span></Link></div></section>

      <section className="an-help-section" id="help">
        <div className="wrap an-help-inner"><div><p className="eyebrow">PREFER TO SPEAK WITH SOMEONE?</p><h2>Let’s talk about what you need.</h2><p>Request a free conversation with Alpha Nation. Tell us a little about your question and a team member will contact you to confirm the next step.</p></div><div className="an-hero-actions"><Link className="button button-light" href="/request-appointment">Request a Free Appointment</Link><Link className="an-text-button" href="/contact">Send us a message</Link></div></div>
      </section>
    </>
  );
}
