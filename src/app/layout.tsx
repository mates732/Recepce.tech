import type { Metadata, Viewport } from "next";
import { BASE_URL, SITE_NAME, KEYWORDS, organizationJsonLd, jsonLdScript } from "@/lib/seo";
import "./globals.css";

const DESIGN_WIDTH = 1440;

export const viewport: Viewport = {
  width: DESIGN_WIDTH,
  themeColor: "#F7F8FA",
};

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — AI Receptionist & Intelligent Systems`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "AI receptionist, voice AI, chat assistants, and business automation. Intelligent systems for modern businesses.",
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
    title: `${SITE_NAME} — AI Receptionist & Intelligent Systems`,
    description:
      "AI receptionist, voice AI, chat assistants, and business automation. Intelligent systems for modern businesses.",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — AI Receptionist & Intelligent Systems`,
    description:
      "AI receptionist, voice AI, chat assistants, and business automation. Intelligent systems for modern businesses.",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd())}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var DW = 1440;
                if (screen.width >= DW) {
                  var m = document.querySelector('meta[name="viewport"]');
                  if (m) m.content = 'width=device-width, initial-scale=1';
                }
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
