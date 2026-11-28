import type { Metadata } from "next";
import { SiteChrome, SiteFooter } from "@/components/SiteChrome";
import "./globals.css";
import "./brand.css";
import "./northwestern-refresh.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alpha-ins.aalphanation.workers.dev";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Alpha Nation",
      url: siteUrl,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Alpha Nation",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-US",
    },
  ],
};

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
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><SiteChrome /><main>{children}</main><SiteFooter /></body></html>;
}
