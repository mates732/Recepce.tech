import type { Locale } from "@/lib/types";
import HeroSection from "@/components/sections/HeroSection";
import EcosystemSection from "@/components/sections/EcosystemSection";
import ProcessSection from "@/components/sections/ProcessSection";
import YoutubeSection from "@/components/sections/YoutubeSection";
import AboutSection from "@/components/sections/AboutSection";
import FinalCtaSection from "@/components/sections/FinalCtaSection";

interface EcosystemHomeProps {
  locale: Locale;
}

export default function EcosystemHome({ locale }: EcosystemHomeProps) {
  return (
    <>
      <HeroSection locale={locale} />
      <EcosystemSection locale={locale} />
      <ProcessSection locale={locale} />
      <YoutubeSection locale={locale} />
      <AboutSection locale={locale} />
      <FinalCtaSection locale={locale} />
    </>
  );
}
