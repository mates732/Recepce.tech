import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";
import CortexContent from "@/components/cortex/CortexContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = getPage("cortex")?.seo;
  const title = seo?.title[locale as Locale];
  const description = seo?.description[locale as Locale];
  return {
    title,
    description,
    openGraph: title ? { title, description } : undefined,
  };
}

export default async function CortexPage({ params }: Props) {
  const { locale } = await params;
  return <CortexContent locale={locale as Locale} />;
}
