import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { createMetadata } from "@/lib/seo";
import { PROFESSIONS } from "../professionsData";
import ProfessionDetailContent from "./ProfessionDetailContent";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const PROFESSION_META: Record<string, { nameCs: string; nameEn: string }> = {
  barbershop: { nameCs: "Barbershop", nameEn: "Barbershop" },
  "dentalni-hygiena": { nameCs: "Dentální hygiena", nameEn: "Dental Hygiene" },
  estetika: { nameCs: "Estetická klinika", nameEn: "Aesthetic Clinic" },
  fitness: { nameCs: "Fitness & PT", nameEn: "Fitness & PT" },
  kadernictvi: { nameCs: "Kadeřnictví", nameEn: "Hair Salon" },
  masaze: { nameCs: "Masáže & wellness", nameEn: "Massage & Wellness" },
  stomatologie: { nameCs: "Zubní ordinace", nameEn: "Dental Clinic" },
};

export async function generateStaticParams() {
  return Object.keys(PROFESSION_META).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const meta = PROFESSION_META[slug];
  const name = locale === "cs" ? meta?.nameCs : meta?.nameEn;

  return createMetadata(locale as Locale, {
    title: `${name} — AI Recepční na míru`,
    titleEn: `${name} — AI Receptionist for Your Business`,
    description: `AI recepční pro ${meta?.nameCs?.toLowerCase() ?? slug}. Automatické rezervace, SMS připomínky a správa hovorů 24/7.`,
    descriptionEn: `AI receptionist for ${meta?.nameEn?.toLowerCase() ?? slug}. Automated bookings, SMS reminders and call management 24/7.`,
    path: `/profese/${slug}`,
  });
}

export default async function ProfessionPage({ params }: Props) {
  const { locale, slug } = await params;
  return (
    <ProfessionDetailContent locale={locale as Locale} slug={slug} />
  );
}
