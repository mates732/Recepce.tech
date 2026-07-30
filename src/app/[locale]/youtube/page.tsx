import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import YouTubeContent from "@/components/YouTubeContent";
import { SOCIALS } from "@/config/socials";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "YouTube",
    description: locale === "cs"
      ? "Každý produkt, experiment i launch dokumentuji veřejně. Bez přikrášlování. Jen skutečný vývoj."
      : "Every product, experiment and launch is documented in public. No embellishment. Just real development.",
  };
}

export default async function YoutubePage({ params }: Props) {
  const { locale } = await params;
  return <YouTubeContent locale={locale as Locale} channelUrl={SOCIALS.youtube} />;
}
