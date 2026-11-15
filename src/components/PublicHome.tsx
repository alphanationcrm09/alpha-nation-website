import Link from "next/link";
import PublicCarriers from "@/components/PublicCarriers";

const products = [
  ["Final Expense Insurance", "Explore life insurance options intended to help families prepare for funeral and end-of-life expenses."],
  ["Whole Life Insurance", "Learn about permanent life insurance and the policy features available from different carriers."],
  ["Term Life Insurance", "Explore protection for a selected period, based on your needs and eligibility."],
  ["Mortgage Protection", "Discuss life insurance options that could help protect your household's financial plans."],
  ["Health Insurance", "Explore individual and family health coverage options."],
  ["Medicare", "Get help understanding Medicare-related coverage options and enrollment considerations."],
  ["ACA Health Insurance", "Learn about individual and family plans available through the ACA marketplace."],
  ["Auto & Home", "Ask about options for protecting your vehicle and property."],
  ["Supplemental Coverage", "Explore additional coverage options that may complement existing insurance."],
  ["Credit & Debt Services", "Request information about available services and review all terms before proceeding."]
] as const;

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
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"]
] as const;

const audiences = [
  { title: "Starting out", subtitle: "Young adults", copy: "Understand the basics and explore coverage as your priorities, career and family plans take shape.", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85", alt: "Young adults spending time together outdoors" },
  { title: "Building a family", subtitle: "Adults & families", copy: "Compare ways to think about protecting the people, responsibilities and plans that matter to your household.", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=85", alt: "Parents spending time with their children" },
  { title: "Planning ahead", subtitle: "Older adults", copy: "Explore life, Final Expense and Medicare-related information with a professional who can explain the details.", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=85", alt: "Older couple enjoying time together" }
] as const;

export default function PublicHome() {
  return (
    <>
      <section className="an-hero">
        <div className="an-hero-copy">
          <p className="eyebrow">INSURANCE GUIDANCE FOR REAL LIFE</p>
          <h1>Coverage conversations for <em>every stage of life.</em></h1>
          <p className="an-hero-lead">Whether you're starting out, raising a family or planning for the years ahead, Alpha Nation helps you explore insurance options and connect with a professional for the next step.</p>
          <div className="an-hero-actions">
            <Link className="button" href="/quote">Explore your options <span aria-hidden="true">→</span></Link>
            <Link className="an-text-button" href="/contact">Talk with our team</Link>
          </div>
          <div className="an-trust-line"><span>Independent guidance</span><i /> <span>Carrier choice</span><i /> <span>People-first support</span></div>
        </div>
        <div className="an-hero-visual">
          <div className="an-hero-photo" role="img" aria-label="A multigenerational family spending time together" />
          <div className="an-photo-caption"><span className="an-caption-mark">AN</span><span><b>Protection is personal.</b><small>Start with a conversation.</small></span></div>
        </div>
      </section>

      <section className="an-intro-strip">
        <div className="wrap an-intro-grid">
          <div><p className="eyebrow">WELCOME TO ALPHA NATION</p><h2>Good decisions start with clear information.</h2></div>
          <p>Insurance can look different at every age and life stage. We help you understand the questions to ask, explore carrier options and find an appropriate next step without pressure.</p>
        </div>
      </section>

      <section className="section an-audience-section" id="about">
        <div className="wrap">
          <div className="section-heading an-heading-centered"><p className="eyebrow">HERE FOR YOUR NEXT CHAPTER</p><h2>Different lives. Different priorities.</h2><p className="lead">The right conversation begins with where you are today.</p></div>
          <div className="an-audience-grid">
            {audiences.map((person) => <article className="an-audience-card" key={person.title}>
              <div className="an-audience-image" role="img" aria-label={person.alt} style={{ backgroundImage: `url("${person.image}")` }} />
              <div className="an-audience-copy"><span>{person.subtitle}</span><h3>{person.title}</h3><p>{person.copy}</p><Link href="/quote">Explore coverage <span aria-hidden="true">↗</span></Link></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="section an-about-section">
        <div className="wrap an-about-grid">
          <div className="an-about-photo" role="img" aria-label="An insurance professional speaking with a customer" />
          <div className="an-about-copy">
            <p className="eyebrow">ABOUT ALPHA NATION</p>
            <h2>More than a policy. A clearer way to compare.</h2>
            <p>Alpha Nation is an insurance brokerage affiliated with more than 40 insurance carriers and connected to a wider network of insurance agents and professionals.</p>
            <p>We help individuals and families explore life, health, senior and other insurance-related services, understand the next steps and connect with professionals who can discuss products available for their state and needs.</p>
            <p>Recommendations, applications and policy decisions remain subject to carrier rules, eligibility, state requirements and professional licensing.</p>
            <Link className="an-inline-link" href="/agents">How professional coordination works <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="section an-products-section" id="products">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">OUR PRODUCTS & SERVICES</p><h2>Explore the coverage you're looking for.</h2><p className="lead">Start with a category. A licensed professional can explain the products, terms and availability that apply to your situation.</p></div>
          <div className="an-product-grid">
            {products.map(([name, description], index) => <article className="an-product-card" key={name}><span className="an-product-number">{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{description}</p><Link href="/quote">Learn more <span aria-hidden="true">↗</span></Link></article>)}
          </div>
        </div>
      </section>

      <section className="section an-carriers-section" id="carriers">
        <div className="wrap">
          <div className="an-carriers-heading"><div><p className="eyebrow">OUR CARRIER PARTNERS</p><h2>More choice. One place to start.</h2></div><p>We work with a range of insurance carriers. The directory reflects carriers currently listed as active in our system.</p></div>
          <PublicCarriers />
          <p className="directory-note">A carrier listing does not guarantee that every product is available in every state. Product availability, appointment authority and eligibility must be confirmed.</p>
          <Link className="an-inline-link" href="/carriers">View carrier information <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="section an-network-section" id="agents">
        <div className="wrap an-network-grid">
          <div><p className="eyebrow">PEOPLE FIRST</p><h2>Connect with the right professional for your request.</h2><p>Alpha Nation is connected to a wider network of agents and insurance professionals. Before an introduction, our team checks the relevant state, product and availability requirements.</p><Link className="button" href="/agents">How it works <span aria-hidden="true">→</span></Link></div>
          <div className="an-network-facts"><div><strong>40+</strong><span>Carrier relationships reported by Alpha Nation</span></div><div><strong>3,000+</strong><span>Agents and professionals in the wider network, as reported by Alpha Nation</span></div><p>Network figures are supplied by Alpha Nation and are not a statement that every professional is currently appointed or available in every state.</p></div>
        </div>
      </section>

      <section className="section an-states-section" id="states">
        <div className="wrap">
          <div className="section-heading"><p className="eyebrow">ACROSS THE UNITED STATES</p><h2>Where are you looking for coverage?</h2><p className="lead">Choose your state when you request an appointment. Our team will confirm current carrier, product and agent availability for your location.</p></div>
          <div className="an-state-grid">{states.map(([code, name]) => <Link href="/quote" className="an-state-chip" key={code}><b>{code}</b>{name}</Link>)}</div>
          <p className="directory-note">This is a state selection guide, not a representation that every product or agent is licensed or available in every state.</p>
        </div>
      </section>

      <section className="section an-how-section" id="how-it-works">
        <div className="wrap">
          <div className="section-heading an-heading-centered"><p className="eyebrow">A SIMPLE PLACE TO START</p><h2>Three steps. Your decision.</h2></div>
          <div className="an-steps-grid"><article><b>01</b><h3>Tell us what matters</h3><p>Share your state and the type of coverage or service you want to discuss.</p></article><article><b>02</b><h3>Talk it through</h3><p>Our team reviews your request and checks the relevant requirements and availability.</p></article><article><b>03</b><h3>Review your options</h3><p>If you choose to continue, an appropriately licensed professional can explain the available options.</p></article></div>
        </div>
      </section>

      <section className="an-final-cta">
        <div className="wrap an-final-cta-inner"><div><p className="eyebrow">START A CONVERSATION</p><h2>Let's talk about what matters to you.</h2><p>No pressure to proceed. Start by telling us what you want to understand.</p></div><div className="an-hero-actions"><Link className="button" href="/quote">Request an appointment <span aria-hidden="true">→</span></Link><Link className="an-text-button" href="/contact">Contact Alpha Nation</Link></div></div>
      </section>
    </>
  );
}
