import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import ZlatyHrebenContent from "./ZlatyHrebenContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "cs" ? "Zlatý Hřeben — Projekt webu" : "Zlatý Hřeben — Website Project",
    description: locale === "cs"
      ? "Case study webového projektu, který nedosáhl produkce. Design, proces a vizuální směr."
      : "A case study of a web project that never reached production. Design, process and visual direction.",
  };
}

export default async function ZlatyHrebenPage({ params }: Props) {
  const { locale } = await params;
  return <ZlatyHrebenContent locale={locale as Locale} />;
}
