import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Recepce.tech — Intelligent Systems",
    template: "%s | Recepce.tech",
  },
  description:
    "I build intelligent systems. AI receptionists, chat assistants, premium websites, automations, and internal AI systems.",
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
    siteName: "Recepce.tech",
    title: "Recepce.tech — Intelligent Systems",
    description:
      "I build intelligent systems. AI receptionists, chat assistants, premium websites, automations, and internal AI systems.",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
