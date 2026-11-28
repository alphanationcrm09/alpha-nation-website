import type { Metadata } from "next";
import PublicHome from "@/components/PublicHome";

export const metadata: Metadata = {
  title: "Life & Final Expense Insurance Guidance in the U.S. | Alpha Nation",
  description: "Explore life, term, whole life, final expense and burial insurance for U.S. individuals and families. Learn what to consider and request guidance about options available in your state.",
  keywords: ["Alpha Nation", "Final Expense Insurance", "Life Insurance", "Whole Life Insurance", "Term Life Insurance", "Insurance Guidance"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Life & Final Expense Insurance Guidance | Alpha Nation",
    description: "Explore life, term, whole life, final expense and burial insurance. Understand coverage considerations and request guidance about options available in your state.",
    type: "website",
  },
};

export default function MainLandingPage() {
  return <PublicHome />;
}
