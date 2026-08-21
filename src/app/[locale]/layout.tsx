import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { BASE_URL, SITE_NAME, websiteJsonLd, jsonLdScript } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import MotionProvider from "@/components/MotionProvider";
import CursorGlow from "@/components/CursorGlow";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const isCs = loc === "cs";

  return {
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        cs: `${BASE_URL}/cs`,
        en: `${BASE_URL}/en`,
      },
    },
    openGraph: {
      locale: isCs ? "cs_CZ" : "en_US",
      alternateLocale: isCs ? "en_US" : "cs_CZ",
      siteName: SITE_NAME,
      url: `${BASE_URL}/${locale}`,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <MotionProvider>
      <LocaleHtmlLang locale={loc} />
      <CursorGlow />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(websiteJsonLd(locale as Locale))}
      />
      <Navbar locale={loc} />
      <main className="relative z-10 min-h-screen">
        <ErrorBoundary>
          <PageTransitionProvider>
            {children}
          </PageTransitionProvider>
        </ErrorBoundary>
      </main>
      <Footer locale={loc} />
    </MotionProvider>
  );
}
