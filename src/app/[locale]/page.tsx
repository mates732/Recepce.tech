import type { Locale } from "@/lib/types";
import EcosystemHome from "@/components/home/EcosystemHome";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return {
    title: locale === "cs" ? "Recepce.tech — Inteligentní systémy" : "Recepce.tech — Intelligent Systems",
    description: locale === "cs"
      ? "Stavím inteligentní systémy. AI recepční, AI asistenti, prémiové weby, automatizace a interní AI systémy."
      : "I build intelligent systems. AI receptionists, chat assistants, premium websites, automations, and internal AI systems.",
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  return <EcosystemHome locale={locale as Locale} />;
}
