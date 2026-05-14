import type { Locale } from "@/lib/types";
import PrivateContent from "./PrivateContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function PrivatePage({ params }: Props) {
  const { locale } = await params;
  return <PrivateContent locale={locale as Locale} />;
}
