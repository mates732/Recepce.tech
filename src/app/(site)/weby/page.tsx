import type { Metadata } from 'next';
import HeroWeby from '@/components/home/HeroWeby';
import WebWebyPortfolio from '@/components/home/WebWebyPortfolio';
import WebWebyProces from '@/components/home/WebWebyProces';
import WebCoNabizime from '@/components/home/WebCoNabizime';
import WebWebyVysledek from '@/components/home/WebWebyVysledek';
import FinalCtaWeby from '@/components/home/FinalCtaWeby';
import FAQ from '@/components/shared/FAQ';
import { WEBY_FAQ_ITEMS } from '@/data/weby-faq';

export const metadata: Metadata = {
  title: 'Weby | Recepce.tech',
  description:
    'Web studio Matyáše — weby od konceptu přes strukturu a vizuál po build a spuštění. Vybrané projekty, způsob práce a kontakt.',
};

export default function WebyPage() {
  return (
    <>
      {/* 01 — HERO: who I am + work immediately in view */}
      <HeroWeby />

      {/* 02 — SELECTED PROJECTS: primary proof, work first */}
      <WebWebyPortfolio />

      {/* 03 — HOW I WORK: personal process */}
      <WebWebyProces />

      {/* 04 — WHAT I BUILD: what every web contains + scope-dependent extras */}
      <WebCoNabizime />

      {/* 05 — WHAT THE FINISHED WEB SHOULD DO: outcomes, not guarantees */}
      <WebWebyVysledek />

      {/* 06 — FAQ (jen k webu) */}
      <FAQ
        eyebrow="FAQ"
        title="Než začneme stavět"
        description="Nejčastější otázky k tvorbě webu, rozsahu, domluvě a tomu, co se děje po spuštění."
        items={WEBY_FAQ_ITEMS}
      />

      {/* 07 — FINAL CTA */}
      <FinalCtaWeby />
    </>
  );
}
