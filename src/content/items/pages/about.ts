import type { PageContent } from "../../types";

export const ABOUT_PAGE: PageContent<"about"> = {
  kind: "page",
  id: "about",
  slug: "about",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  seo: {
    title: { cs: "Matyáš Vojan — O mně", en: "Matyáš Vojan — About" },
    description: {
      cs: "Stavím digitální systémy, komunikační nástroje a prémiové weby.",
      en: "Building digital systems, communication tools, and premium websites.",
    },
  },
  data: {
    statement: {
      title: { cs: "Stavím.", en: "I build." },
      subtitle: { cs: "Ne jen software.", en: "Not just software." },
    },
    works: {
      items: [
        { cs: "Navrhuji prémiové weby.", en: "I design premium websites." },
        { cs: "Vyvíjím komunikační systémy.", en: "I build communication systems." },
        { cs: "Automatizuji firemní procesy.", en: "I automate business workflows." },
        { cs: "Vytvářím interní systémy.", en: "I create internal systems." },
      ],
    },
    personal: {
      label: { cs: "Mimo práci", en: "Outside of work" },
      title: { cs: "Jsem obvykle ve fitku.", en: "I'm usually in the gym." },
      text: {
        cs: "Na YouTube sdílím svůj fitness progres, tréninky a disciplínu, kterou se snažím přenášet i do své práce.",
        en: "On YouTube I share my fitness progress, training, and the discipline I bring into my work.",
      },
    },
    principles: {
      label: { cs: "Principy", en: "Principles" },
      items: [
        { cs: "Kvalita nad kvantitou.", en: "Quality over quantity." },
        { cs: "Na každém detailu záleží.", en: "Every detail matters." },
        { cs: "Stavím na dlouhou trať.", en: "Build for the long term." },
        { cs: "Jednoduché porazí složité.", en: "Simple beats complicated." },
        { cs: "Technologie má řešit problémy.", en: "Technology should solve problems." },
      ],
    },
    brand: {
      label: { cs: "Značka", en: "Brand" },
      title: "Recepce.tech",
      desc: {
        cs: "Místo, kde se všechny mé produkty, služby a projekty setkávají.",
        en: "The place where all my products, services and projects come together.",
      },
      explore: { cs: "Prozkoumat", en: "Explore" },
    },
    products: [
      {
        title: "Inteligentní telefonní komunikace",
        desc: {
          cs: "Moderní telefonní systém pro firmy. Vyřizování hovorů, rezervace schůzek, předávání informací a správa zákaznických požadavků kdykoliv.",
          en: "A modern phone system for businesses. Handling calls, booking meetings, sharing information and managing customer requests anytime.",
        },
        href: "/projekty/asistenti/telefonni-asistent",
      },
      {
        title: "Propojená komunikace napříč kanály",
        desc: {
          cs: "Jednotná komunikační vrstva pro web, zprávy a další kontaktní body. Firmy zůstávají dostupné a zákazníci vždy najdou správnou cestu.",
          en: "A unified communication layer for web, messaging and other touchpoints. Businesses stay accessible and customers always find the right path.",
        },
        href: "/projekty/asistenti/chat-asistent",
      },
      {
        title: "Obchodní inteligence pro růst",
        desc: {
          cs: "Systém pro vyhledávání příležitostí, analýzu trhu a práci s firemními daty. Pomáhá objevovat nové možnosti a zefektivnit obchodní procesy.",
          en: "A system for opportunity discovery, market analysis and working with business data. Helps uncover new possibilities and streamline business processes.",
        },
        href: "/projekty/cortex",
      },
      {
        title: "Digitální produkty nové generace",
        desc: {
          cs: "Webové prostředí navržené jako kompletní digitální zkušenost. Spojení designu, výkonu a technologií v jeden funkční celek.",
          en: "A web environment designed as a complete digital experience. Merging design, performance and technology into one functional whole.",
        },
        href: "/projekty/weby",
      },
    ],
  },
};
