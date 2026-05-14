import type { Locale } from "@/lib/types";
import ContactContent from "@/components/ContactContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  return <ContactContent locale={locale as Locale} />;
}
