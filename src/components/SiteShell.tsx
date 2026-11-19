import Link from "next/link";
import { AlphaLogo } from "@/components/AlphaLogo";

const links = [
  ["/life-insurance", "Insurance"],
  ["/beneficiary-services", "Beneficiary Services"],
  ["/calculator", "Planning & Tools"],
  ["/#about", "About"],
  ["/faq", "Help"],
];

export function Header() {
  return <header className="site-header"><div className="wrap nav-row">
    <Link href="/" className="logo-link" aria-label="Alpha Nation home"><AlphaLogo /></Link>
    <nav aria-label="Main navigation">{links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    <Link className="button nav-cta" href="/quote">Explore options <span aria-hidden="true">↗</span></Link>
  </div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="wrap footer-grid">
    <div><Link href="/" className="logo-link"><AlphaLogo /></Link><p>Clear insurance information and personal guidance for individuals and families.</p></div>
    <div><b>Insurance</b><Link href="/life-insurance">Life insurance</Link><Link href="/term-life">Term life</Link><Link href="/whole-life">Whole life</Link><Link href="/final-expense">Final expense</Link><Link href="/carriers">Carrier information</Link></div>
    <div><b>Resources & Support</b><Link href="/calculator">Coverage calculator</Link><Link href="/how-it-works">How it works</Link><Link href="/beneficiary-services">Beneficiary services</Link><Link href="/faq">Frequently asked questions</Link><Link href="/contact">Contact Alpha Nation</Link><Link href="/customer/login">Customer login</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a></div>
  </div><div className="wrap legal-note">General information only. Product availability, eligibility, terms and pricing vary by state and carrier. This website does not bind coverage. Estimates are illustrative and are not insurance advice, an offer of insurance or a quote. Customer accounts are created by Alpha Nation staff.</div></footer>;
}

export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <section className="page-hero"><div className="wrap">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p className="lead">{description}</p></div></section>;
}
