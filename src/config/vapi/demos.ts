import type { VapiDemoConfig } from "./types";
import { getAssistantConfig } from "./env";

export const DEMOS: VapiDemoConfig[] = [
  {
    id: "barber",
    displayName: "Barbershop",
    industry: "barber",
    assistantId: getAssistantConfig("barber").assistantId,
    locale: "cs",
    defaultVoice: "czech",
    firstMessage:
      "Dobrý den, děkujeme za zavolání do pánského kadeřnictví. Jak vám můžeme pomoci?",
    enabled: true,
    slugs: ["barbershop"],
  },
  {
    id: "dentist",
    displayName: "Dental Clinic",
    industry: "dentist",
    assistantId: getAssistantConfig("dentist").assistantId,
    locale: "cs",
    defaultVoice: "czech",
    firstMessage:
      "Dobrý den, děkujeme za zavolání do zubní ordinace. Jak vám můžeme pomoci?",
    enabled: true,
    slugs: ["stomatologie"],
  },
  {
    id: "veterinary",
    displayName: "Veterinary Clinic",
    industry: "veterinary",
    assistantId: getAssistantConfig("veterinary").assistantId,
    locale: "cs",
    defaultVoice: "czech",
    firstMessage:
      "Dobrý den, děkujeme za zavolání do veterinární kliniky. S čím vám můžeme pomoci?",
    enabled: true,
  },
  {
    id: "restaurant",
    displayName: "Restaurant",
    industry: "restaurant",
    assistantId: getAssistantConfig("restaurant").assistantId,
    locale: "cs",
    defaultVoice: "czech",
    firstMessage:
      "Dobrý den, děkujeme za zavolání do restaurace. Chcete rezervovat stůl?",
    enabled: true,
  },
  {
    id: "hair-salon",
    displayName: "Hair Salon",
    industry: "hair-salon",
    assistantId: getAssistantConfig("hair-salon").assistantId,
    locale: "cs",
    defaultVoice: "czech",
    firstMessage:
      "Dobrý den, děkujeme za zavolání do kadeřnictví. Jak vám můžeme pomoci?",
    enabled: true,
    slugs: ["kadernictvi"],
  },
  {
    id: "massage",
    displayName: "Massage & Wellness",
    industry: "massage",
    assistantId: getAssistantConfig("massage").assistantId,
    locale: "cs",
    defaultVoice: "czech",
    firstMessage:
      "Dobrý den, děkujeme za zavolání do masážního studia. Jakou proceduru byste si přáli?",
    enabled: true,
    slugs: ["masaze"],
  },
  {
    id: "fitness",
    displayName: "Fitness & PT",
    industry: "fitness",
    assistantId: getAssistantConfig("fitness").assistantId,
    locale: "cs",
    defaultVoice: "czech",
    firstMessage:
      "Dobrý den, děkujeme za zavolání do fitness centra. Chcete si rezervovat trénink?",
    enabled: true,
    slugs: ["fitness"],
  },
];
