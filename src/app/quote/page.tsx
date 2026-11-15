import type { Metadata } from "next";
import { PageHero } from "@/components/SiteShell";
import QuoteJourney from "@/components/QuoteJourney";
export const metadata: Metadata = { title: "Explore Coverage Options | Alpha Nation", description: "Tell Alpha Nation what type of insurance you are exploring and request a follow-up from a licensed professional." };
export default function QuotePage() { return <><PageHero eyebrow="EXPLORE COVERAGE OPTIONS" title="A few details. A clearer next step." description="Tell us what kind of protection you are considering. We will use your request to help direct you to an appropriately licensed professional."/><section className="section quote-page-section"><div className="wrap quote-page-wrap"><QuoteJourney/></div></section></>; }
