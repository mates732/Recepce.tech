"use client";

import type { Locale } from "@/lib/types";
import Hero from "./Hero";
import About from "./About";
import CaseStudies from "./CaseStudies";
import Elsewhere from "./Elsewhere";

export default function PersonalPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
      <About locale={locale} />
      <CaseStudies locale={locale} />
      <Elsewhere locale={locale} />
    </>
  );
}
