import type { Locale } from "@/lib/types";
import ProfeseContent from "./ProfeseContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ProfesePage({ params }: Props) {
  const { locale } = await params;
  return <ProfeseContent locale={locale as Locale} />;
}
