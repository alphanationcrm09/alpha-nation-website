import Link from "next/link";
import { AlphaLogo } from "@/components/AlphaLogo";

const links = [
  ["/life-insurance", "Insurance"],
  ["/how-it-works", "How It Works"],
  ["/carriers", "Carriers"],
  ["/faq", "FAQs"],
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
          <Link className="button nav-book-cta" href="/request-appointment">Book a Call</Link>
          <Link className="button nav-cta" href="/quote">Get a Quote <span aria-hidden="true">↗</span></Link>
          <details className="mobile-menu">
            <summary aria-label="Open navigation menu"><span>Menu</span><span className="menu-icon" aria-hidden="true"><i /><i /><i /></span></summary>
            <nav aria-label="Mobile navigation">
              <NavigationLinks />
              <Link href="/request-appointment">Book a Call</Link>
              <Link href="/customer/login">Customer Login</Link>
            </nav>
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
        <div><Link href="/" className="logo-link"><AlphaLogo /></Link><p>Clear insurance information and personal guidance for individuals and families.</p></div>
        <div><b>Insurance</b><Link href="/life-insurance">Life insurance</Link><Link href="/term-life">Term life</Link><Link href="/whole-life">Whole life</Link><Link href="/final-expense">Final expense</Link><Link href="/carriers">Carrier information</Link></div>
        <div><b>Resources & Support</b><Link href="/calculator">Coverage calculator</Link><Link href="/how-it-works">How it works</Link><Link href="/beneficiary-services">Beneficiary services</Link><Link href="/faq">Frequently asked questions</Link><Link href="/contact">Contact Alpha Nation</Link><Link href="/request-appointment">Book a Call</Link><Link href="/customer/login">Customer login</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a></div>
      </div>
      <div className="wrap legal-note">
        <p><b>Licensing and availability:</b> Insurance products are discussed or placed only through appropriately licensed professionals and only where permitted by applicable law. Licensing, carrier appointments, product availability, eligibility, terms and pricing vary by state and insurer and are confirmed before an application proceeds. A carrier listing is informational and does not establish an active appointment or product availability.</p>
        <p>Website information is general and educational. A request for information is not an insurance application, quote, binder or guarantee of coverage. Only the insurer's issued policy and contract documents determine coverage.</p>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <section className="page-hero"><div className="wrap">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p className="lead">{description}</p></div></section>;
}
