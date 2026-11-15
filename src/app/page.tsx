import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Alpha Nation | Insurance Brokerage & Coverage Options",
  description: "Welcome to Alpha Nation. Explore Final Expense, Whole Life, Term Life, Health, Medicare, Auto and Home Insurance options and connect with an insurance professional.",
  keywords: ["Alpha Nation", "Final Expense Insurance", "Whole Life Insurance", "Term Life Insurance", "Insurance Brokerage", "Medicare", "Health Insurance"],
  openGraph: {
    title: "Welcome to Alpha Nation",
    description: "Protect what matters today. Build confidence for tomorrow.",
    type: "website",
  },
};

export default function WelcomePage() {
  return <section className="crm-welcome">
    <div className="crm-welcome-glow" />
    <div className="crm-welcome-content">
      <div className="crm-welcome-mark" aria-label="Alpha Nation logo">
        <svg viewBox="0 0 120 92" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="alphaLogoGradientWelcome" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#0577ff"/><stop offset="1" stopColor="#63d3ff"/></linearGradient></defs>
          <path d="M12 72 41 10h15l29 62H70l-7-17H34l-7 17H12Zm28-30h18l-9-21-9 21Z" fill="url(#alphaLogoGradientWelcome)"/>
          <path d="M60 10h13l24 39V10h13v62H97L73 33v39H60V10Z" fill="#eef6ff"/>
        </svg>
      </div>
      <p className="crm-welcome-eyebrow">WELCOME TO</p>
      <h1>Alpha <span>Nation</span></h1>
      <p className="crm-welcome-quote">“Protect what matters today. Build confidence for tomorrow.”</p>
      <p className="crm-welcome-copy">Explore insurance options for you and your family. Our team helps you understand the next steps and connect with an appropriately licensed professional.</p>
      <Link className="button crm-welcome-button" href="/home">Enter Alpha Nation <span aria-hidden="true">→</span></Link>
      <p className="crm-welcome-caption">Insurance and financial services information</p>
    </div>
  </section>;
}
