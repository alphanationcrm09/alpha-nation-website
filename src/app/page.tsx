import type { Metadata } from "next";
import PublicHome from "@/components/PublicHome";

export const metadata: Metadata = {
  title: "Telemarketing, Customer Support & Sales Outsourcing",
  description: "Alpha Nation provides telemarketing, customer support, lead generation, appointment setting and sales outsourcing through trained teams in Pakistan.",
  keywords: ["Alpha Nation", "BPO Pakistan", "Telemarketing", "Customer Support", "Sales Outsourcing", "Lead Generation", "Appointment Setting"],
  openGraph: {
    title: "Alpha Nation | Telemarketing & Business Process Outsourcing",
    description: "Campaign-focused telemarketing, customer support and sales operations delivered by trained teams in Pakistan.",
    type: "website",
  },
};

export default function MainLandingPage() {
  return <PublicHome />;
}
