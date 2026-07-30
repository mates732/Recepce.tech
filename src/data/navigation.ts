import type { Locale } from "@/lib/types";

export interface NavItem {
  key: string;
  label: Record<Locale, string>;
  href: Record<Locale, string>;
}

export const navItems: NavItem[] = [
  {
    key: "aiReceptionist",
    label: { cs: "Chat Asistent", en: "Chat Assistant" },
    href: { cs: "/cs/ai-receptionist", en: "/en/ai-receptionist" },
  },
  {
    key: "profese",
    label: { cs: "Profese", en: "Professions" },
    href: { cs: "/cs/profese", en: "/en/profese" },
  },
  {
    key: "contact",
    label: { cs: "Kontakt", en: "Contact" },
    href: { cs: "/cs/contact", en: "/en/contact" },
  },
];
