import type { Locale } from "@/lib/types";

export interface DevLogEntry {
  id: string;
  projectSlug: string;
  date: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  impact: Record<Locale, string>;
}

export const devLog: DevLogEntry[] = [
  {
    id: "cortex-001",
    projectSlug: "cortex",
    date: "2026-03",
    title: { cs: "První prototyp pipeline", en: "First pipeline prototype" },
    description: {
      cs: "Sestaven základní framework pro automatizovaný tok dat — od sběru přes analýzu po výstup.",
      en: "Built the basic framework for automated data flow — from collection through analysis to output.",
    },
    impact: {
      cs: "Ověřena funkčnost konceptu end-to-end.",
      en: "Validated the end-to-end concept.",
    },
  },
  {
    id: "cortex-002",
    projectSlug: "cortex",
    date: "2026-05",
    title: { cs: "Scoring a personalizace", en: "Scoring and personalization" },
    description: {
      cs: "Přidán modul pro scoring klientů a generování personalizovaných zpráv na základě kontextu.",
      en: "Added client scoring module and personalized message generation based on context.",
    },
    impact: {
      cs: "Pipeline nyní generuje akční výstupy.",
      en: "Pipeline now generates actionable outputs.",
    },
  },
  {
    id: "cortex-003",
    projectSlug: "cortex",
    date: "2026-06",
    title: { cs: "End-to-end běh", en: "End-to-end run" },
    description: {
      cs: "Celý tok běží automaticky — identifikace, sběr, scoring, personalizace, distribuce.",
      en: "The full flow runs automatically — identification, collection, scoring, personalization, distribution.",
    },
    impact: {
      cs: "Systém připravený na reálné testování.",
      en: "System ready for real-world testing.",
    },
  },
  {
    id: "recepce-001",
    projectSlug: "recepce-tech",
    date: "2025-06",
    title: { cs: "Hlasový engine", en: "Voice engine" },
    description: {
      cs: "Nasazen hlasový engine s podporou češtiny a angličtiny. Základní konverzace funguje.",
      en: "Deployed voice engine with Czech and English support. Basic conversation works.",
    },
    impact: {
      cs: "První funkční prototyp AI recepční.",
      en: "First functional AI receptionist prototype.",
    },
  },
  {
    id: "recepce-002",
    projectSlug: "recepce-tech",
    date: "2025-08",
    title: { cs: "Správa rezervací", en: "Booking management" },
    description: {
      cs: "Přidána integrace s kalendáři a automatická správa rezervací během hovoru.",
      en: "Added calendar integration and automatic booking management during calls.",
    },
    impact: {
      cs: "AI recepční nyní řeší reálné úkoly.",
      en: "AI receptionist now handles real tasks.",
    },
  },
  {
    id: "recepce-003",
    projectSlug: "recepce-tech",
    date: "2025-10",
    title: { cs: "Profesní demo", en: "Profession demos" },
    description: {
      cs: "Vytvořena demo pro 6 profesí — hotel, kadeřnictví, restaurace, právník, ordinace, e-shop.",
      en: "Created demos for 6 professions — hotel, barbershop, restaurant, lawyer, practice, e-shop.",
    },
    impact: {
      cs: "Schopnost prezentovat produkt na konkrétních příkladech.",
      en: "Ability to present the product with concrete examples.",
    },
  },
  {
    id: "zlaty-001",
    projectSlug: "zlaty-hreben",
    date: "2025-04",
    title: { cs: "Návrh a vývoj", en: "Design and development" },
    description: {
      cs: "Vytvořen čistý, responzivní web zaměřený na rychlost a jednoduchost.",
      en: "Created a clean, responsive website focused on speed and simplicity.",
    },
    impact: {
      cs: "Hotový koncept připravený k nasazení.",
      en: "Finished concept ready for deployment.",
    },
  },
  {
    id: "ponici-001",
    projectSlug: "ponici",
    date: "2024-05",
    title: { cs: "Nasazení webu", en: "Website launch" },
    description: {
      cs: "Web nasazen s online rezervací, fotogalerií a kontaktním formulářem.",
      en: "Website deployed with online booking, photo gallery, and contact form.",
    },
    impact: {
      cs: "Spokojený klient, web aktivně používán.",
      en: "Satisfied client, website actively used.",
    },
  },
];
