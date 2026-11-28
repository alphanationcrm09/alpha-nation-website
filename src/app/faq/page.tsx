import type {Metadata} from "next";
import Link from "next/link";
import {PageHero} from "@/components/SiteShell";

export const metadata:Metadata={
  title:"Life, Burial & Home Insurance FAQs in the U.S. | Alpha Nation",
  description:"Get answers to common U.S. insurance questions about life, term, whole life, final expense, burial and homeowners coverage, applications, premiums and policy terms.",
  alternates:{canonical:"/faq"}
};

const groups=[
  {title:"Life insurance basics",items:[
    ["What is life insurance?","Life insurance is a contract under which an insurer pays a death benefit to named beneficiaries if the insured dies while the policy is in force and the contract conditions are met."],
    ["How much coverage should I consider?","Estimate income replacement, mortgage and other debts, education costs and final expenses. Subtract savings, investments and existing life insurance. Review the result against your budget and family circumstances."],
    ["What is the difference between term and whole life?","Term life provides coverage for a selected period. Whole life is designed as permanent coverage and often includes cash value. Premiums, guarantees and flexibility differ."],
    ["Do I need a medical exam?","A traditional medical exam is not required for every product. Many carriers use health questions and electronic checks, which can include information from the Medical Information Bureau (MIB). Requirements vary by carrier and product, and some applications require an exam or additional records."]
  ]},
  {title:"Final expense and burial insurance",items:[
    ["What is final expense insurance?","Final expense insurance is generally a smaller life insurance policy intended to help beneficiaries manage funeral costs and other end-of-life expenses. The policy benefit is generally paid to the named beneficiary, subject to the contract."],
    ["Is burial insurance different from final expense insurance?","The terms are often used interchangeably. The actual policy type, benefit amount, eligibility rules and contract provisions matter more than the marketing label."],
    ["Does burial insurance have a waiting period?","Some policies provide a full death benefit from the start, while others have graded or limited benefits during an initial period. The rules depend on the specific policy, so review the contract before applying."],
    ["How much does burial insurance cost?","There is no single price for everyone. Premiums depend on factors such as age, health or underwriting category, coverage amount, policy type, state and insurer. Compare quotes using the same applicant details and benefit amount."],
    ["Can the insurance benefit only be used for funeral expenses?","Life insurance proceeds are generally paid to the named beneficiary, who decides how to use the money, subject to applicable law and the policy. The benefit is not necessarily restricted to funeral bills."]
  ]},
  {title:"Applying and choosing coverage",items:[
    ["Does an online request mean I am approved?","No. A website inquiry is only a request for follow-up. Approval, final pricing and coverage are determined by the insurer through its application and underwriting process."],
    ["Can I keep my existing policy while shopping?","Yes. Keep your existing coverage while you shop. Do not cancel or replace it until the new policy is approved, issued and active, and you understand the consequences of replacement."],
    ["Are all products available in every state?","No. State approvals, carrier appointments, product rules and agent licensing vary. Availability must be confirmed for your state."],
    ["What should I compare before choosing a policy?","Compare the premium, benefit amount, coverage period, exclusions, waiting periods, riders, renewability, conversion rights, cash-value terms and the insurer's policy documents. Make sure the premium fits your budget."]
  ]},
  {title:"Homeowners insurance",items:[
    ["What does homeowners insurance typically cover?","Many policies include coverage for the dwelling, other structures, personal belongings, personal liability and additional living expenses after certain covered losses. Exact protection depends on the policy form, limits, exclusions and endorsements."],
    ["Does homeowners insurance cover flooding?","Many standard homeowners policies exclude flood damage. Separate flood insurance might be available through the National Flood Insurance Program or private insurers, subject to eligibility and policy terms."],
    ["How much homeowners insurance do I need?","A useful starting point is the estimated cost to rebuild the home, not its sale price or land value. Also review belongings, liability exposure, deductibles and any lender requirements with a properly licensed insurance professional."],
    ["Is homeowners insurance required?","There is no single nationwide rule requiring every homeowner to carry a homeowners policy. A mortgage lender commonly requires insurance as a condition of the loan. Requirements and available products vary."]
  ]},
  {title:"After a policy is issued",items:[
    ["How do I change a beneficiary?","Contact the issuing insurance carrier and follow its beneficiary-change process. The insurer's records and policy rules govern the change."],
    ["How do beneficiaries make a claim?","Beneficiaries generally contact the issuing insurer, complete its claim forms and provide required documentation, such as a certified death certificate. The carrier reviews the claim under the policy."],
    ["What if I miss a premium payment?","Grace periods and lapse rules are stated in the policy and vary by product and state. Contact the insurer promptly if a payment is missed."],
    ["Who can answer questions about an existing policy?","The issuing insurer is the authoritative source for policy status, billing, beneficiary records and claims. Alpha Nation can help direct your inquiry where appropriate."]
  ]}
];

export default function Page(){
  return <>
    <PageHero eyebrow="HELP & EDUCATION" title="Insurance questions, answered clearly." description="Find straightforward answers about life, final expense, burial and homeowners insurance before comparing coverage or speaking with a licensed professional."/>
    <section className="section">
      <div className="wrap faq-page">
        {groups.map(group=><section key={group.title}>
          <h2>{group.title}</h2>
          {group.items.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </section>)}
        <section>
          <h2>Explore insurance guides</h2>
          <ul>
            <li><Link href="/life-insurance">Life insurance basics</Link></li>
            <li><Link href="/final-expense">Final expense insurance</Link></li>
            <li><Link href="/burial-insurance-cost">Burial insurance cost guide</Link></li>
            <li><Link href="/term-life">Term life insurance</Link></li>
            <li><Link href="/whole-life">Whole life insurance</Link></li>
            <li><Link href="/home-insurance">Homeowners insurance</Link></li>
          </ul>
        </section>
        <div className="faq-contact">
          <h2>Still have a question?</h2>
          <p>Send your question and our team will help direct you to the right next step.</p>
          <Link className="button" href="/contact">Contact Alpha Nation</Link>
        </div>
      </div>
    </section>
  </>;
}
