import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

const LOCALES = ["cs", "en"] as const;

const STATIC_ROUTES = [
  "",
  "/about",
  "/ai-receptionist",
  "/ai.assistent",
  "/contact",
  "/cortex",
  "/demo",
  "/profese",
  "/projekty",
  "/projekty/ai-sistent/chat-assistant",
  "/projekty/ai-sistent/voice-assistant",
  "/projekty/zlaty-hreben",
  "/webs",
  "/youtube",
] as const;

const PROFESSION_SLUGS = [
  "barbershop",
  "dentalni-hygiena",
  "estetika",
  "fitness",
  "kadernictvi",
  "masaze",
  "stomatologie",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: {
            cs: `${BASE_URL}/cs${route}`,
            en: `${BASE_URL}/en${route}`,
          },
        },
      });
    }

    for (const slug of PROFESSION_SLUGS) {
      entries.push({
        url: `${BASE_URL}/${locale}/profese/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            cs: `${BASE_URL}/cs/profese/${slug}`,
            en: `${BASE_URL}/en/profese/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
