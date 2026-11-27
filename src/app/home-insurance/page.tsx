import type {Metadata} from "next";
import ProductLanding from "@/components/ProductLanding";

export const metadata:Metadata={
  title:"Homeowners Insurance Guide in the U.S.",
  description:"Learn what homeowners insurance typically covers, compare dwelling, personal property and liability limits, and review deductibles, exclusions and state-specific availability."
};

export default function Page(){
  return <ProductLanding
    eyebrow="HOMEOWNERS INSURANCE"
    title="Understand the coverage that helps protect your home."
    description="Explore homeowners insurance basics, from your dwelling and belongings to personal liability, deductibles and common policy exclusions."
    introTitle="A policy should reflect your home, belongings and risks."
    intro="Homeowners insurance is a package of coverages that can help protect a home and its contents against certain covered losses. Policies often include dwelling protection, personal property coverage, personal liability and additional living expenses, but covered causes of loss, limits and conditions differ. The property, location, insurer and policy form all matter when comparing options."
    benefits={[
      "Review the estimated cost to rebuild your home, which can differ from its market value.",
      "Make an inventory of furniture, electronics, clothing and other personal belongings.",
      "Consider personal liability limits and whether additional protection is appropriate.",
      "Understand how additional living expenses may work if a covered loss makes the home uninhabitable.",
      "Check whether detached structures, renovations, home-based business property or special valuables need separate limits or endorsements."
    ]}
    considerations={[
      "A homeowners policy does not cover every cause of damage. Flood and earthquake coverage are commonly excluded or require separate coverage, depending on the policy and location.",
      "Deductibles, coverage limits, exclusions, roof settlement terms and claim conditions vary by insurer and contract.",
      "Replacement cost and actual cash value are different settlement methods; check which applies to the dwelling and personal property.",
      "Premiums and eligibility can depend on location, construction, roof age, claims history, property use and selected limits.",
      "A mortgage lender may set insurance requirements, but the homeowner should still review whether the policy limits and protections fit the property."
    ]}
    faq={[
      {q:"What does homeowners insurance typically cover?",a:"Many policies include coverage for the dwelling, other structures, personal belongings, personal liability and additional living expenses after certain covered losses. Exact protection depends on the policy form, limits, exclusions and endorsements."},
      {q:"Does homeowners insurance cover flooding?",a:"Many standard homeowners policies exclude flood damage. Separate flood insurance may be available through the National Flood Insurance Program or private insurers, subject to eligibility and terms."},
      {q:"How much homeowners insurance do I need?",a:"A useful starting point is the estimated cost to rebuild the home, not its sale price or land value. Also review belongings, liability exposure, deductibles and any lender requirements with a properly licensed insurance professional."},
      {q:"What is the difference between replacement cost and actual cash value?",a:"Replacement cost generally refers to the cost to repair or replace covered property without subtracting depreciation, subject to policy terms and limits. Actual cash value generally accounts for depreciation. Definitions and settlement rules vary by contract."},
      {q:"Is homeowners insurance required by law?",a:"There is no single nationwide rule requiring every homeowner to carry a homeowners policy. A mortgage lender commonly requires insurance as a condition of the loan. Requirements and available products vary."},
      {q:"Can I get coverage for valuable jewelry or home businesses?",a:"Some policies have special limits or exclusions for certain valuables and business property. A scheduled personal property endorsement or separate policy might be available, depending on the insurer."}
    ]}
  />;
}
