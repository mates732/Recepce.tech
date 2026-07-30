import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import CortexContent from "@/components/cortex/CortexContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "cs" ? "Cortex — Inteligence pohánějící Recepce.tech" : "Cortex — The intelligence powering Recepce.tech";
  const description = locale === "cs"
    ? "Cortex je interní platforma pro analýzu firem, vyhledávání příležitostí a AI automatizaci."
    : "Cortex is an internal platform for company analysis, opportunity discovery and AI automation.";
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function CortexPage({ params }: Props) {
  const { locale } = await params;
  return <CortexContent locale={locale as Locale} />;
}
