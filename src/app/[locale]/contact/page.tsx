import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { createMetadata } from "@/lib/seo";
import ContactContent from "@/components/ContactContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale as Locale, {
    title: "Kontakt — AI Recepční a automatizace na míru",
    titleEn: "Contact — AI Receptionist & Custom Automation",
    description:
      "Objednejte si konzultaci. AI recepční, voice asistenti, chat roboti a automatizace pro vaši firmu.",
    descriptionEn:
      "Book a consultation. AI receptionists, voice assistants, chatbots and automation for your business.",
    path: "/contact",
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  return <ContactContent locale={locale as Locale} />;
}
