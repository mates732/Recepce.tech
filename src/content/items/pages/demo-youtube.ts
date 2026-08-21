import type { PageContent } from "../../types";

export const DEMO_PAGE: PageContent<"demo"> = {
  kind: "page",
  id: "demo",
  slug: "demo",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  seo: {
    title: { cs: "Živá dema — Komunikační systémy v akci", en: "Live Demos — Communication Systems in Action" },
    description: {
      cs: "Vyzkoušejte si reálné konverzace s komunikačním systémem v různých odvětvích.",
      en: "Experience real conversations with a communication system across different industries.",
    },
  },
  data: {
    badge: { cs: "Živá Dema", en: "Live Demos" },
    title: { cs: "Vyberte si demo.", en: "Choose a demo." },
    subtitle: {
      cs: "Vyzkoušejte si reálné konverzace se systémem v různých odvětvích.",
      en: "Experience real conversations with the system in different industries.",
    },
    demos: [
      {
        id: "kadernictvi",
        name: "Hair Salon",
        nameCs: "Kadeřnictví",
        channels: ["Phone"],
        capabilities: ["Přijímá hovory", "Rezervuje termíny", "Odpovídá na dotazy", "Přepojí zaměstnance"],
        description: "Incoming phone call handled by the reception system.",
        descriptionCs: "Příchozí telefonní hovor zpracovaný recepčním systémem.",
      },
      {
        id: "stomatologie",
        name: "Dental Clinic",
        nameCs: "Zubní klinika",
        channels: ["Phone", "Chat"],
        capabilities: ["Přijímá hovory", "Rezervuje termíny", "Kontroluje pojištění", "Přijímá pacienty"],
        description: "Patient calls to schedule a dental checkup.",
        descriptionCs: "Pacient volá za účelem rezervace prohlídky.",
      },
      {
        id: "restaurant",
        name: "Restaurant",
        nameCs: "Restaurace",
        channels: ["Phone"],
        capabilities: ["Přijímá hovory", "Rezervuje stoly", "Dietní omezení", "Skupinové rezervace"],
        description: "Customer calls to book a table for dinner.",
        descriptionCs: "Zákazník volá za účelem rezervace stolu.",
      },
      {
        id: "masaze",
        name: "Massage Studio",
        nameCs: "Masážní studio",
        channels: ["Phone"],
        capabilities: ["Přijímá hovory", "Rezervuje termíny", "Info o balíčcích", "Dárkové poukazy"],
        description: "Client calls to schedule a massage appointment.",
        descriptionCs: "Klient volá za účelem rezervace masáže.",
      },
      {
        id: "fitness",
        name: "Fitness Center",
        nameCs: "Fitness centrum",
        channels: ["Chat"],
        capabilities: ["Info o členství", "Rozvrh lekcí", "Odpovídá na dotazy", "Získává leady"],
        description: "Website visitor asks about membership options.",
        descriptionCs: "Návštěvník webu se ptá na možnosti členství.",
      },
      {
        id: "barbershop",
        name: "Barbershop",
        nameCs: "Barbershop",
        channels: ["Phone"],
        capabilities: ["Přijímá hovory", "Rezervuje termíny", "Nabídka služeb", "Walk-in check"],
        description: "Customer calls to book a haircut appointment.",
        descriptionCs: "Zákazník volá za účelem rezervace střihu.",
      },
    ],
  },
};

export const YOUTUBE_PAGE: PageContent<"youtube"> = {
  kind: "page",
  id: "youtube",
  slug: "youtube",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  seo: {
    title: { cs: "YouTube", en: "YouTube" },
    description: {
      cs: "Každý produkt, experiment i launch dokumentuji veřejně. Bez přikrášlování. Jen skutečný vývoj.",
      en: "Every product, experiment and launch is documented in public. No embellishment. Just real development.",
    },
  },
  data: {
    title: { cs: "YouTube", en: "YouTube" },
    subtitle: {
      cs: "Každý produkt, experiment i launch dokumentuji veřejně. Bez přikrášlování. Jen skutečný vývoj.",
      en: "Every product, experiment and launch is documented in public. No embellishment. Just real development.",
    },
    latestLabel: { cs: "Nejnovější videa", en: "Latest Videos" },
    footerText: { cs: "Nová videa přibývají pravidelně.", en: "New videos are added regularly." },
    cta: { cs: "Otevřít YouTube", en: "Open YouTube" },
  },
};
