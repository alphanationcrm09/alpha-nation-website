import type { Metadata } from "next";
import { SiteChrome, SiteFooter } from "@/components/SiteChrome";
import WelcomeIntro from "@/components/WelcomeIntro";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: "Alpha Nation | Insurance Information", template: "%s | Alpha Nation" },
  description: "Explore insurance information and request a conversation about coverage options.",
  applicationName: "Alpha Nation",
  openGraph: {
    type: "website",
    siteName: "Alpha Nation",
    title: "Alpha Nation | Insurance Information",
    description: "Explore insurance information and request a conversation about coverage options.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Nation | Insurance Information",
    description: "Explore insurance information and request a conversation about coverage options.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><WelcomeIntro /><SiteChrome /><main>{children}</main><SiteFooter /></body></html>;
}
