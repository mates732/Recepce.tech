import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { createMetadata } from "@/lib/seo";
import AiAssistentContent from "@/components/AiAssistentContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale as Locale, {
    title: "AI Recepční — Inteligentní hlasová recepční pro firmy",
    titleEn: "AI Receptionist — Intelligent Voice Receptionist for Business",
    description:
      "AI recepční, která přijímá hovory, rezervuje termíny a odpovídá na dotazy 24/7. Voice AI pro automatizaci komunikace.",
    descriptionEn:
      "AI receptionist that answers calls, books appointments and responds to inquiries 24/7. Voice AI for business communication automation.",
    path: "/ai-receptionist",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <AiAssistentContent locale={locale as Locale} />;
}
