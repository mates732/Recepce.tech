"use client";

import type { Locale } from "@/lib/types";
import Hero from "./LandingHero";
import ProblemSection from "./ProblemSection";
import SolutionSection from "./SolutionSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import BenefitsSection from "./BenefitsSection";
import SocialProofSection from "./SocialProofSection";
import FaqSection from "./FaqSection";
import SecuritySection from "./SecuritySection";
import OnboardingSection from "./OnboardingSection";
import SupportSection from "./SupportSection";
import PartnersSection from "./PartnersSection";
import FinalCtaSection from "./FinalCtaSection";

export default function LandingPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
      <ProblemSection locale={locale} />
      <SolutionSection locale={locale} />
      <FeaturesSection locale={locale} />
      <HowItWorksSection locale={locale} />
      <BenefitsSection locale={locale} />
      <SocialProofSection locale={locale} />
      <FaqSection locale={locale} />
      <SecuritySection locale={locale} />
      <OnboardingSection locale={locale} />
      <SupportSection locale={locale} />
      <PartnersSection locale={locale} />
      <FinalCtaSection locale={locale} />
    </>
  );
}
