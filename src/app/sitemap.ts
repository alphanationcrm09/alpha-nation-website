import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];
  const base = siteUrl.replace(/\/$/, "");
  const paths = ["", "/quote", "/life-insurance", "/term-life", "/whole-life", "/final-expense", "/calculator", "/how-it-works", "/beneficiary-services", "/faq", "/contact", "/carriers", "/agents", "/pricing", "/privacy", "/terms"];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/quote" ? 0.9 : 0.7,
  }));
}
