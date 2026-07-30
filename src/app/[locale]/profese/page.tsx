import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { createMetadata } from "@/lib/seo";
import ProfeseContent from "./ProfeseContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale as Locale, {
    title: "Profese — AI Recepční pro každé odvětví",
    titleEn: "Industries — AI Receptionist for Every Business",
    description:
      "AI recepční pro kadeřnictví, zubní kliniky, restaurace, masáže, fitness a další. Vyzkoušejte si živé demo.",
    descriptionEn:
      "AI receptionist for hair salons, dental clinics, restaurants, massage studios, fitness centers and more. Try a live demo.",
    path: "/profese",
  });
}

export default async function ProfesePage({ params }: Props) {
  const { locale } = await params;
  return <ProfeseContent locale={locale as Locale} />;
}
