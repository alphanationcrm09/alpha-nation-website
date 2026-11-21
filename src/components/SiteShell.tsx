import Link from "next/link";
import { AlphaLogo } from "@/components/AlphaLogo";

const links = [
  ["/#services", "Services"],
  ["/#industries", "Industries"],
  ["/#approach", "How We Work"],
  ["/contact", "Contact"],
] as const;

function NavigationLinks() {
  return <>{links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</>;
}

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap nav-row">
        <Link href="/" className="logo-link" aria-label="Alpha Nation home"><AlphaLogo /></Link>
        <nav className="desktop-nav" aria-label="Main navigation"><NavigationLinks /></nav>
        <div className="nav-actions">
          <a className="button nav-cta" href="https://wa.me/923165573057" target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
          <details className="mobile-menu">
            <summary aria-label="Open navigation menu"><span>Menu</span><span className="menu-icon" aria-hidden="true"><i /><i /><i /></span></summary>
            <nav aria-label="Mobile navigation"><NavigationLinks /><a href="https://wa.me/923165573057" target="_blank" rel="noreferrer">WhatsApp</a></nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div><Link href="/" className="logo-link"><AlphaLogo /></Link><p>Business process outsourcing, telemarketing and customer support operations delivered by trained teams in Pakistan.</p></div>
        <div><b>Explore</b><Link href="/#services">Our services</Link><Link href="/#industries">Industries</Link><Link href="/#approach">How we work</Link><Link href="/contact">Contact Alpha Nation</Link></div>
        <div><b>Get in touch</b><a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a><a href="https://wa.me/923165573057" target="_blank" rel="noreferrer">+92 316 5573057 · WhatsApp</a><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
      <div className="wrap legal-note"><p>Alpha Nation provides campaign and operational support. Service scope, staffing, campaign requirements and applicable compliance responsibilities are discussed and agreed with each client before work begins.</p><p>© {new Date().getFullYear()} Alpha Nation. All rights reserved.</p></div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <section className="page-hero"><div className="wrap">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p className="lead">{description}</p></div></section>;
}
