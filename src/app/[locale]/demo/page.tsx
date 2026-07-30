import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import DemoContent from "@/components/DemoContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "cs" ? "Živá dema — AI Asistenti v akci" : "Live Demos — AI Assistants in Action",
    description: locale === "cs"
      ? "Vyzkoušejte si reálné konverzace s AI asistentem v různých odvětvích."
      : "Experience real AI conversations across different industries.",
  };
}

export default async function DemoPage({ params }: Props) {
  const { locale } = await params;
  return <DemoContent locale={locale as Locale} />;
}
