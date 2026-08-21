import type { PageContent } from "../../types";

export const PROJEKTY_PAGE: PageContent<"projekty"> = {
  kind: "page",
  id: "projekty",
  slug: "projekty",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  seo: {
    title: { cs: "Projekty — Recepce.tech", en: "Projects — Recepce.tech" },
    description: {
      cs: "Systémy, které jsme navrhli, postavili a spustili. Weby, komunikace, automatizace a další.",
      en: "Systems we designed, built and launched. Websites, communication, automation and more.",
    },
  },
  data: {
    badge: { cs: "Projekty", en: "Projects" },
    title: { cs: "Vše, co jsem postavil.", en: "Everything I've built." },
    subtitle: {
      cs: "Systémy, weby a automatizace — od nápadu po produkt.",
      en: "Systems, websites and automation — from idea to product.",
    },
  },
};

export const WEBS_PAGE: PageContent<"webs"> = {
  kind: "page",
  id: "webs",
  slug: "webs",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  seo: {
    title: { cs: "Weby — Websites people remember", en: "Websites — Websites people remember" },
    description: {
      cs: "Ne šablony. Ne generické. Digitální zážitky navržené tak, aby vás nebylo možné ignorovat.",
      en: "Not templates. Not generic. Digital experiences designed to make your business impossible to ignore.",
    },
  },
  data: {
    badge: { cs: "Weby", en: "Websites" },
    title: { cs: "Weby, které si lidé pamatují.", en: "Websites people remember." },
    subtitle: {
      cs: "Ne šablony. Ne generické. Prémiové prezentace navržené od nuly.",
      en: "Not templates. Not generic. Premium presentations designed from scratch.",
    },
  },
};

export const COMMUNICATION_PAGE: PageContent<"communication"> = {
  kind: "page",
  id: "communication",
  slug: "communication",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  seo: {
    title: {
      cs: "Komunikační systémy — hlas a chat",
      en: "Communication Systems — voice & chat",
    },
    description: {
      cs: "Jedna inteligence. Více způsobů komunikace. Voice a chat sdílejí stejné znalosti, paměť i integrace.",
      en: "One intelligence. Multiple ways to communicate. Voice and chat share the same knowledge, memory and integrations.",
    },
  },
  data: {
    badge: { cs: "Komunikační systémy", en: "Communication Systems" },
  },
};

export const CONTACT_PAGE: PageContent<"contact"> = {
  kind: "page",
  id: "contact",
  slug: "contact",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  seo: {
    title: {
      cs: "Kontakt — Digitální systémy na míru",
      en: "Contact — Custom Digital Systems",
    },
    description: {
      cs: "Objednejte si konzultaci. Weby, komunikační systémy, automatizace a interní nástroje pro vaši firmu.",
      en: "Book a consultation. Websites, communication systems, automation and internal tools for your business.",
    },
  },
  data: {},
};

export const PROSESE_PAGE: PageContent<"profese"> = {
  kind: "page",
  id: "profese",
  slug: "profese",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  seo: {
    title: { cs: "Profese — Systémy pro každé odvětví", en: "Industries — Systems for Every Business" },
    description: {
      cs: "Komunikační a rezervační systémy pro kadeřnictví, zubní kliniky, restaurace, masáže, fitness a další. Vyzkoušejte si živé demo.",
      en: "Communication and booking systems for hair salons, dental clinics, restaurants, massage studios, fitness centers and more. Try a live demo.",
    },
  },
  data: {},
};
