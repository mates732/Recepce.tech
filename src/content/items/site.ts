import type { SiteContent } from "../types";

export const SITE_ITEM: SiteContent = {
  kind: "site",
  id: "site",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  brand: { root: "recepce", suffix: ".tech" },
  settings: {
    siteName: "Recepce.tech",
    baseUrl: "https://recepce.tech",
    description: {
      cs: "Digitální systémové studio. Navrhujeme a stavíme weby, komunikační systémy, interní nástroje a automatizaci — technologie je jen nástroj, výsledek je důvod.",
      en: "A digital systems studio. We design and build websites, communication systems, internal tools and automation — technology is just the means, results are the point.",
    },
    keywords: [
      "digital systems studio",
      "custom software",
      "web development",
      "business automation",
      "customer communication systems",
      "internal tools",
      "system design",
      "booking systems",
      "workflow automation",
      "intelligent workflows",
      "integrations",
      "custom systems",
      "digitální systémy",
      "vývoj webů",
      "automatizace firemních procesů",
      "komunikační systémy",
      "interní nástroje",
      "systémový design",
    ],
    contact: {
      phone: "+420 732 839 892",
      email: "vojanmatyas@gmail.com",
    },
    social: {
      youtube: "https://youtube.com/@Big.matysek",
      youtubeChannelId: "UC687mDK-Lmxzygu2mUztktg",
      github: "https://github.com/mates732",
      instagram: "https://www.instagram.com/i_am_trenbolone/",
    },
    business: {
      name: { cs: "Matyáš Vojan", en: "Matyáš Vojan" },
    },
  },  navigation: [
    { id: "home", labels: { cs: "Domů", en: "Home" }, href: "/" },
    {
      id: "projects",
      labels: { cs: "Projekty", en: "Projects" },
      children: [
        { id: "cortex", labels: { cs: "Cortex", en: "Cortex" }, href: "/projekty/cortex" },
    { id: "communication",
      labels: { cs: "Asistenti", en: "Assistants" },
      children: [
        { id: "overview", labels: { cs: "Přehled", en: "Overview" }, href: "/projekty/asistenti" },
        { id: "voice", labels: { cs: "Telefonní asistent", en: "Phone Assistant" }, href: "/projekty/asistenti/telefonni-asistent" },
        { id: "chat", labels: { cs: "Chat asistent", en: "Chat Assistant" }, href: "/projekty/asistenti/chat-asistent" },
      ],
    },
        { id: "websites", labels: { cs: "Weby", en: "Websites" }, href: "/projekty/weby" },
        { id: "youtube", labels: { cs: "YouTube", en: "YouTube" }, href: "/youtube" },
      ],
    },
    { id: "about", labels: { cs: "O mně", en: "About" }, href: "/o-mne" },
    { id: "contact", labels: { cs: "Kontakt", en: "Contact" }, href: "/kontakt" },
  ],
  footer: {
    tagline: {
      cs: "Digitální systémové studio. Navrhujeme a stavíme systémy, které řeší reálné problémy.",
      en: "A digital systems studio. We design and build systems that solve real problems.",
    },
    navigationHeading: { cs: "Navigace", en: "Navigate" },
    navLinks: [
      { id: "home", labels: { cs: "Domů", en: "Home" }, href: "/" },
      { id: "projects", labels: { cs: "Projekty", en: "Projects" }, href: "/projekty" },
      { id: "about", labels: { cs: "O mně", en: "About" }, href: "/o-mne" },
      { id: "contact", labels: { cs: "Kontakt", en: "Contact" }, href: "/kontakt" },
    ],
    connectHeading: { cs: "Spojení", en: "Connect" },
    madeIn: { cs: "Vytvořeno v České republice", en: "Made in the Czech Republic" },
  },
};
