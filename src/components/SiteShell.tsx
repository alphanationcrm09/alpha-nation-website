import Link from "next/link";
import { AlphaLogo } from "@/components/AlphaLogo";

const links = [
  ["/", "Home"],
  ["/#about", "About Us"],
  ["/#products", "Products"],
  ["/#carriers", "Carriers"],
  ["/#agents", "Top Agents"],
  ["/#states", "States"],
  ["/contact", "Contact"],
];

export function Header() {
  return <header className="site-header"><div className="wrap nav-row">
    <Link href="/" className="logo-link"><AlphaLogo /></Link>
    <nav aria-label="Main navigation">{links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}<Link className="button nav-cta" href="/quote">Book an appointment</Link></nav>
  </div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="wrap footer-grid">
    <div><Link href="/" className="logo-link"><AlphaLogo /></Link><p>Alpha Nation insurance brokerage information, carrier connections and appointment coordination through our team.</p></div>
    <div><b>Explore</b><Link href="/#about">About Alpha Nation</Link><Link href="/#products">Products and services</Link><Link href="/#agents">Top agents</Link><Link href="/#carriers">Carrier information</Link><Link href="/quote">Request an appointment</Link><Link href="/contact">Send an inquiry</Link></div>
    <div><b>Important information</b><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/admin/login">Staff login</Link><a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a><span>State availability and licensing must be verified before an agent is assigned.</span></div>
  </div><div className="wrap legal-note">General information only. Product availability, eligibility, terms and pricing vary by state and carrier. This website does not bind coverage.</div></footer>;
}

export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <section className="page-hero"><div className="wrap">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p className="lead">{description}</p></div></section>;
}
