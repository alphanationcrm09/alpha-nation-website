import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://alpha-ins.aalphanation.workers.dev").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/quote", priority: 0.9 },
    { path: "/request-appointment", priority: 0.85 },
    { path: "/life-insurance", priority: 0.8 },
    { path: "/final-expense", priority: 0.8 },
    { path: "/burial-insurance-cost", priority: 0.75 },
    { path: "/term-life", priority: 0.8 },
    { path: "/whole-life", priority: 0.8 },
    { path: "/calculator", priority: 0.7 },
    { path: "/how-it-works", priority: 0.7 },
    { path: "/beneficiary-services", priority: 0.65 },
    { path: "/faq", priority: 0.7 },
    { path: "/carriers", priority: 0.6 },
    { path: "/agents", priority: 0.55 },
    { path: "/pricing", priority: 0.65 },
    { path: "/contact", priority: 0.6 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];

  return pages.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority,
  }));
}