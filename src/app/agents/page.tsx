import type { Metadata } from "next";
import { PageHero } from "@/components/SiteShell";
import Link from "next/link";

export const metadata: Metadata = { title: "Licensed Insurance Professional Coordination", description: "Learn how Alpha Nation reviews your state and coverage request before coordinating with an appropriately licensed insurance professional." };

export default function AgentsPage() {
  return <>
    <PageHero eyebrow="HOW WE WORK" title="Licensed professional coordination" description="Alpha Nation coordinates your request and checks the appropriate state and product requirements before connecting you with an insurance professional." />
    <section className="section"><div className="wrap">
      <div className="notice-card"><b>Licensing comes first</b><p>We do not publish unverified agent names or route customer requests based only on a territory list. An agent's current state license and authority for the requested product must be checked before a customer is referred.</p></div>
      <div className="steps-grid">
        <article><b>01</b><h3>Submit your request</h3><p>Tell us which service you are interested in and where you live.</p></article>
        <article><b>02</b><h3>We review the request</h3><p>Our team confirms the details and checks whether an appropriately licensed professional is available for your state and product.</p></article>
        <article><b>03</b><h3>Choose your next step</h3><p>If you want to continue, we coordinate an introduction. You decide whether to proceed with any quote or application.</p></article>
      </div>
      <div className="closing-cta inline-cta"><h2>Need help with a specific service?</h2><Link className="button" href="/quote">Request an appointment</Link></div>
    </div></section>
  </>;
}
