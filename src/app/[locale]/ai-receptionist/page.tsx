import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import AiAssistentContent from "@/components/AiAssistentContent";

export const metadata: Metadata = {
  title: "AI Receptionist — Inteligentní chatboti a voice AI",
  description:
    "Inteligentní chatboti a voice AI pro firmy. 24/7 zákaznická podpora a recepční.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <AiAssistentContent locale={locale as Locale} />;
}
