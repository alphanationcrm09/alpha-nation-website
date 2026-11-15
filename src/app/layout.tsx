import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { SplashScreen } from "@/components/SplashScreen";
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
  return <html lang="en"><body><SplashScreen /><SiteChrome /><main>{children}</main></body></html>;
}
