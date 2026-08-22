import type { PageContent } from "../../types";

export const CHAT_PAGE: PageContent<"chat"> = {
  kind: "page",
  id: "chat",
  slug: "chat",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  seo: {
    title: { cs: "Propojená komunikace napříč kanály", en: "Connected Communication Across Channels" },
    description: {
      cs: "Systém, který vyhledává, přemýšlí a dokončuje práci — aniž byste opustili konverzaci.",
      en: "A system that searches, thinks and completes work — without leaving the conversation.",
    },
  },
  data: {
    facts: [
      {
        label: { cs: "Role", en: "Role" },
        value: { cs: "Vlastní produkt", en: "Own product" },
      },
      {
        label: { cs: "Schopnost", en: "Capability" },
        value: { cs: "Chat napříč kanály", en: "Chat across channels" },
      },
      {
        label: { cs: "Výsledek", en: "Result" },
        value: { cs: "Jeden systém na webu, WhatsAppu i SMS", en: "One system on web, WhatsApp and SMS" },
      },
      {
        label: { cs: "Živé", en: "Live" },
        value: { cs: "Živé demo", en: "Live demo" },
        href: "/demo",
      },
    ],
    badge: { cs: "Propojená komunikace", en: "Connected Communication" },
    crossLink: {
      label: { cs: "Otevřít telefonní komunikaci", en: "Open Phone Communication" },
      href: "/projekty/asistenti/telefonni-asistent",
    },
    heroTitle: [
      { cs: "Komunikuje všude,", en: "Communicates wherever" },
      { cs: "kde vaši zákazníci píší.", en: "your customers write." },
    ],
    heroDesc: {
      cs: "Jednotná komunikační vrstva pro web, zprávy a další kontaktní body. Firmy zůstávají dostupné a zákazníci vždy najdou správnou cestu.",
      en: "A unified communication layer for web, messaging and other touchpoints. Businesses stay accessible and customers always find the right path.",
    },
    channelsLabel: { cs: "Textové kanály", en: "Text channels" },
    channels: {
      cs: "Web · WhatsApp · SMS · Messenger · Instagram · Telegram · E-mail",
      en: "Website · WhatsApp · SMS · Messenger · Instagram · Telegram · Email",
    },
    conversation: {
      label: { cs: "Skutečná konverzace", en: "Real conversation" },
      sections: [
        {
          label: { cs: "Webový chat", en: "Website Chat" },
          messages: [
            { from: "user", text: { cs: "Máte zítra volný termín?", en: "Do you have availability tomorrow?" } },
            { from: "ai", text: { cs: "Ano. 15:00 nebo 16:30.", en: "Yes. 15:00 or 16:30." } },
          ],
        },
        {
          label: { cs: "WhatsApp", en: "WhatsApp" },
          messages: [
            { from: "user", text: { cs: "Kolik to stojí?", en: "What is the price?" } },
            { from: "ai", text: { cs: "Cena začíná na…\nChcete poslat nabídku?", en: "It starts at…\nWould you like a quotation?" } },
          ],
        },
        {
          label: { cs: "Telefon", en: "Phone" },
          messages: [
            {
              from: "user",
              wide: true,
              text: {
                cs: "Vítejte zpět, pane Nováku. Našel jsem vaši konverzaci z webu i WhatsAppu. Můžeme navázat.",
                en: "Welcome back. I found your conversation from the website and WhatsApp. We can continue where we left off.",
              },
            },
          ],
        },
      ],
    },
    integrations: {
      label: { cs: "Propojeno s", en: "Connected to" },
      value: "Calendar / CRM / Email",
    },
    flow: {
      label: { cs: "Jedna konverzace.", en: "One conversation." },
      heading: { cs: "Každý kanál.", en: "Every channel." },
      sub: {
        cs: "Ať už píše z webu, WhatsAppu nebo SMS — systém odpovídá všude stejně.",
        en: "Whether they write from the web, WhatsApp or SMS — the system answers everywhere the same.",
      },
      messages: [
        { text: "Dobrý den, chtěl bych se zeptat na otevírací dobu.", channel: "Web" },
        { text: "Hi, do you have any availability this week?", channel: "Web" },
        { text: "Můžu si rezervovat stůl na zítra?", channel: "WhatsApp" },
        { text: "Posílám objednávku č. 2847 — prosím o potvrzení.", channel: "SMS" },
        { text: "Jakou máte aktuální cenu za servis?", channel: "Messenger" },
        { text: "Chtěl bych zrušit rezervaci na pátek.", channel: "WhatsApp" },
        { text: "Děkuji za rychlé vyřízení!", channel: "Web" },
        { text: "Máte volno v úterý odpoledne?", channel: "SMS" },
        { text: "Potvrzuji schůzku na středu 14:00.", channel: "Messenger" },
        { text: "Can I change my booking to Saturday?", channel: "Web" },
      ],
    },
  },
};
