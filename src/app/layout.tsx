import type { Metadata } from "next";
import { SiteChrome, SiteFooter } from "@/components/SiteChrome";
import WelcomeIntro from "@/components/WelcomeIntro";
import "./globals.css";
import "./brand.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alpha-ins.aalphanation.workers.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Life Insurance Information & Coverage Guidance", template: "%s | Alpha Nation" },
  description: "Explore life insurance, final expense, term life and whole life coverage information. Learn what to compare and request a conversation about options available in your state.",
  applicationName: "Alpha Nation",
  verification: {
    google: "VlZ0cURpkvsp8T12i2gTBLsuKxnGw4vmjxhLCVZ0gdA",
  },
  openGraph: {
    type: "website",
    siteName: "Alpha Nation",
    title: "Life Insurance Information & Coverage Guidance | Alpha Nation",
    description: "Explore life insurance, final expense, term life and whole life coverage information. Learn what to compare and request a conversation about options available in your state.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Insurance Information & Coverage Guidance | Alpha Nation",
    description: "Explore life insurance, final expense, term life and whole life coverage information. Learn what to compare and request a conversation about options available in your state.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><WelcomeIntro /><SiteChrome /><main>{children}</main><SiteFooter /></body></html>;
}