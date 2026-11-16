import type { Metadata } from "next";
import { PageHero } from "@/components/SiteShell";
import { BookingForm } from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Request an Appointment | Alpha Nation",
  description: "Request a conversation with Alpha Nation about life insurance and other coverage options. Our team will contact you to confirm a time.",
};

export default function RequestAppointmentPage() {
  return <>
    <PageHero
      eyebrow="REQUEST AN APPOINTMENT"
      title="Tell us how to reach you."
      description="Share your contact details and preferred appointment time. This is a request only; our team will contact you to confirm."
    />
    <section className="section">
      <div className="wrap quote-page-wrap">
        <BookingForm />
      </div>
    </section>
  </>;
}
