import type { PageContent } from "../../types";

export const VOICE_PAGE: PageContent<"voice"> = {
  kind: "page",
  id: "voice",
  slug: "voice",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  seo: {
    title: { cs: "Telefonní systém — Hlasová komunikace", en: "Phone System — Voice Communication" },
    description: {
      cs: "Systém, který rozumí přirozené řeči. Přijímá hovory, rezervuje schůzky a odpovídá na dotazy 24/7.",
      en: "A system that understands natural speech. Answers calls, books appointments and responds to questions 24/7.",
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
        value: { cs: "Přirozené hlasové hovory", en: "Natural voice calls" },
      },
      {
        label: { cs: "Výsledek", en: "Result" },
        value: { cs: "Přijímá hovory a rezervuje termíny 24/7", en: "Answers calls and books appointments 24/7" },
      },
      {
        label: { cs: "Živé", en: "Live" },
        value: { cs: "Živé demo", en: "Live demo" },
        href: "/demo",
      },
    ],
    badge: { cs: "Telefonní systém", en: "Phone System" },
    crossLink: {
      label: { cs: "Otevřít kanálovou komunikaci", en: "Open Channel Communication" },
      href: "/systems/communication/chat",
    },
    heroTitle: [
      { cs: "Telefonní systém,", en: "A phone system," },
      { cs: "který skutečně", en: "that actually" },
      { cs: "rozumí lidem.", en: "understands people." },
    ],
    heroDesc: {
      cs: "Telefonní hovor není jen hovor. Je to první dojem zákazníka. Tady na něj nikdo nečeká ve frontě.",
      en: "A phone call isn't just a call. It's a customer's first impression. No one waits in line here.",
    },
    cta: { cs: "Poslechnout si demo", en: "Hear it in action" },
    capabilities: [
      "30+ LANGUAGES",
      "RESERVATIONS",
      "AVAILABLE 24/7",
      "NATURAL CONVERSATIONS",
      "CRM INTEGRATION",
      "HUMAN HANDOFF",
    ],
    languages: {
      cs: ["Čeština", "ANGLIČTINA", "NĚMČINA", "SLOVENŠTINA", "FRANCOUZŠTINA", "ŠPANĚLŠTINA", "ITALŠTINA", "POLŠTINA"],
      en: ["CZECH", "ENGLISH", "GERMAN", "SLOVAK", "FRENCH", "SPANISH", "ITALIAN", "POLISH"],
    },
    intelligence: {
      label: { cs: "Interpretace hovoru", en: "Call interpretation" },
      heading: [
        { cs: "Co systém skutečně", en: "What the system" },
        { cs: "slyší.", en: "actually hears." },
      ],
      callerLabel: { cs: "Volající", en: "Caller" },
      phrases: [
        { cs: "Dobrý den...", en: "Hello..." },
        { cs: "ehm...", en: "um..." },
        { cs: "potřeboval bych...", en: "I needed..." },
        { cs: "objednat se na zítřek...", en: "to book for tomorrow..." },
        { cs: "nebo vlastně na pátek...", en: "or actually Friday..." },
      ],
      aiLabel: { cs: "Systém rozumí", en: "The system understands" },
      steps: [
        { icon: "→", label: { cs: "Záměr rozpoznán", en: "Intent detected" }, detail: { cs: "Rezervace", en: "Appointment booking" } },
        { icon: "✓", label: { cs: "Zákazník identifikován", en: "Customer identified" }, detail: { cs: "Stávající zákazník", en: "Existing customer" } },
        { icon: "✓", label: { cs: "Datum rozpoznáno", en: "Date recognized" }, detail: { cs: "Pátek", en: "Friday" } },
        { icon: "✓", label: { cs: "Služba detekována", en: "Service detected" }, detail: { cs: "Střih", en: "Haircut" } },
        { icon: "✓", label: { cs: "Dostupnost", en: "Availability" }, detail: { cs: "15:30 volný termín", en: "15:30 available" } },
        { icon: "●", label: { cs: "Hotovo", en: "Result" }, detail: { cs: "Rezervace připravena", en: "Appointment prepared" } },
      ],
    },
  },
};
