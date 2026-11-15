import Link from "next/link";
import { AlphaLogo } from "@/components/AlphaLogo";

const links = [
  ["/#insurance", "Insurance"],
  ["/#beneficiary-services", "Beneficiary Services"],
  ["/#planning", "Planning & Tools"],
  ["/#about", "About"],
  ["/#help", "Help"],
];

export function Header() {
  return <header className="site-header"><div className="wrap nav-row">
    <Link href="/" className="logo-link"><AlphaLogo /></Link>
    <nav aria-label="Main navigation">{links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    <Link className="customer-login-link" href="/customer/login">Customer Login <span aria-hidden="true">↗</span></Link>
  </div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="wrap footer-grid">
    <div><Link href="/" className="logo-link"><AlphaLogo /></Link><p>Insurance information and personal guidance for individuals and families.</p></div>
    <div><b>Explore</b><Link href="/#insurance">Insurance solutions</Link><Link href="/#beneficiary-services">Beneficiary services</Link><Link href="/#planning">Planning and tools</Link><Link href="/#carriers">Carrier information</Link><Link href="/quote">Request an appointment</Link></div>
    <div><b>Support</b><Link href="/#help">Help and contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/admin/login">Staff login</Link><a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a></div>
  </div><div className="wrap legal-note">General information only. Product availability, eligibility, terms and pricing vary by state and carrier. This website does not bind coverage. All estimates are illustrative and are not insurance advice or a quote.</div></footer>;
}

export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <section className="page-hero"><div className="wrap">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p className="lead">{description}</p></div></section>;
}
