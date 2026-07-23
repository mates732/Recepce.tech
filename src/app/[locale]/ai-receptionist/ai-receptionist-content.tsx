"use client";

import type { Locale } from "@/lib/types";
import LandingPage from "@/components/sections/LandingPage";

interface AiReceptionistPageProps {
  locale: Locale;
}

export default function AiReceptionistPage({ locale }: AiReceptionistPageProps) {
  return <LandingPage locale={locale} />;
}
