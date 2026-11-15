import type {Metadata} from "next";import {PageHero} from "@/components/SiteShell";import InquiryForm from "@/components/InquiryForm";
export const metadata:Metadata={title:"Contact Alpha Nation"};
export default function ContactPage(){return <><PageHero eyebrow="CONTACT ALPHA NATION" title="Send us a question" description="Submit an inquiry and our team will follow up by phone or email."/><section className="section"><div className="wrap"><div className="content-narrow"><InquiryForm/></div></div></section></>}
