import Link from "next/link";

const services = [
  { n: "01", title: "Telemarketing", text: "Outbound calling support built around your campaign goals, audience and operating process." },
  { n: "02", title: "Customer Support", text: "Professional customer communication across the key stages of your customer journey." },
  { n: "03", title: "Sales Outsourcing", text: "Dedicated sales support to help your business manage conversations and grow consistently." },
  { n: "04", title: "Lead Generation", text: "Structured prospect outreach and lead qualification aligned with your target market." },
  { n: "05", title: "Appointment Setting", text: "Qualified appointment-setting support that keeps your pipeline moving." },
  { n: "06", title: "Staffing & Team Support", text: "Campaign-focused teams with onboarding, training and ongoing operational support." },
];

const industries = ["Final Expense", "Medicare", "ACA", "Auto", "Solar", "Debt Relief", "Real Estate", "Credit Repair", "Roofing"];

export default function PublicHome() {
  return (
    <>
      <section className="an-bpo-hero">
        <div className="wrap an-bpo-hero-grid">
          <div className="an-bpo-copy">
            <p className="an-bpo-eyebrow">ALPHA NATION · BUSINESS PROCESS OUTSOURCING</p>
            <h1>People-powered conversations. <span>Business growth.</span></h1>
            <p className="an-bpo-lead">We help businesses build stronger customer connections through telemarketing, customer support and sales operations delivered by trained teams in Pakistan.</p>
            <div className="an-bpo-actions">
              <Link className="an-bpo-button" href="/contact">Discuss Your Campaign <span>↗</span></Link>
              <a className="an-bpo-textlink" href="https://wa.me/923165573057" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            </div>
            <div className="an-bpo-proof"><span>Campaign-focused teams</span><i /><span>Training & quality support</span><i /><span>Flexible operations</span></div>
          </div>
          <div className="an-bpo-visual">
            <div className="an-bpo-visual-glow" />
            <div className="an-bpo-visual-card">
              <div className="an-bpo-card-top"><span className="an-bpo-live-dot" /> ALPHA NATION OPERATIONS</div>
              <div className="an-bpo-orbit"><div className="an-bpo-core">AN</div><span className="an-bpo-node an-bpo-node-one">SALES</span><span className="an-bpo-node an-bpo-node-two">SUPPORT</span><span className="an-bpo-node an-bpo-node-three">LEADS</span></div>
              <div className="an-bpo-visual-caption"><b>One team. Clear objectives.</b><span>Focused on every customer interaction.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="an-bpo-intro"><div className="wrap an-bpo-intro-grid"><p className="an-bpo-eyebrow">YOUR OUTSOURCING PARTNER</p><h2>Build a team that keeps your business moving.</h2><p>From first contact to ongoing customer support, Alpha Nation provides practical operational support shaped around your campaign requirements.</p></div></section>

      <section className="an-bpo-section" id="services"><div className="wrap">
        <div className="an-bpo-section-head"><div><p className="an-bpo-eyebrow">WHAT WE DO</p><h2>Services built around your goals.</h2></div><p>Bring us your campaign objectives. We’ll discuss the workflow, team requirements and support needed to move forward.</p></div>
        <div className="an-bpo-service-grid">{services.map(s=><article className="an-bpo-service" key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></article>)}</div>
      </div></section>

      <section className="an-bpo-industries" id="industries"><div className="wrap an-bpo-industries-grid"><div><p className="an-bpo-eyebrow">CAMPAIGN EXPERIENCE</p><h2>Support across multiple industries.</h2><p>Our teams support campaign operations across a range of sectors. Scope, compliance requirements and staffing are discussed before launch.</p><Link className="an-bpo-button" href="/contact">Talk About Your Industry <span>↗</span></Link></div><div className="an-bpo-industry-list">{industries.map((item,i)=><div key={item}><span>0{i+1}</span><b>{item}</b><span>↗</span></div>)}</div></div></section>

      <section className="an-bpo-approach" id="approach"><div className="wrap"><div className="an-bpo-section-head"><div><p className="an-bpo-eyebrow">HOW WE WORK</p><h2>A clear process from first call to launch.</h2></div><p>We align the team and workflow with your expectations before campaign activity begins.</p></div><div className="an-bpo-steps"><article><b>01</b><h3>Understand</h3><p>We learn about your business, audience, campaign goals and operating requirements.</p></article><article><b>02</b><h3>Prepare</h3><p>We align staffing, training, scripts and quality expectations with the agreed scope.</p></article><article><b>03</b><h3>Operate & improve</h3><p>We support day-to-day campaign activity and review performance with your team.</p></article></div></div></section>

      <section className="an-bpo-contact" id="contact"><div className="wrap an-bpo-contact-inner"><div><p className="an-bpo-eyebrow">LET’S TALK BUSINESS</p><h2>Tell us what you’re building.</h2><p>Share your campaign requirements and the Alpha Nation team will follow up to discuss the next steps.</p></div><div className="an-bpo-contact-actions"><Link className="an-bpo-button an-bpo-button-light" href="/contact">Contact Alpha Nation <span>↗</span></Link><a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a><a href="https://wa.me/923165573057" target="_blank" rel="noreferrer">+92 316 5573057 · WhatsApp</a></div></div></section>
    </>
  );
}
