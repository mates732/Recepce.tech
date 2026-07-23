"use client";

import type { Locale } from "@/lib/types";
import PersonalPage from "@/components/sections/PersonalPage";

interface HomePageProps {
  locale: Locale;
}

export default function HomePage({ locale }: HomePageProps) {
  return <PersonalPage locale={locale} />;
}
