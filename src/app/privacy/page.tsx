import type { Metadata } from "next";
import { PageHero } from "@/components/SiteShell";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <>
    <PageHero eyebrow="POLICIES" title="Privacy Policy" description="How Alpha Nation handles information submitted through this website." />
    <section className="section"><div className="wrap legal-copy">
      <p><b>Effective date:</b> November 21, 2026</p>
      <p>Alpha Nation respects the privacy of people who visit this website or contact us about business services. For privacy questions, email <a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a>.</p>
      <h2>Information you provide</h2>
      <p>If you contact us by email, phone or WhatsApp, we receive the contact details and business or campaign information you choose to share. The website may also process limited technical information required for security, hosting and reliable operation. Do not send passwords, payment-card details, bank credentials, government identity numbers or sensitive personal information through general contact channels.</p>
      <h2>How we use information</h2>
      <ul><li>To respond to your business inquiry.</li><li>To discuss requested services, campaign requirements and potential business arrangements.</li><li>To operate, protect and improve the website and prevent misuse.</li><li>To maintain business records and comply with applicable legal obligations.</li></ul>
      <h2>Service providers and sharing</h2>
      <p>Website hosting, security, communications and related technology providers may process information as needed to provide their services. We do not sell personal information. We may disclose information when required by law or when reasonably necessary to protect our rights, users or services.</p>
      <h2>Retention and security</h2>
      <p>We retain information for as long as reasonably needed for the purposes described above, legitimate business records and legal requirements. We use reasonable safeguards, but no internet transmission or storage system can be guaranteed completely secure.</p>
      <h2>Your choices</h2>
      <p>You may contact us to request access to, correction of or deletion of information you provided, subject to identity checks and applicable legal obligations.</p>
      <h2>Changes</h2>
      <p>We may update this policy as our website or practices change. The current version will be posted on this page.</p>
    </div></section>
  </>;
}
