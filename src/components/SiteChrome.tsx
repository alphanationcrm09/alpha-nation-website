"use client";
import {usePathname} from "next/navigation";
import {Header,Footer} from "@/components/SiteShell";

export function SiteChrome(){
  const path=usePathname();
  if(path.startsWith("/admin")) return null;
  return <Header />;
}

export function SiteFooter(){
  const path=usePathname();
  if(path.startsWith("/admin") || path === "/") return null;
  return <Footer />;
}
