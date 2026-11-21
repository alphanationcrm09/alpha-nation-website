"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
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
