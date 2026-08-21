import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { createMetadata } from "@/lib/seo";
import { getPage } from "@/content/repository";
import DemoContent from "@/components/DemoContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = getPage("demo")?.seo;
  return createMetadata(locale as Locale, {
    title: seo?.title.cs ?? "",
    titleEn: seo?.title.en ?? "",
    description: seo?.description.cs ?? "",
    descriptionEn: seo?.description.en ?? "",
    path: "/demo",
  });
}

export default async function DemoPage({ params }: Props) {
  const { locale } = await params;
  return <DemoContent locale={locale as Locale} />;
}
