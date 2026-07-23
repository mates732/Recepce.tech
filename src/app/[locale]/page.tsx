import { redirect } from "next/navigation";
import type { Locale } from "@/lib/types";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale as Locale}/ai-receptionist`);
}
