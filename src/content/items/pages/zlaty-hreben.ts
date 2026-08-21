import type { PageContent } from "../../types";

export const ZLATY_HREBEN_PAGE: PageContent<"zlaty-hreben"> = {
  kind: "page",
  id: "zlaty-hreben",
  slug: "zlaty-hreben",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-11",
  publishedAt: "2026-08-11",
  seo: {
    title: { cs: "Zlatý Hřeben — Projekt webu", en: "Zlatý Hřeben — Website Project" },
    description: {
      cs: "Case study webového projektu, který nedosáhl produkce. Design, proces a vizuální směr.",
      en: "A case study of a web project that never reached production. Design, process and visual direction.",
    },
  },
  data: {
    badge: { cs: "Klientský projekt", en: "Client Project" },
    heroTitle: "Zlatý Hřeben",
    heroDesc: {
      cs: "Moderní webová prezentace pro prémiové pánské holičství — od vizuální identity po responzivní UI.",
      en: "A modern website for a premium barbershop — from visual identity to responsive UI.",
    },
    facts: [
      {
        label: { cs: "Role", en: "Role" },
        value: { cs: "Klientský projekt · design & vývoj", en: "Client project · design & development" },
      },
      {
        label: { cs: "Technologie", en: "Technology" },
        value: { cs: "Next.js · Vercel", en: "Next.js · Vercel" },
      },
      {
        label: { cs: "Výsledek", en: "Result" },
        value: { cs: "Case study — projekt pozastaven", en: "Case study — project paused" },
      },
      {
        label: { cs: "Živé", en: "Live" },
        value: { cs: "zlaty-hreben.vercel.app", en: "zlaty-hreben.vercel.app" },
        href: "https://zlaty-hreben.vercel.app/",
        external: true,
      },
    ],
    previewUrl: "https://zlaty-hreben.vercel.app/",
    previewLabel: "zlaty-hreben.vercel.app",
    timeline: {
      label: { cs: "Časová osa", en: "Project Timeline" },
      steps: [
        {
          title: { cs: "Kontakt", en: "Client Contacted Me" },
          desc: {
            cs: "Cílem bylo vytvořit moderní prémiovou webovou prezentaci pro pánské holičství se zaměřením na čistou typografii, online rezervace a silnou vizuální identitu.",
            en: "The goal was to create a premium barbershop website focused on clean typography, online booking and a strong visual identity.",
          },
        },
        {
          title: { cs: "Výzkum a plánování", en: "Research & Planning" },
          desc: {
            cs: "Analýza konkurence, informační architektura, uživatelské scénáře a návrh kompletní vizuální identity.",
            en: "Competitor analysis, information architecture, user scenarios and complete visual identity design.",
          },
        },
        {
          title: { cs: "Design a vývoj", en: "Design & Development" },
          desc: {
            cs: "Návrh responzivního rozhraní, implementace prémiového UI, optimalizace výkonu a vytvoření plně funkčního prototypu.",
            en: "Responsive interface design, premium UI implementation, performance optimization and a fully functional prototype.",
          },
        },
        {
          title: { cs: "Projekt pozastaven", en: "Project Paused" },
          desc: {
            cs: "Projekt dosáhl pokročilé fáze návrhu i vývoje. Komunikace s klientem se však před dokončením zastavila, proto nebyl web nikdy nasazen. Design následně posloužil jako ukázková případová studie.",
            en: "The project reached an advanced design and development phase, but client communication stopped before completion. The website was never deployed. The design later served as a showcase case study.",
          },
        },
      ],
    },
    completed: {
      label: { cs: "Dokončeno", en: "What Was Completed" },
      items: {
        cs: ["Informační architektura", "Responzivní UI design", "Frontend implementace", "Prémiová vizuální identita", "Mobilní optimalizace", "Optimalizace výkonu"],
        en: ["Information architecture", "Responsive UI design", "Frontend implementation", "Premium visual identity", "Mobile optimization", "Performance optimization"],
      },
    },
    reflection: {
      label: { cs: "Reflexe", en: "Reflection" },
      text: {
        cs: "Projekt nedosáhl produkce. Pro demonstraci navrženého vizuálního směru a uživatelského zážitku je níže dostupná funkční ukázka postavená na stejném designovém systému.",
        en: "The project never reached production. To demonstrate the intended visual direction and user experience, the working preview below is built on the same design system.",
      },
    },
    final: {
      title: [
        { cs: "Máte zájem o", en: "Interested in building" },
        { cs: "podobný web?", en: "something similar?" },
      ],
      subtitle: {
        cs: "Pojďme vytvořit něco, co skutečně vznikne.",
        en: "Let's create something that reaches production.",
      },
      cta: { cs: "Ozvat se", en: "Get in touch" },
    },
  },
};
