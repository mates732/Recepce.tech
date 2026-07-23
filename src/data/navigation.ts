import type { Locale } from "@/lib/types";

export interface NavItem {
  key: string;
  label: Record<Locale, string>;
  href: Record<Locale, string>;
}

export const navItems: NavItem[] = [
  {
    key: "home",
    label: { cs: "Domů", en: "Home" },
    href: { cs: "/cs", en: "/en" },
  },
  {
    key: "projects",
    label: { cs: "Projekty", en: "Projects" },
    href: { cs: "/cs#work", en: "/en#work" },
  },
  {
    key: "aiReceptionist",
    label: { cs: "AI Recepční", en: "AI Receptionist" },
    href: { cs: "/cs/ai-receptionist", en: "/en/ai-receptionist" },
  },
  {
    key: "about",
    label: { cs: "O mně", en: "About" },
    href: { cs: "/cs#about", en: "/en#about" },
  },
  {
    key: "contact",
    label: { cs: "Kontakt", en: "Contact" },
    href: { cs: "/cs/contact", en: "/en/contact" },
  },
];
