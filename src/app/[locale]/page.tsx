import type { Locale } from "@/lib/types";
import HomePage from "./home";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <HomePage locale={locale as Locale} />;
}
