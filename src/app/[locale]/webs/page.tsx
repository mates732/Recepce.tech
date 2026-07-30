import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import WebsitesContent from "@/components/WebsitesContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "cs" ? "Weby — Websites people remember" : "Websites — Websites people remember",
    description: locale === "cs"
      ? "Ne šablony. Ne generické. Digitální zážitky navržené tak, aby vás nebylo možné ignorovat."
      : "Not templates. Not generic. Digital experiences designed to make your business impossible to ignore.",
  };
}

export default async function WebsPage({ params }: Props) {
  const { locale } = await params;
  return <WebsitesContent locale={locale as Locale} />;
}
