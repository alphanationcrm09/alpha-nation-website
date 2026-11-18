import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://alpha-nation-site.aalphanation.workers.dev").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/quote", "/life-insurance", "/term-life", "/whole-life", "/final-expense", "/calculator", "/how-it-works", "/beneficiary-services", "/faq", "/contact", "/carriers", "/agents", "/pricing", "/privacy", "/terms"];
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/quote" ? 0.9 : 0.7,
  }));
}