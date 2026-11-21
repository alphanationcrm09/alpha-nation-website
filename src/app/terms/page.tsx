import type { Metadata } from "next";
import { PageHero } from "@/components/SiteShell";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return <>
    <PageHero eyebrow="POLICIES" title="Terms of Use" description="Terms for using the Alpha Nation website and submitting a request." />
    <section className="section"><div className="wrap legal-copy">
      <p><b>Effective date:</b> November 21, 2026</p>
      <p>By accessing this website, you agree to use it lawfully and not to interfere with its operation, security, or other visitors' use.</p>
      <h2>Website information</h2>
      <p>Website content is general information only. It is not an insurance policy, binder, quote guarantee, legal advice, tax advice, or a recommendation that a particular product is suitable for you. Product descriptions and carrier listings are informational and do not establish that a carrier, product, agent, or agency is available or authorized in your state.</p>
      <h2>Licensing and state availability</h2>
      <p>Insurance products are discussed or placed only through appropriately licensed professionals and only where permitted by applicable law. Producer licensing, carrier appointments, product availability, eligibility, rates and policy terms vary by state and insurer and must be confirmed for the individual request. A carrier listing on this website is informational and does not establish an active appointment, authority to transact, or availability in any state.</p>
      <h2>Insurance and licensed professionals</h2>
      <p>Insurance availability, eligibility, rates, underwriting, and coverage are determined by the applicable insurer and its current product rules. Where an insurance transaction is involved, speak with a properly licensed insurance professional authorized for your state and the product. Only the insurer's issued policy and related contract documents determine coverage. Nothing on this website binds an insurer or creates coverage.</p>
      <h2>Appointment and inquiry requests</h2>
      <p>Submitting a form does not create an appointment, insurance application, policy, or client relationship. A preferred date and time are requests only. Alpha Nation must contact you to confirm any appointment. Do not submit medical records, Social Security numbers, payment information, or other sensitive details through the website.</p>
      <h2>Contact consent</h2>
      <p>When you check a contact-consent box, you ask Alpha Nation to contact you by phone or email about the specific appointment or inquiry you submitted, using the contact details you provided. This checkbox is not consent to unrelated marketing, automated marketing calls or text messages, or an insurance application. Any additional consent required by applicable law must be obtained separately.</p>
      <h2>Accuracy and availability</h2>
      <p>We aim to keep website information accurate and available, but do not guarantee that every page, carrier listing, service, or feature will always be complete, current, uninterrupted, or error-free. We may correct, change, or remove content.</p>
      <h2>Acceptable use</h2>
      <p>You must not submit false information, impersonate another person, attempt to access restricted areas, probe or disrupt the website, introduce malicious code, or use the forms for spam or unlawful purposes.</p>
      <h2>Third-party services</h2>
      <p>The website may rely on third-party services, including Cloudflare and Supabase. Their services may be subject to their own terms and privacy notices.</p>
      <h2>Contact</h2>
      <p>For questions about these terms, contact <a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a>.</p>
    </div></section>
  </>;
}
