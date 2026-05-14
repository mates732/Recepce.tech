import type { Locale } from "@/lib/types";
import ProfessionDetailContent from "./ProfessionDetailContent";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return [
    "barbershop",
    "dentalni-hygiena",
    "estetika",
    "fitness",
    "kadernictvi",
    "masaze",
    "stomatologie",
  ].map((slug) => ({ slug }));
}

export default async function ProfessionPage({ params }: Props) {
  const { locale, slug } = await params;
  return (
    <ProfessionDetailContent locale={locale as Locale} slug={slug} />
  );
}
