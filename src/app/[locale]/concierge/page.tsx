import type { Locale } from "@/lib/types";
import ConciergeContent from "./ConciergeContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ConciergePage({ params }: Props) {
  const { locale } = await params;
  return <ConciergeContent locale={locale as Locale} />;
}
