import type { Metadata } from "next";
import Link from "next/link";
import PublicCarriers from "@/components/PublicCarriers";
import PublicAgents from "@/components/PublicAgents";

export const metadata: Metadata = {
  title: "Alpha Nation | Final Expense, Life & Health Insurance",
  description: "Explore Final Expense, Whole Life, Term Life, Health, Medicare, Auto and Home Insurance with Alpha Nation. Connect with carrier partners and appropriately licensed insurance professionals.",
  keywords: ["Alpha Nation", "Final Expense Insurance", "Whole Life Insurance", "Term Life Insurance", "Life Insurance", "Health Insurance", "Medicare", "Insurance Brokerage"],
  openGraph: {
    title: "Alpha Nation | Insurance Brokerage",
    description: "Explore insurance options and connect with an appropriately licensed professional through Alpha Nation.",
    type: "website",
  },
};

const products = [
  ["Final Expense Insurance","Coverage options designed to help families prepare for funeral and end-of-life expenses."],
  ["Whole Life Insurance","Explore permanent life insurance and the guarantees and features available with different policies."],
  ["Term Life Insurance","Learn about life insurance protection for a selected period of time."],
  ["Mortgage Protection","Explore ways life insurance may help protect your family's home and financial plans."],
  ["Auto Insurance","Ask about vehicle protection options and available policy features."],
  ["Health Insurance","Explore individual and family health coverage options."],
  ["Medicare","Get help understanding Medicare-related coverage options."],
  ["ACA Health Insurance","Learn about health coverage options available through the ACA marketplace."],
  ["Home Insurance","Explore options for protecting your home and property."],
  ["Credit Repair","Request information about credit review and services intended to help improve your credit profile."],
  ["Debt Relief","Discuss available debt-relief services and review their terms before proceeding."],
];

const states = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
];

export default function Home() {
  return <>
    <section className="welcome-screen">
      <div className="welcome-screen-glow" />
      <div className="wrap welcome-screen-content">
        <AlphaLogo compact />
        <p className="eyebrow">WELCOME TO</p>
        <h1>ALPHA <span>NATION</span></h1>
        <p className="welcome-quote">“Protect what matters today. Build confidence for tomorrow.”</p>
        <p className="welcome-description">Insurance guidance, carrier choices and professional support for the moments that matter.</p>
        <a className="button welcome-enter" href="#main-site">Explore Alpha Nation <span aria-hidden="true">→</span></a>
        <p className="welcome-footnote">Insurance and financial services information across the United States</p>
      </div>
      <a className="welcome-scroll" href="#main-site" aria-label="Continue to Alpha Nation website">SCROLL TO EXPLORE <span>↓</span></a>
    </section>

    <div id="main-site" className="main-site-start">
      <section className="main-intro">
        <div className="wrap main-intro-grid">
          <div><p className="eyebrow">INSURANCE. CHOICE. GUIDANCE.</p><h2>Find a path that fits <span>your needs.</span></h2></div>
          <p>Explore insurance and financial-service options, learn about our carrier relationships and request a conversation with an appropriately licensed professional.</p>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="wrap about-grid">
          <div className="about-copy">
            <p className="eyebrow">ABOUT ALPHA NATION</p>
            <h2>A brokerage built around helping people make informed choices.</h2>
            <p>Alpha Nation is an insurance brokerage affiliated with more than 40 insurance carriers and connected to a network of more than 3,000 insurance agents and professionals.</p>
            <p>We help individuals and families explore insurance options, understand the next steps and connect with professionals who can discuss products available for their state and needs.</p>
            <p>Our work spans life, health, senior, property and other financial-service categories. Every recommendation and application is handled subject to the relevant carrier rules, state requirements and professional licensing.</p>
            <Link className="text-link" href="/contact">Learn more about Alpha Nation ↗</Link>
          </div>
          <div className="about-stats">
            <article><strong>3,000+</strong><span>Agents and professionals in our network</span></article>
            <article><strong>40+</strong><span>Insurance carrier relationships</span></article>
            <article><strong>40,000+</strong><span>People helped with insurance needs each year</span></article>
            <p className="stats-note">Figures represent Alpha Nation's reported network and annual reach. Carrier, product and agent availability varies by state.</p>
          </div>
        </div>
      </section>

      <section className="section products-section" id="products">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">OUR PRODUCTS & SERVICES</p><h2>Options for different stages of life.</h2><p className="lead">From protecting your family to exploring health and financial-service options, start with the area you want to learn about.</p></div>
          <div className="card-grid product-grid">{products.map(([name,desc],i)=><article className="info-card product-card" key={name}><span className="card-index">{String(i+1).padStart(2,"0")}</span><h3>{name}</h3><p>{desc}</p><Link href="/quote">Explore this option ↗</Link></article>)}</div>
        </div>
      </section>

      <section className="section carriers-section section-alt" id="carriers">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">OUR CARRIER PARTNERS</p><h2>Choice through established carriers.</h2><p className="lead">We work with insurance carriers including Transamerica, American Amicable, Americo, Baltimore Life and other carrier partners. The directory below reflects carriers currently listed as active.</p></div>
          <PublicCarriers />
          <p className="directory-note">A carrier listing does not guarantee that every product is available in every state. Product availability, appointment authority and eligibility must be confirmed.</p>
          <Link className="text-link" href="/carriers">View carrier information ↗</Link>
        </div>
      </section>

      <section className="section agents-section" id="agents">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">OUR PROFESSIONALS</p><h2>Meet available Alpha Nation agents.</h2><p className="lead">Our wider network includes more than 3,000 agents and professionals. Featured profiles are shown only after their assigned state license records have been verified.</p></div>
          <PublicAgents />
          <p className="directory-note">Agent availability and the states each professional is authorized to serve are subject to confirmation when an appointment is requested.</p>
        </div>
      </section>

      <section className="section states-section section-alt" id="states">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">ACROSS THE UNITED STATES</p><h2>Tell us where you need coverage.</h2><p className="lead">Select your state when requesting an appointment. Our team will check current carrier, product and agent availability for your location.</p></div>
          <div className="state-grid">{states.map(([code,name])=><Link href="/quote" className="state-chip" key={code}><span>{code}</span>{name}</Link>)}</div>
          <p className="directory-note">This list is a state selection guide, not a representation that every product or agent is licensed or available in every state.</p>
        </div>
      </section>

      <section className="section needs-section" id="needs">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">HOW CAN WE HELP?</p><h2>What do you need help with?</h2><p className="lead">Choose a service or tell us what you are looking for. Our team will help coordinate the next step.</p></div>
          <div className="needs-grid">
            <Link href="/quote"><strong>Life & Final Expense</strong><span>Explore protection for your family and loved ones ↗</span></Link>
            <Link href="/quote"><strong>Health & Medicare</strong><span>Discuss health coverage and Medicare options ↗</span></Link>
            <Link href="/quote"><strong>Auto & Home</strong><span>Ask about protecting your vehicle and property ↗</span></Link>
            <Link href="/quote"><strong>Credit Repair</strong><span>Request information about credit services ↗</span></Link>
            <Link href="/quote"><strong>Debt Relief</strong><span>Learn about available debt-relief services ↗</span></Link>
            <Link href="/contact"><strong>Something else?</strong><span>Send our team a question or inquiry ↗</span></Link>
          </div>
        </div>
      </section>

      <section className="section how-section section-alt" id="how-it-works">
        <div className="wrap"><div className="section-heading"><p className="eyebrow">HOW IT WORKS</p><h2>Clear steps. Your decision.</h2></div>
          <div className="steps-grid">
            <article><b>01</b><h3>Tell us what you need</h3><p>Share your contact details, state and the service you want to discuss.</p></article>
            <article><b>02</b><h3>Speak with our team</h3><p>We review your request and check the relevant state and product requirements.</p></article>
            <article><b>03</b><h3>Review your options</h3><p>If you choose to continue, we coordinate with an appropriately licensed professional.</p></article>
          </div>
        </div>
      </section>

      <section className="closing-cta"><div className="wrap cta-row"><div><p className="eyebrow">START HERE</p><h2>Let's talk about what matters to you.</h2><p>Request an appointment or send Alpha Nation a question.</p></div><div className="actions"><Link className="button" href="/quote">Book an appointment</Link><Link className="button button-secondary" href="/contact">Contact us</Link></div></div></section>
    </div>
  </>;
}
