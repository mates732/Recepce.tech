import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import AiReceptionistPage from "./ai-receptionist-content";

export const metadata: Metadata = {
  title: "AI Receptionist — Nikdy nezmeškejte žádný hovor",
  description:
    "AI recepční, která zvedne každý hovor, zapíše rezervaci a odpoví na otázku — 24/7, bez přestávek. Mluví česky i anglicky.",
  openGraph: {
    title: "AI Receptionist — Nikdy nezmeškejte žádný hovor",
    description:
      "AI recepční, která zvedne každý hovor, zapíše rezervaci a odpoví na otázku — 24/7, bez přestávek.",
  },
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <AiReceptionistPage locale={locale as Locale} />;
}
