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
        title: "Phone System",
        desc: {
          cs: "Telefonní komunikace. Přirozené hovory, rezervace schůzek, kvalifikace kontaktů. 24/7 telefonní recepce.",
          en: "Phone communication. Natural conversations, appointment booking, lead qualification. 24/7 phone reception.",
        },
        href: "/systems/communication/voice",
      },
      {
        title: "Channel Communication",
        desc: {
          cs: "Komunikace pro web, WhatsApp a SMS. Zákaznická podpora, znalostní báze, zachytávání kontaktů.",
          en: "Communication for web, WhatsApp and SMS. Customer support, knowledge base, lead capture.",
        },
        href: "/systems/communication/chat",
      },
      {
        title: "Cortex",
        desc: {
          cs: "Prodejní systém. Vyhledá firmy. Vyhodnotí příležitosti. Osloví automaticky.",
          en: "A sales system. Finds leads. Evaluates opportunities. Reaches out automatically.",
        },
        href: "/cortex",
      },
      {
        title: "Premium Websites",
        desc: {
          cs: "Weby, které si lidé pamatují. Prémiové prezentace navržené od nuly.",
          en: "Websites people remember. Premium presentations designed from scratch.",
        },
        href: "/webs",
      },
      {
        title: "Automation",
        desc: {
          cs: "Automatizace firemních procesů. Workflow. Integrace. Úspora času.",
          en: "Business process automation. Workflows. Integrations. Time savings.",
        },
        href: "/contact",
      },
    ],
  },
};
