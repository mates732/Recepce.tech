import type { Locale } from "@/lib/types";
import IntelligenceContent from "./IntelligenceContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function IntelligencePage({ params }: Props) {
  const { locale } = await params;
  return <IntelligenceContent locale={locale as Locale} />;
}
