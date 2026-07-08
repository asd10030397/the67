import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site/metadata";

const ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/participate", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/genesis", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/brand/mascot", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.5, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
