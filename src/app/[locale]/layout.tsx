import type { Locale } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <>
      <LocaleHtmlLang locale={loc} />
      <Navbar locale={loc} />
      <main className="relative z-10 min-h-screen">
        <ErrorBoundary>
          <PageTransitionProvider>
            {children}
          </PageTransitionProvider>
        </ErrorBoundary>
      </main>
      <Footer locale={loc} />
    </>
  );
}
