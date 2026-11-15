import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alpha Nation | Final Expense, Life & Health Insurance",
  description: "Explore Final Expense, Whole Life, Term Life, Health, Medicare, Auto and Home Insurance with Alpha Nation. Connect with carrier partners and appropriately licensed insurance professionals.",
  keywords: ["Alpha Nation", "Final Expense Insurance", "Whole Life Insurance", "Term Life Insurance", "Life Insurance", "Health Insurance", "Medicare", "Insurance Brokerage"],
  openGraph: {
    title: "Alpha Nation | Insurance Brokerage",
    description: "Explore insurance options and connect with an appropriately licensed professional through Alpha Nation.",
    type: "website",
  },
};

const products = [
  ["Final Expense Insurance","Coverage options designed to help families prepare for funeral and end-of-life expenses."],
  ["Whole Life Insurance","Explore permanent life insurance and the guarantees and features available with different policies."],
  ["Term Life Insurance","Learn about life insurance protection for a selected period of time."],
  ["Mortgage Protection","Explore ways life insurance may help protect your family's home and financial plans."],
  ["Auto Insurance","Ask about vehicle protection options and available policy features."],
  ["Health Insurance","Explore individual and family health coverage options."],
  ["Medicare","Get help understanding Medicare-related coverage options."],
  ["ACA Health Insurance","Learn about health coverage options available through the ACA marketplace."],
  ["Home Insurance","Explore options for protecting your home and property."],
  ["Credit Repair","Request information about credit review and services intended to help improve your credit profile."],
  ["Debt Relief","Discuss available debt-relief services and review their terms before proceeding."],
];

const states = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
];

import PublicHome from "@/components/PublicHome";

export default function HomePage() {
  return <PublicHome />;
}
