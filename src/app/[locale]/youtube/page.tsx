import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { createMetadata } from "@/lib/seo";
import { getPage } from "@/content/repository";
import YouTubeContent from "@/components/YouTubeContent";
import { SOCIALS } from "@/config/socials";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = getPage("youtube")?.seo;
  return createMetadata(locale as Locale, {
    title: seo?.title.cs ?? "",
    titleEn: seo?.title.en ?? "",
    description: seo?.description.cs ?? "",
    descriptionEn: seo?.description.en ?? "",
    path: "/youtube",
  });
}

export default async function YoutubePage({ params }: Props) {
  const { locale } = await params;
  return <YouTubeContent locale={locale as Locale} channelUrl={SOCIALS.youtube} />;
}
