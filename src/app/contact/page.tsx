import type { Metadata } from "next";
import { PageHero } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Contact Alpha Nation",
  description: "Contact Alpha Nation about telemarketing, customer support, lead generation, appointment setting and sales outsourcing.",
};

export default function ContactPage() {
  return <>
    <PageHero eyebrow="CONTACT ALPHA NATION" title="Let’s discuss your campaign." description="Tell us what your business needs. Contact our team directly to discuss services, campaign scope and next steps." />
    <section className="section">
      <div className="wrap">
        <div className="an-bpo-contact-grid">
          <a className="an-bpo-contact-tile" href="mailto:aalphanation@gmail.com"><span>EMAIL</span><b>aalphanation@gmail.com</b><small>Send your campaign requirements and business details.</small></a>
          <a className="an-bpo-contact-tile" href="https://wa.me/923165573057" target="_blank" rel="noreferrer"><span>WHATSAPP / PHONE</span><b>+92 316 5573057</b><small>Message Alpha Nation to start a conversation.</small></a>
        </div>
      </div>
    </section>
  </>;
}
