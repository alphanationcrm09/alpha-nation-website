import type { Metadata } from "next";
import { PageHero } from "@/components/SiteShell";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <>
    <PageHero eyebrow="POLICIES" title="Privacy Policy" description="How Alpha Nation handles information submitted through this website." />
    <section className="section"><div className="wrap legal-copy">
      <p><b>Effective date:</b> November 15, 2026</p>
      <p>Alpha Nation ("we", "us" or "our") operates this website. For privacy questions or requests, contact <a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a>.</p>
      <h2>Information we collect</h2>
      <p>When you use a website form, we collect the information you choose to provide. Depending on the form, this may include your name, telephone number, email address, residential street address, city, state, ZIP code, the insurance or service type you are asking about, an age range, a coverage goal or requested coverage amount, beneficiary name and relationship, preferred appointment date and time, time zone, how you heard about us, and the contents of your message. We also record your contact-consent choice and limited technical information needed to operate the website and protect forms against abuse.</p>
      <p>Do not submit medical records, health conditions, Social Security numbers, payment-card information, bank details, or other sensitive personal information through these forms.</p>
      <h2>How we use information</h2>
      <ul>
        <li>To respond to the inquiry or appointment request you submitted.</li>
        <li>To contact you about that request and coordinate a follow-up.</li>
        <li>To route a request to an appropriate licensed insurance professional or agency when needed to respond to your request and where permitted by applicable law.</li>
        <li>To protect the forms and website against spam, fraud, misuse, and security incidents.</li>
        <li>To maintain business records and meet legal obligations.</li>
      </ul>
      <p>Submitting a request is not consent to unrelated marketing. We do not treat the appointment contact checkbox as consent to automated marketing calls or text messages.</p>
      <h2>Service providers and sharing</h2>
      <p>We use service providers to operate the website and process requests, including Cloudflare for website hosting and bot protection and Supabase for database and authentication services. These providers process information as needed to provide their services. If you choose to continue after speaking with Alpha Nation, we may share the information needed with the licensed professional or agency handling your request. We will provide any additional notice or obtain any consent required by applicable law before making that referral. We do not currently use advertising pixels or cross-context behavioural advertising. We may also disclose information where required by law or needed to protect rights and security.</p>
      <h2>Cookies and similar technologies</h2>
      <p>The admin area uses essential Supabase authentication cookies to keep authorized staff signed in and refresh their sessions. Cloudflare Turnstile may process browser and device signals to distinguish people from automated traffic. The current website does not intentionally use advertising pixels or third-party analytics cookies. If non-essential tracking is added later, this notice and any required consent controls will be updated before it is enabled.</p>
      <h2>Retention and security</h2>
      <p>We retain request information only for as long as reasonably needed to respond, maintain business records, resolve disputes, prevent abuse, and meet applicable legal requirements. Access to customer records is restricted to authorized website staff through role-based database permissions. We use HTTPS, access controls, and anti-abuse checks. No website or internet transmission can be guaranteed completely secure.</p>
      <h2>Your choices and privacy requests</h2>
      <p>You may contact us to request access to, correction of, or deletion of information you submitted, subject to identity checks and applicable record-retention obligations. Depending on your state or country, additional privacy rights may apply. We will handle requests in accordance with applicable law.</p>
      <h2>Children</h2>
      <p>This website is intended for adults seeking information about insurance and related services. Do not submit information about a child through these forms.</p>
      <h2>Changes and contact</h2>
      <p>We may update this notice when our practices or legal requirements change. The current version will be posted on this page. Contact <a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a> with privacy questions.</p>
      <p className="form-notice">Before production launch, the website operator should confirm the legal business name, mailing address, service-provider terms, retention schedule, and applicable state privacy/insurance/telemarketing disclosures with qualified counsel.</p>
    </div></section>
  </>;
}
