import type { PageContent } from "../../types";

export const PONICI_PAGE: PageContent<"ponici"> = {
  kind: "page",
  id: "ponici",
  slug: "ponici",
  status: "published",
  createdAt: "2026-08-19",
  updatedAt: "2026-08-19",
  publishedAt: "2026-08-19",
  seo: {
    title: { cs: "Ponici.cz — Digitální transformace jezdecké školy", en: "Ponici.cz — Digital Transformation of a Riding School" },
    description: {
      cs: "Nová digitální identita a webový zážitek pro jezdeckou školu na Císařském ostrově. Strategie, design, UX, vývoj a výsledek.",
      en: "A new digital identity and web experience for a riding school on Císařský ostrov. Strategy, design, UX, development and result.",
    },
  },
  data: {
    badge: { cs: "Klientský projekt", en: "Client Project" },
    heroTitle: [
      { cs: "Ponici.cz", en: "Ponici.cz" },
      { cs: "Digitální prostor pro vztah mezi člověkem a koněm.", en: "A digital space for the bond between people and horses." },
    ],
    heroDesc: {
      cs: "Nový digitální zážitek pro jezdeckou školu na Císařském ostrově v Praze.",
      en: "A new digital experience for a riding school on Císařský ostrov in Prague.",
    },
    cta: { cs: "Navštívit web", en: "Visit the website" },
    ctaHref: "https://ponici.cz",
    facts: [
      {
        label: { cs: "Role", en: "Role" },
        value: { cs: "Web Design / UX / Development", en: "Web Design / UX / Development" },
      },
      {
        label: { cs: "Kontext", en: "Context" },
        value: { cs: "20+ let zkušeností", en: "20+ years of experience" },
      },
      {
        label: { cs: "Lokalita", en: "Location" },
        value: { cs: "Císařský ostrov, Praha", en: "Císařský ostrov, Prague" },
      },
      {
        label: { cs: "Live", en: "Live" },
        value: { cs: "https://ponici.cz", en: "https://ponici.cz" },
        href: "https://ponici.cz",
        external: true,
      },
    ],
    previewUrl: "https://www.ponici.cz",
    previewLabel: "ponici.cz",
    sections: {
      challenge: {
        label: { cs: "01 · Výzva", en: "01 · The Challenge" },
        title: { cs: "Zachytit školu, ne pouze služby.", en: "Capture the school, not just the services." },
        text: {
          cs: "PONICI.CZ nepotřebovalo pouze prezentovat nabídku lekcí. Cílem bylo digitálně zachytit atmosféru jezdecké školy, její zkušenosti, bezpečné prostředí a vztah ke koním.",
          en: "PONICI.CZ didn't just need to present its range of lessons. The goal was to digitally capture the atmosphere of the riding school — its experience, its safe environment and its bond with horses.",
        },
        points: {
          cs: [
            "Více než 20 let zkušeností s koňmi i lidmi",
            "Práce s dětmi i dospělými",
            "Bezpečný a respektující přístup",
            "Rozvoj jezdců od začátečníků po pokročilé",
          ],
          en: [
            "More than 20 years of experience with horses and people",
            "Working with children and adults",
            "A safe and respectful approach",
            "Developing riders from beginners to advanced",
          ],
        },
      },
      strategy: {
        label: { cs: "02 · Strategie", en: "02 · Strategy" },
        title: { cs: "Od informačního webu k digitálnímu zážitku", en: "From an informational website to a digital experience" },
        text: {
          cs: "Web neměl být pouze katalog služeb. Měl uživateli odpovědět na pět otázek — a tím ho dovést od prvního dojmu až ke kontaktu.",
          en: "The website was never meant to be a services catalogue. It had to answer five questions — and guide the user from first impression all the way to contact.",
        },
        questions: {
          cs: [
            "Kdo jste?",
            "Pro koho je škola určena?",
            "Jak výuka probíhá?",
            "Proč vám věřit?",
            "Jak začít?",
          ],
          en: [
            "Who are you?",
            "Who is the school for?",
            "How does teaching work?",
            "Why should I trust you?",
            "How do I start?",
          ],
        },
        pillars: [
          {
            title: { cs: "Informační architektura", en: "Information architecture" },
            desc: {
              cs: "Přehledná struktura, ve které rodič najde vše potřebné do pár kliknutí.",
              en: "A clear structure where parents find everything they need in a few clicks.",
            },
          },
          {
            title: { cs: "Cesta návštěvníka", en: "Visitor journey" },
            desc: {
              cs: "Každá sekce odpovídá na otázku, kterou si návštěvník skutečně klade.",
              en: "Every section answers the question the visitor is actually asking.",
            },
          },
          {
            title: { cs: "Prezentace služeb", en: "Service presentation" },
            desc: {
              cs: "Nabídka přehledná, lákavá a propojená s příběhem školy.",
              en: "An offering that is clear, inviting and connected to the school's story.",
            },
          },
          {
            title: { cs: "Důraz na emoci", en: "Emotion first" },
            desc: {
              cs: "Atmosféra stáje a vztah ke koním přenesené do digitálního prostředí.",
              en: "The stable's atmosphere and the bond with horses translated into the digital.",
            },
          },
        ],
        services: {
          cs: [
            "Individuální lekce",
            "Jezdecký výcvik dětí",
            "Jezdecký výcvik dospělých",
            "Skokový výcvik",
            "Příprava na ZZVJ",
            "Vyjížďky",
            "Jezdecké tábory",
            "Narozeninové oslavy",
          ],
          en: [
            "Individual lessons",
            "Riding training for children",
            "Riding training for adults",
            "Jumping training",
            "ZZVJ preparation",
            "Trail rides",
            "Riding camps",
            "Birthday parties",
          ],
        },
      },
      design: {
        label: { cs: "03 · Design system", en: "03 · Design System" },
        title: { cs: "Krémová, lesní, hnědá.", en: "Cream, forest, brown." },
        text: {
          cs: "Paleta vychází z přírody Císařského ostrova. Typografie je elegantní a čitelná, kompozice pracuje s prostorem a světlem.",
          en: "The palette is rooted in the nature of Císařský ostrov. The typography is elegant and readable, the composition works with space and light.",
        },
        principle: {
          cs: "Méně katalog služeb. Více příběh.",
          en: "Less services catalogue. More story.",
        },
        colors: [
          { name: { cs: "Krémová", en: "Cream" }, value: "#F3EDE0" },
          { name: { cs: "Lesní zelená", en: "Forest green" }, value: "#213A2B" },
          { name: { cs: "Hnědá", en: "Brown" }, value: "#7A5230" },
          { name: { cs: "Písečná", en: "Sand" }, value: "#E2D3B8" },
        ],
        typefaces: [
          { name: { cs: "Serifová display", en: "Serif display" }, note: { cs: "elegantní, přírodní, prémiová", en: "elegant, natural, premium" } },
          { name: { cs: "Sans-serif", en: "Sans-serif" }, note: { cs: "čistá, moderní, čitelná", en: "clean, modern, readable" } },
        ],
      },
      ux: {
        label: { cs: "04 · UX Design", en: "04 · UX Design" },
        title: { cs: "Jedna otázka, pět odpovědí.", en: "One question, five answers." },
        question: {
          cs: "„Je toto správné místo pro moje dítě?“",
          en: "\"Is this the right place for my child?\"",
        },
        answers: [
          {
            title: { cs: "Kdo jste", en: "Who you are" },
            desc: { cs: "Představení školy, lektorů a přístupu k dětem i koním.", en: "Introducing the school, the instructors and the approach to children and horses." },
          },
          {
            title: { cs: "Kde působíte", en: "Where you are" },
            desc: { cs: "Císařský ostrov uprostřed Prahy — místo, kam se snadno dostanete.", en: "Císařský ostrov in the middle of Prague — an easy place to reach." },
          },
          {
            title: { cs: "Jak fungují lekce", en: "How lessons work" },
            desc: { cs: "Průběh výuky, skupiny i individuální vedení krok za krokem.", en: "How teaching works, groups and individual guidance, step by step." },
          },
          {
            title: { cs: "Proč vám věřit", en: "Why trust you" },
            desc: { cs: "Dvacet let zkušeností, bezpečné prostředí a příběhy skutečných rodin.", en: "Twenty years of experience, a safe environment and stories of real families." },
          },
          {
            title: { cs: "Jak začít", en: "How to start" },
            desc: { cs: "Přehledná cesta od prvního zájmu po první jízdu.", en: "A clear path from first interest to the first ride." },
          },
        ],
        personas: [
          {
            title: { cs: "Rodiče dětí", en: "Parents of children" },
            desc: {
              cs: "Hledají jistotu, že je o jejich dítě dobře postaráno.",
              en: "They look for the certainty that their child is well taken care of.",
            },
            needs: {
              cs: ["Bezpečí", "Důvěra", "Zkušenosti"],
              en: ["Safety", "Trust", "Experience"],
            },
          },
          {
            title: { cs: "Dospělí začátečníci", en: "Adult beginners" },
            desc: {
              cs: "Chtějí začít, ale potřebují vědět, že to zvládnou.",
              en: "They want to start, but need to know they can do it.",
            },
            needs: {
              cs: ["Mohou začít kdykoliv", "Jasný proces výuky"],
              en: ["Can start anytime", "A clear teaching process"],
            },
          },
          {
            title: { cs: "Pokročilí jezdci", en: "Advanced riders" },
            desc: {
              cs: "Chtějí se posouvat a rozvíjet s koňmi dál.",
              en: "They want to progress and keep developing with the horses.",
            },
            needs: {
              cs: ["Výcvik", "Skoková příprava", "Další rozvoj"],
              en: ["Training", "Jumping preparation", "Further development"],
            },
          },
        ],
        flow: {
          cs: ["Návštěvník", "Důvěra", "Pochopení", "Rozhodnutí", "Kontakt"],
          en: ["Visitor", "Trust", "Understanding", "Decision", "Contact"],
        },
      },
      tech: {
        label: { cs: "06 · Technologie", en: "06 · Technology" },
        title: { cs: "Postaveno moderně.", en: "Built the modern way." },
        text: {
          cs: "Moderní frontendová architektura, optimalizovaný výkon, plně responzivní design a SEO — technologie pracuje tiše v pozadí, aby web byl rychlý a spolehlivý.",
          en: "Modern frontend architecture, optimized performance, fully responsive design and SEO — technology works quietly in the background so the website is fast and reliable.",
        },
        items: {
          cs: ["Next.js", "Moderní frontend", "Responzivní design", "SEO optimalizace", "Rychlost", "Animace"],
          en: ["Next.js", "Modern frontend", "Responsive design", "SEO optimization", "Speed", "Animation"],
        },
      },
      web: {
        label: { cs: "PONICI.CZ v praxi", en: "PONICI.CZ in practice" },
        title: { cs: "Cesta uživatele, kterou jsme navrhli.", en: "The user journey we designed." },
        text: {
          cs: "Od úvodní obrazovky po přihlášku a telefon — celý web plynule v jednom přirozeném scrollu.",
          en: "From the first screen to the enrolment form and a phone call — the whole website flows in one natural scroll.",
        },
        liveLabel: { cs: "Otevřít živý web", en: "Open the live website" },
      },
      result: {
        label: { cs: "07 · Výsledek", en: "07 · The Result" },
        title: [
          { cs: "Digitální prostor,", en: "A digital space" },
          { cs: "který odpovídá skutečnému místu.", en: "that matches the real place." },
        ],
        text: {
          cs: "Nový web propojuje dlouholetou tradici jezdecké školy s moderním digitálním zážitkem. Pomáhá návštěvníkům pochopit hodnotu školy ještě před prvním kontaktem.",
          en: "The new website connects the school's long tradition with a modern digital experience. It helps visitors understand the value of the school before their very first contact.",
        },
        conclusion: {
          cs: "Digitální transformace jezdecké školy, která propojuje dlouholeté zkušenosti, vztah ke koním a moderní online prezentaci.",
          en: "A digital transformation of a riding school that connects years of experience, a bond with horses and a modern online presence.",
        },
        cta: { cs: "Začít vlastní projekt", en: "Start your own project" },
      },
    },
  },
};
