import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import VoiceAssistantContent from "@/components/VoiceAssistantContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "cs" ? "Voice Assistant — AI telefonní recepční" : "Voice Assistant — AI phone receptionist",
    description: locale === "cs"
      ? "AI asistent, který rozumí přirozené řeči. Přijímá hovory, rezervuje schůzky a odpovídá na dotazy."
      : "An AI assistant that understands natural speech. Answers calls, books appointments and responds to questions.",
  };
}

export default async function VoiceAssistantPage({ params }: Props) {
  const { locale } = await params;
  return <VoiceAssistantContent locale={locale as Locale} />;
}
