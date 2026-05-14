import type { Locale } from "@/lib/types";
import StatusContent from "./StatusContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function StatusPage({ params }: Props) {
  const { locale } = await params;
  return <StatusContent locale={locale as Locale} />;
}
