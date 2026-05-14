import type { Metadata } from "next";
import "./globals.css";
import AmbientBackground from "@/components/AmbientBackground";

export const metadata: Metadata = {
  title: "recepce.tech — AI concierge infrastructure",
  description: "AI receptionist that answers the phone for you. AI concierge system for modern business.",
  icons: { icon: "/favicon.svg" },
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
      <body>
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
