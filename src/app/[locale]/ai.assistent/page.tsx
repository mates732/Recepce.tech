import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import AiAssistentContent from "@/components/AiAssistentContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "cs" ? "AI Asistenti — Inteligentní chatboti a voice AI" : "AI Assistants — Intelligent chatbots & voice AI",
    description: locale === "cs"
      ? "Jedna inteligence. Více způsobů komunikace. Voice Assistant a Chat Assistant sdílejí stejné znalosti, paměť i integrace."
      : "One intelligence. Multiple ways to communicate. Voice Assistant and Chat Assistant share the same knowledge, memory and integrations.",
  };
}

export default async function AiAssistentPage({ params }: Props) {
  const { locale } = await params;
  return <AiAssistentContent locale={locale as Locale} />;
}
