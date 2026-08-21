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
    title: { cs: "Inteligentní telefonní komunikace", en: "Intelligent Phone Communication" },
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
    badge: { cs: "Telefonní komunikace", en: "Phone Communication" },
    crossLink: {
      label: { cs: "Otevřít propojenou komunikaci", en: "Open Connected Communication" },
      href: "/projekty/asistenti/chat-asistent",
    },
    heroTitle: [
      { cs: "Inteligentní", en: "Intelligent" },
      { cs: "telefonní", en: "phone" },
      { cs: "komunikace.", en: "communication." },
    ],
    heroDesc: {
      cs: "Moderní telefonní systém pro firmy. Vyřizování hovorů, rezervace schůzek, předávání informací a správa zákaznických požadavků kdykoliv.",
      en: "A modern phone system for businesses. Handling calls, booking meetings, sharing information and managing customer requests anytime.",
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
