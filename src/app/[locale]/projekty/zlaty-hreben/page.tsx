import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { createMetadata } from "@/lib/seo";
import { getPage } from "@/content/repository";
import ZlatyHrebenContent from "./ZlatyHrebenContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = getPage("zlaty-hreben")?.seo;
  return createMetadata(locale as Locale, {
    title: seo?.title.cs ?? "",
    titleEn: seo?.title.en ?? "",
    description: seo?.description.cs ?? "",
    descriptionEn: seo?.description.en ?? "",
    path: "/projekty/zlaty-hreben",
  });
}

export default async function ZlatyHrebenPage({ params }: Props) {
  const { locale } = await params;
  return <ZlatyHrebenContent locale={locale as Locale} />;
}
