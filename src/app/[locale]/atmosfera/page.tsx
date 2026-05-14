import type { Locale } from "@/lib/types";
import AtmosferaContent from "./AtmosferaContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AtmosferaPage({ params }: Props) {
  const { locale } = await params;
  return <AtmosferaContent locale={locale as Locale} />;
}
