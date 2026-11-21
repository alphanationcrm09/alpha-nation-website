import type { Metadata } from "next";
import PublicHome from "@/components/PublicHome";

export const metadata: Metadata = {
  title: "Insurance Guidance, Life & Final Expense Coverage",
  description: "Explore life insurance, final expense, term life and whole life coverage information. Understand your options and request guidance about availability in your state.",
  keywords: ["Alpha Nation", "Final Expense Insurance", "Life Insurance", "Whole Life Insurance", "Term Life Insurance", "Insurance Guidance"],
  openGraph: {
    title: "Insurance Guidance, Life & Final Expense Coverage | Alpha Nation",
    description: "Explore final expense, term life and whole life insurance information. Compare coverage considerations and request guidance about options available in your state.",
    type: "website",
  },
};

export default function MainLandingPage() {
  return <PublicHome />;
}