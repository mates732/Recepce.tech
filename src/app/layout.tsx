import type { Metadata } from "next";
import "./globals.css";
import AmbientBackground from "@/components/AmbientBackground";

export const metadata: Metadata = {
  title: {
    default: "Matyáš Vojan — Developer & Product Builder | recepce.tech",
    template: "%s | recepce.tech",
  },
  description:
    "Developer a tvůrce produktů. AI nástroje, moderní weby a software — vše od nápadu po produkt.",
  keywords: [
    "Matyáš Vojan",
    "developer",
    "software",
    "AI nástroje",
    "weby",
    "produkty",
    "Czech developer",
  ],
  authors: [{ name: "Matyáš Vojan" }],
  creator: "Matyáš Vojan",
  publisher: "recepce.tech",
  metadataBase: new URL("https://recepce.tech"),
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
    siteName: "recepce.tech",
    title: "Matyáš Vojan — Developer & Product Builder",
    description:
      "Developer a tvůrce produktů. AI nástroje, moderní weby a software — vše od nápadu po produkt.",
    url: "https://recepce.tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matyáš Vojan — Developer & Product Builder",
    description:
      "Developer a tvůrce produktů. AI nástroje, moderní weby a software — vše od nápadu po produkt.",
  },
  icons: { icon: "/favicon.svg" },
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Matyáš Vojan",
    jobTitle: "Developer & Product Builder",
    url: "https://recepce.tech",
    worksFor: {
      "@type": "Organization",
      name: "recepce.tech",
      url: "https://recepce.tech",
    },
  };

  return (
    <html lang="cs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
