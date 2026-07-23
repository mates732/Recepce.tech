import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "recepce.tech — AI Receptionist Platform",
    template: "%s | recepce.tech",
  },
  description:
    "AI-powered receptionist platform. Voice AI assistants for businesses — available 24/7.",
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
    title: "recepce.tech — AI Receptionist Platform",
    description:
      "AI-powered receptionist platform. Voice AI assistants for businesses — available 24/7.",
    url: "https://recepce.tech",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
