import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { createMetadata } from "@/lib/seo";
import { getPage } from "@/content/repository";
import WebsitesContent from "@/components/WebsitesContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = getPage("webs")?.seo;
  return createMetadata(locale as Locale, {
    title: seo?.title.cs ?? "",
    titleEn: seo?.title.en ?? "",
    description: seo?.description.cs ?? "",
    descriptionEn: seo?.description.en ?? "",
    path: "/webs",
  });
}

export default async function WebsPage({ params }: Props) {
  const { locale } = await params;
  return <WebsitesContent locale={locale as Locale} />;
}
