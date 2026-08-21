import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { LOCALES } from "@/lib/types";
import { list } from "@/content/repository";

const STATIC_ROUTES = [
  "",
  "/o-mne",
  "/kontakt",
  "/projekty/cortex",
  "/projekty/asistenti",
  "/projekty/asistenti/chat",
  "/projekty/asistenti/voice",
  "/projekty/weby",
  "/demo",
  "/profese",
  "/projekty",
  "/projekty/ponici",
  "/projekty/zlaty-hreben",
  "/youtube",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const professionSlugs = list("profession").map((p) => p.id);

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

    for (const slug of professionSlugs) {
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
