import type { Metadata } from "next";
import { PageHero } from "@/components/SiteShell";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <>
    <PageHero eyebrow="POLICIES" title="Privacy Policy" description="How Alpha Nation handles information submitted through this website." />
    <section className="section"><div className="wrap legal-copy">
      <p><b>Effective date:</b> November 21, 2026</p>
      <p>Alpha Nation ("we", "us" or "our") operates this website. For privacy questions or requests, contact <a href="mailto:aalphanation@gmail.com">aalphanation@gmail.com</a>.</p>
      <h2>Information we collect</h2>
      <p>When you use an appointment form, we collect the information you choose to provide: legal first and last name, telephone number, optional email address, residential street address, city, state, ZIP code, insurance or service type, requested coverage amount when relevant, preferred appointment date and time, time zone, and how you heard about us. When you use an inquiry form, we collect your name, telephone number, optional email address, optional state and ZIP code, inquiry type, and the message you choose to send. We also record your contact-consent choice and limited technical information needed to operate the website, verify form submissions, prevent duplicate requests, and protect forms against abuse. The current public forms do not ask for your age, beneficiary details, medical information, or an insurance application.</p>
      <p>If you use a customer account or portal, we also process the account and profile information needed to authenticate you and display policy records associated with your account. Those records may include a policy number, carrier, product, coverage amount, policy status, effective date, and beneficiary information. Do not submit medical records, health conditions, Social Security numbers, payment-card information, bank details, or other sensitive personal information through public website forms.</p>
      <h2>How we use information</h2>
      <ul>
        <li>To respond to the inquiry or appointment request you submitted.</li>
        <li>To contact you about that request and coordinate a follow-up.</li>
        <li>To route a request to an appropriate licensed insurance professional or agency when needed to respond to your request and where permitted by applicable law.</li>
        <li>To protect the forms and website against spam, fraud, misuse, and security incidents.</li>
        <li>To maintain business records and meet legal obligations.</li>
      </ul>
      <p>The contact checkbox asks Alpha Nation to contact you by phone or email about the specific inquiry or appointment you submitted. It is not consent to unrelated marketing, automated marketing calls or text messages, or an insurance application. Any additional consent required by applicable law must be obtained separately.</p>
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
    </div></section>
  </>;
}
