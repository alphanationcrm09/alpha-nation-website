import type { Metadata } from "next";
import { PageHero } from "@/components/SiteShell";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return <>
    <PageHero eyebrow="POLICIES" title="Terms of Use" description="Terms for using the Alpha Nation website." />
    <section className="section"><div className="wrap legal-copy">
      <p><b>Effective date:</b> November 21, 2026</p>
      <p>By accessing this website, you agree to use it lawfully and not interfere with its operation, security or other visitors’ use.</p>
      <h2>Website information</h2>
      <p>Website content describes Alpha Nation’s business services at a general level. It is not a binding offer, service-level agreement, staffing commitment, performance guarantee or final quotation. Service scope, campaign requirements, pricing, timelines, responsibilities and applicable compliance requirements must be agreed in a separate written arrangement.</p>
      <h2>Inquiries and communications</h2>
      <p>Submitting an inquiry or contacting us does not create a client relationship or require either party to enter into a business arrangement. Do not send passwords, payment credentials, government identity numbers or sensitive personal information through general contact channels.</p>
      <h2>Acceptable use</h2>
      <p>You must not submit false information, impersonate another person, attempt to access restricted areas, disrupt the website, introduce malicious code or use the website for unlawful purposes.</p>
      <h2>Third-party services</h2>
      <p>The website may rely on third-party hosting, security and communication services. Their own terms and privacy notices may also apply.</p>
      <h2>Changes and contact</h2>
      <p>We may update website content or these terms. For questions, contact <a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a>.</p>
    </div></section>
  </>;
}
