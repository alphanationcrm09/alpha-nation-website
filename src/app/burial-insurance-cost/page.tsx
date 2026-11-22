import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "How Much Does Burial Insurance Cost? | Alpha Nation",
  description:
    "Learn what affects burial insurance premiums, how final expense coverage works, and what to compare before requesting life insurance information.",
  alternates: { canonical: "/burial-insurance-cost" },
  openGraph: {
    title: "How Much Does Burial Insurance Cost?",
    description:
      "Understand the factors that affect burial insurance premiums and how to compare final expense coverage.",
    type: "article",
  },
};

const factors = [
  {
    title: "Age when you apply",
    body: "Age is one factor insurers use when setting premiums. The same coverage amount can have different prices at different ages.",
  },
  {
    title: "Health and underwriting",
    body: "Some products ask health questions or use additional underwriting. Guaranteed-issue products have different eligibility rules and often different pricing and benefit provisions.",
  },
  {
    title: "Coverage amount",
    body: "A larger death benefit generally costs more than a smaller one. Estimate the expenses you want the benefit to help cover instead of choosing an amount based on a headline price.",
  },
  {
    title: "Policy type and waiting period",
    body: "Some final expense policies offer a level death benefit from the start, while others have graded or limited benefits during an initial period. Read the policy provisions carefully.",
  },
  {
    title: "State and insurer",
    body: "Products, rates, age limits and availability vary by insurer and state. A licensed professional must confirm what is available where you live.",
  },
];

export default function BurialInsuranceCostPage() {
  return (
    <>
      <PageHero
        eyebrow="BURIAL INSURANCE GUIDE"
        title="How much does burial insurance cost?"
        description="The cost depends on your age, health, coverage amount, policy design and state. Learn what affects the premium before comparing options."
      />
      <section className="section">
        <div className="wrap" style={{ maxWidth: 850 }}>
          <p>
            Burial insurance is a common name for smaller life insurance coverage intended to help beneficiaries pay funeral, burial or cremation expenses and other final costs. It is often marketed as final expense insurance. The name alone does not tell you how a policy works: the insurer's contract defines the benefit, premiums, exclusions and other conditions.
          </p>

          <h2>Is there one average price for burial insurance?</h2>
          <p>
            There is no single price that applies to everyone. Two people requesting the same benefit amount might receive different premiums because insurers assess age, application answers, product rules and other permitted factors. Rates also differ between insurers and states.
          </p>
          <p>
            Be careful with advertisements showing a low monthly price without explaining the applicant's age, health assumptions, benefit amount and policy type. A sample price is not a personal quote, an approval or a promise that coverage is available.
          </p>

          <h2>What affects the cost of burial insurance?</h2>
          <div className="faq-page">
            {factors.map((factor) => (
              <section key={factor.title}>
                <h3>{factor.title}</h3>
                <p>{factor.body}</p>
              </section>
            ))}
          </div>

          <h2>How much burial coverage should you consider?</h2>
          <p>
            Start by estimating the expenses you want your beneficiaries to have help with. Consider funeral home services, burial or cremation, transportation, an obituary or memorial, and any other final bills you want to account for. Costs differ by location and personal choices, so use local estimates rather than assuming one national amount.
          </p>
          <p>
            Decide whether the policy should cover only those expenses or provide an additional amount to a beneficiary. Then compare the premium with your ongoing budget. A policy that becomes difficult to maintain could fail to meet the purpose you had in mind.
          </p>

          <h2>Questions to ask before choosing a policy</h2>
          <ul>
            <li>Is the death benefit level from the first day, or is there a graded or limited-benefit period?</li>
            <li>What are the premium amount, payment frequency and conditions for keeping the policy in force?</li>
            <li>Are there exclusions, limitations or contestability provisions I should understand?</li>
            <li>What happens if a payment is missed, and what grace period applies?</li>
            <li>Is the insurer authorized to offer this product in my state, and is the professional discussing it properly licensed?</li>
            <li>How does this coverage compare with any life insurance I already own?</li>
          </ul>

          <h2>Burial insurance and final expense insurance: are they different?</h2>
          <p>
            The terms are often used interchangeably in advertising. Many products described as burial insurance are small whole life policies, but product structures and contract provisions vary. Review the actual policy type, benefit schedule, premium obligations and insurer documents rather than relying on the marketing label.
          </p>

          <h2>Can you get burial insurance without a medical exam?</h2>
          <p>
            Some products do not require a traditional medical exam, but that does not mean every applicant is automatically accepted. An insurer might ask health questions or use other underwriting information. Guaranteed-issue coverage, where offered, has its own eligibility rules, pricing and benefit limitations. Confirm the details in the policy before applying.
          </p>

          <h2>Compare options with the right information</h2>
          <p>
            Alpha Nation provides general insurance information and helps route requests for follow-up. A request through this website is not an application, approval or quote. A properly licensed professional must confirm state availability and explain the products they are authorized to discuss. The insurer determines eligibility, final pricing and coverage under its application and underwriting process.
          </p>
          <p>
            Learn more about <Link href="/final-expense">final expense insurance</Link>, compare it with <Link href="/whole-life">whole life insurance</Link>, or review <Link href="/how-it-works">how the process works</Link>.
          </p>
          <div className="inline-cta">
            <div>
              <h2>Want to discuss your options?</h2>
              <p>Share a request for information and ask for details based on your state and circumstances.</p>
            </div>
            <Link className="button" href="/quote">Request information</Link>
          </div>
          <p style={{ color: "#9eafbd", fontSize: 12, marginTop: 28 }}>
            Educational information only. It is not legal, tax or financial advice and does not describe every policy. Terms, rates, eligibility and availability vary by insurer and state. Review the policy and required disclosures with a properly licensed professional before making a decision.
          </p>
        </div>
      </section>
    </>
  );
}
