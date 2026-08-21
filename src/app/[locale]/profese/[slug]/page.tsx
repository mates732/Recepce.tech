import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import { createMetadata } from "@/lib/seo";
import { list } from "@/content/repository";
import ProfessionDetailContent from "./ProfessionDetailContent";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return list("profession").map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const prof = list("profession").find((p) => p.id === slug);
  if (!prof) return {};
  const isCs = locale === "cs";
  const name = isCs ? prof.cs.name : prof.en.name;
  const nameLower = name.toLowerCase();

  return createMetadata(locale as Locale, {
    title: `${name} — Systém pro každou návštěvu`,
    titleEn: `${name} — A System for Every Visit`,
    description: `Komunikační a rezervační systém pro ${nameLower}. Automatické rezervace, SMS připomínky a správa hovorů 24/7.`,
    descriptionEn: `Communication and booking system for ${nameLower}. Automated bookings, SMS reminders and call management 24/7.`,
    path: `/profese/${slug}`,
  });
}

export default async function ProfessionPage({ params }: Props) {
  const { locale, slug } = await params;
  const prof = list("profession").find((p) => p.id === slug);
  if (!prof) notFound();
  return (
    <ProfessionDetailContent locale={locale as Locale} slug={slug} />
  );
}
