import type { Metadata } from "next";
import Home from "./home/page";

export const metadata: Metadata = {
  title: "Alpha Nation | Final Expense, Life & Health Insurance",
  description: "Explore insurance options and connect with an appropriately licensed professional through Alpha Nation.",
  keywords: ["Alpha Nation", "Final Expense Insurance", "Whole Life Insurance", "Term Life Insurance", "Health Insurance", "Medicare", "Insurance Brokerage"],
  openGraph: {
    title: "Alpha Nation | Insurance Brokerage",
    description: "Explore insurance options and connect with an appropriately licensed professional through Alpha Nation.",
    type: "website",
  },
};

export default function MainLandingPage() {
  return <Home />;
}
