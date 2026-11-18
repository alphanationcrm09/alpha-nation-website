import type { Metadata } from "next";
import PublicHome from "@/components/PublicHome";

export const metadata: Metadata = {
  title: "Final Expense, Life & Health Insurance",
  description: "Explore final expense, term life and whole life insurance information. Compare coverage considerations and request guidance about options available in your state.",
  keywords: ["Alpha Nation", "Final Expense Insurance", "Life Insurance", "Whole Life Insurance", "Term Life Insurance", "Health Insurance"],
  openGraph: {
    title: "Final Expense, Life & Health Insurance | Alpha Nation",
    description: "Explore final expense, term life and whole life insurance information. Compare coverage considerations and request guidance about options available in your state.",
    type: "website",
  },
};

export default function MainLandingPage() {
  return <PublicHome />;
}