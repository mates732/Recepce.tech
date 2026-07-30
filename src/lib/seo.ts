import type { Metadata } from "next";
import type { Locale } from "./types";

export const BASE_URL = "https://recepce.tech";
export const SITE_NAME = "Recepce.tech";

export const KEYWORDS = [
  "AI agent",
  "AI agents",
  "AI receptionist",
  "AI receptionist for business",
  "Voice AI",
  "AI phone assistant",
  "AI call assistant",
  "AI customer support",
  "AI automation",
  "AI for business",
  "business AI assistant",
  "inteligentní recepční",
  "AI asistent",
  "automatizace pro firmy",
];

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
    description:
      "AI receptionists, voice assistants, chat assistants, premium websites and business automation.",
    sameAs: [
      "https://youtube.com/@Big.matysek",
      "https://github.com/mates732",
    ],
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${BASE_URL}/${locale}`,
    description:
      locale === "cs"
        ? "Stavím inteligentní systémy. AI recepční, AI asistenti, prémiové weby a automatizace."
        : "I build intelligent systems. AI receptionists, AI assistants, premium websites and automation.",
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/${locale}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
