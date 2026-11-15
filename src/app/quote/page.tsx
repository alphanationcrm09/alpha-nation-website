import type { Metadata } from "next";
import { PageHero } from "@/components/SiteShell";
import { BookingForm } from "@/components/BookingForm";
export const metadata: Metadata = { title: "Book an appointment" };
export default function QuotePage() { return <><PageHero eyebrow="BOOK AN APPOINTMENT" title="Let's find a time to talk" description="Share a few details and choose a preferred appointment time. Alpha Nation will follow up to confirm your appointment and discuss the next steps."/><section className="section"><div className="wrap"><BookingForm /></div></section></>; }
