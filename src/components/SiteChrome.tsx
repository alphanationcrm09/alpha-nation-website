"use client";
import {usePathname} from "next/navigation";
import {Header,Footer} from "@/components/SiteShell";
import MobileQuoteBar from "@/components/MobileQuoteBar";

export function SiteChrome(){
  const path=usePathname();
  if(path.startsWith("/admin")) return null;
  return <><Header /><MobileQuoteBar /></>;
}

export function SiteFooter(){
  const path=usePathname();
  if(path.startsWith("/admin")) return null;
  return <Footer />;
}
