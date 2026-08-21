import type { Localized, PageSlug, SectionType } from "./types";

/**
 * Registr sekcí webu — jediné místo, které mapuje typ sekce
 * na admin metadata (label, popis) a stránky, kde se sekce může vyskytovat.
 * Render sekcí řeší stránková komponenta podle pořadí v data.sections.
 */

export interface SectionTypeMeta {
  type: SectionType;
  label: Localized;
  description: Localized;
  pages: PageSlug[];
}

export const SECTION_TYPES: SectionTypeMeta[] = [
  {
    type: "hero",
    label: { cs: "Hero", en: "Hero" },
    description: { cs: "Úvodní titul s CTA do laboratoře.", en: "Intro title with a laboratory CTA." },
    pages: ["home"],
  },
  {
    type: "laboratory",
    label: { cs: "Laboratoř", en: "Laboratory" },
    description: { cs: "Experimentální a výzkumné projekty.", en: "Experimental and research projects." },
    pages: ["home"],
  },
  {
    type: "liveSystems",
    label: { cs: "Systémy v provozu", en: "Live Systems" },
    description: { cs: "Produkční systémy s dopadem na byznys.", en: "Production systems with business impact." },
    pages: ["home"],
  },
  {
    type: "systemsAudit",
    label: { cs: "Systémový audit", en: "Systems Audit" },
    description: { cs: "Dotazník, který najde systémové příležitosti pro firmu.", en: "A questionnaire that finds system opportunities for a business." },
    pages: ["home"],
  },
  {
    type: "systems",
    label: { cs: "Architektura", en: "Systems Architecture" },
    description: { cs: "Stack — od problému po byznys výstup.", en: "Stack — from problem to business outcome." },
    pages: ["home"],
  },
  {
    type: "caseStudies",
    label: { cs: "Případové studie", en: "Case Studies" },
    description: { cs: "Transformace: problém → řešení → technologie → výsledek.", en: "Transformations: problem → solution → technology → result." },
    pages: ["home"],
  },
  {
    type: "trustProof",
    label: { cs: "Důvěra a důkazy", en: "Trust & Proof" },
    description: { cs: "Reálné systémy — nejen koncepty.", en: "Real systems — not just concepts." },
    pages: ["home"],
  },
  {
    type: "audience",
    label: { cs: "Pro koho", en: "Audience" },
    description: { cs: "Kde má systém největší smysl.", en: "Where a system makes the most sense." },
    pages: ["home"],
  },
  {
    type: "whatWeBuild",
    label: { cs: "Co stavíme", en: "What We Build" },
    description: { cs: "Kategorie systémů, které navrhujeme a stavíme.", en: "The categories of systems we design and build." },
    pages: ["home"],
  },
  {
    type: "controlRoom",
    label: { cs: "Řídicí centrum", en: "Control Room" },
    description: { cs: "Inženýrské prostředí — aktivní systémy a modely.", en: "Engineering environment — active systems and models." },
    pages: ["home"],
  },
  {
    type: "experiments",
    label: { cs: "Časová osa experimentů", en: "Experiments Timeline" },
    description: { cs: "Probíhající výzkum a budoucí systémy.", en: "Current research and future systems." },
    pages: ["home"],
  },
  {
    type: "ecosystem",
    label: { cs: "Ekosystém", en: "Ecosystem" },
    description: { cs: "Přehled projektů na domovské stránce.", en: "Projects overview on the home page." },
    pages: ["home"],
  },
  {
    type: "process",
    label: { cs: "Proces", en: "Process" },
    description: { cs: "Časová osa vzniku systémů.", en: "System building timeline." },
    pages: ["home"],
  },
  {
    type: "youtube",
    label: { cs: "YouTube sekce", en: "YouTube section" },
    description: { cs: "Upoutávka na YouTube kanál.", en: "YouTube channel teaser." },
    pages: ["home"],
  },
  {
    type: "about",
    label: { cs: "O mně", en: "About" },
    description: { cs: "Profil autora s hodnotami.", en: "Author profile and principles." },
    pages: ["home"],
  },
  {
    type: "finalCta",
    label: { cs: "Závěrečné CTA", en: "Final CTA" },
    description: { cs: "Závěrečná výzva ke kontaktu.", en: "Final call to action." },
    pages: ["home"],
  },
];

const BY_TYPE = new Map(SECTION_TYPES.map((meta) => [meta.type, meta]));

export function getSectionMeta(type: SectionType): SectionTypeMeta | undefined {
  return BY_TYPE.get(type);
}

export function isSectionType(value: string): value is SectionType {
  return BY_TYPE.has(value as SectionType);
}
