import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import ChatAssistantContent from "@/components/ChatAssistantContent";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "cs" ? "Chat Assistant — AI chatbot pro web" : "Chat Assistant — AI chatbot for your website",
    description: locale === "cs"
      ? "AI asistent, který vyhledává, přemýšlí, tvoří a dokončuje práci — aniž byste opustili konverzaci."
      : "An AI assistant that searches, thinks, creates and completes work — without leaving the conversation.",
  };
}

export default async function ChatAssistantPage({ params }: Props) {
  const { locale } = await params;
  return <ChatAssistantContent locale={locale as Locale} />;
}
