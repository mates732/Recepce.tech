import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import AboutContent from "@/components/AboutContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "cs" ? "Matyáš Vojan — O mně" : "Matyáš Vojan — About",
    description: locale === "cs"
      ? "Stavím inteligentní systémy, AI produkty a prémiové weby."
      : "Building intelligent systems, AI products, and premium websites.",
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  return <AboutContent locale={locale as Locale} />;
}
