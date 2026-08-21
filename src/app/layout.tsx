import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import {
  BASE_URL,
  SITE_NAME,
  KEYWORDS,
  SITE_DESCRIPTION,
  organizationJsonLd,
  jsonLdScript,
} from "@/lib/seo";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0B",
};

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Digital Systems Studio`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION.en,
  keywords: KEYWORDS,
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
    languages: {
      cs: "/cs",
      en: "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    alternateLocale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Digital Systems Studio`,
    description: SITE_DESCRIPTION.en,
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Digital Systems Studio`,
    description: SITE_DESCRIPTION.en,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const locale = h.get("x-locale") ?? "cs";

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd())}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
