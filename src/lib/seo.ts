import type { Metadata } from "next";
import type { Locale } from "./types";
import { getSite } from "@/content/repository";

/** Site-wide nastavení z obsahu (admin) s fallbackem na defaulty. */
const settings = getSite()?.settings;

export const BASE_URL = settings?.baseUrl?.trim() || "https://recepce.tech";
export const SITE_NAME = settings?.siteName?.trim() || "Recepce.tech";

export const KEYWORDS = settings?.keywords?.length ? settings.keywords : [
  "digital systems studio",
  "custom software",
  "web development",
  "business automation",
  "customer communication systems",
  "internal tools",
  "system design",
  "booking systems",
  "workflow automation",
  "intelligent workflows",
  "integrations",
  "custom systems",
  "digitální systémy",
  "vývoj webů",
  "automatizace firemních procesů",
  "komunikační systémy",
  "interní nástroje",
  "systémový design",
];

export const SITE_DESCRIPTION: Record<Locale, string> = settings?.description
  ? { cs: settings.description.cs, en: settings.description.en }
  : {
      cs: "Digitální systémové studio. Navrhujeme a stavíme weby, komunikační systémy, interní nástroje a automatizaci — technologie je jen nástroj, výsledek je důvod.",
      en: "A digital systems studio. We design and build websites, communication systems, internal tools and automation — technology is just the means, results are the point.",
    };

export const BUSINESS_NAME = settings?.business?.name?.cs?.trim() || "Matyáš Vojan";

export const SAME_AS = [settings?.social?.youtube, settings?.social?.github].filter(
  (url): url is string => Boolean(url?.trim())
);

export const LOCALE_META: Record<Locale, { lang: string; ogLocale: string; localeFull: string }> = {
  cs: { lang: "cs", ogLocale: "cs_CZ", localeFull: "cs-CZ" },
  en: { lang: "en", ogLocale: "en_US", localeFull: "en-US" },
};

export function createMetadata(
  locale: Locale,
  page: {
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    path: string;
    image?: string;
    keywords?: string[];
  },
): Metadata {
  const isCs = locale === "cs";
  const title = isCs ? page.title : page.titleEn;
  const description = isCs ? page.description : page.descriptionEn;
  const meta = LOCALE_META[locale];
  const altLocale = locale === "cs" ? "en" : "cs";
  const altMeta = LOCALE_META[altLocale];

  return {
    title,
    description,
    keywords: [...KEYWORDS, ...(page.keywords ?? [])],
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${locale}${page.path}`,
      languages: {
        [meta.ogLocale]: `${BASE_URL}/${locale}${page.path}`,
        [altMeta.ogLocale]: `${BASE_URL}/${altLocale}${page.path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}${page.path}`,
      siteName: SITE_NAME,
      locale: meta.ogLocale,
      alternateLocale: altMeta.ogLocale,
      type: "website",
      ...(page.image ? { images: [{ url: `${BASE_URL}${page.image}`, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(page.image ? { images: [`${BASE_URL}${page.image}`] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION.en,
    sameAs: SAME_AS,
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${BASE_URL}/${locale}`,
    description: SITE_DESCRIPTION[locale],
    inLanguage: locale,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function softwareApplicationJsonLd(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CZK",
    },
  };
}

export function jsonLdScript(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data),
  };
}
