import type { Locale } from "@/lib/types";

export interface ProjectTimelineEntry {
  date: string;
  label: Record<Locale, string>;
}

export interface ProjectSections {
  overview: Record<Locale, string>;
  problem: Record<Locale, string>;
  solution: Record<Locale, string>;
  architecture: Record<Locale, string>;
  features: Record<Locale, string[]>;
  currentStatus: Record<Locale, string>;
  timeline: ProjectTimelineEntry[];
  futurePlans: Record<Locale, string>;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  type: Record<Locale, string>;
  status: Record<Locale, string>;
  statusVariant: "active" | "concept" | "client";
  year: string;
  description: Record<Locale, string>;
  tagline: Record<Locale, string>;
  href?: string;
  featured?: boolean;
  started: string;
  lastUpdate: string;
  category: Record<Locale, string>;
  projectType: Record<Locale, string>;
  relatedSlugs: string[];
  sections: ProjectSections;
  technologies: string[];
  demoLinks?: { slug: string; label: Record<Locale, string> }[];
  stats?: { value: string; label: Record<Locale, string> }[];
  industries?: { name: Record<Locale, string>; desc: Record<Locale, string> }[];
}

export const projects: Project[] = [
  {
    id: "cortex",
    name: "Cortex",
    slug: "cortex",
    type: { cs: "Systém", en: "System" },
    status: { cs: "Aktivní", en: "Active" },
    statusVariant: "active",
    year: "2026",
    description: {
      cs: "Automatizuje celý cyklus od vyhledání klienta po personalizovaný kontakt.",
      en: "Automates the entire cycle from lead discovery to personalized outreach.",
    },
    tagline: {
      cs: "Interní prodejní engine, který najde, vyhodnotí a osloví klienta — automaticky.",
      en: "An internal sales engine that finds, evaluates, and reaches out to clients — automatically.",
    },
    featured: true,
    started: "2026 Q1",
    lastUpdate: "2026 Q2",
    category: { cs: "Automatizace", en: "Automation" },
    projectType: { cs: "Interní systém", en: "Internal system" },
    relatedSlugs: ["recepce-tech"],
    sections: {
      overview: {
        cs: "Cortex je interní systém, který automatizuje celý cyklus obchodního procesu — od vyhledání potenciálního klienta po personalizovaný kontakt. Stavím ho primárně pro sebe, abych eliminoval opakující se manuální práci.",
        en: "Cortex is an internal system that automates the entire business cycle — from lead discovery to personalized outreach. I'm building it primarily for myself to eliminate repetitive manual work.",
      },
      problem: {
        cs: "Manuální vyhledávání a oslovování potenciálních klientů je časově náročné a opakující se. Každý krok vyžaduje ruční práci — od sběru dat přes analýzu až po psaní zpráv.",
        en: "Manually discovering and reaching out to potential clients is time-consuming and repetitive. Every step requires hand work — from data collection through analysis to writing messages.",
      },
      solution: {
        cs: "Automatizovaný pipeline, který zpracuje celý cyklus — od identifikace cílového segmentu přes sběr dat, scoring a personalizaci až po distribuci. Každý krok je nezávislý modul.",
        en: "An automated pipeline that handles the full cycle — from target segment identification through data collection, scoring, and personalization to distribution. Each step is an independent module.",
      },
      architecture: {
        cs: "Modulární systém postavený na existující infrastruktuře. Každý krok pipeline je nezávislý modul — sběr dat, analýza, scoring, personalizace, distribuce. Díky tomu se dá libovolně rozšiřovat a měnit.",
        en: "A modular system built on existing infrastructure. Each pipeline step is an independent module — data collection, analysis, scoring, personalization, distribution. This makes it easily extendable and modifiable.",
      },
      features: {
        cs: [
          "Inteligentní scoring klientů",
          "Personalizace na základě kontextu",
          "Automatizované rozhodování",
          "Logging a přehled celého procesu",
          "Modulární architektura pro snadné rozšiřování",
        ],
        en: [
          "Intelligent client scoring",
          "Context-based personalization",
          "Automated decision-making",
          "Process logging and overview",
          "Modular architecture for easy extension",
        ],
      },
      currentStatus: {
        cs: "Právě ve vývoji. Pipeline běží end-to-end — od sběru dat přes analýzu až po generování personalizovaných zpráv.",
        en: "Currently in active development. The pipeline runs end-to-end — from data collection through analysis to personalized message generation.",
      },
      timeline: [
        { date: "2026 Q1", label: { cs: "Koncept a první prototypy", en: "Concept and first prototypes" } },
        { date: "2026 Q2", label: { cs: "Pipeline běží end-to-end", en: "Pipeline running end-to-end" } },
        { date: "2026 Q3", label: { cs: "Optimalizace a produkční nasazení", en: "Optimization and production deployment" } },
      ],
      futurePlans: {
        cs: "Rozšíření o další kanály distribuce. Pokročilejší analytiku a reporting. Integrace s externími nástroji. Postupné zavádění pro reálné použití.",
        en: "Extension to additional distribution channels. Advanced analytics and reporting. Integration with external tools. Gradual introduction for real-world use.",
      },
    },
    technologies: ["Python", "LLM API", "Web Scraping", "Automated Pipelines", "Data Scoring"],
  },
  {
    id: "recepce",
    name: "Recepce.tech",
    slug: "recepce-tech",
    type: { cs: "Voice AI", en: "Voice AI" },
    status: { cs: "Aktivní", en: "Active" },
    statusVariant: "active",
    year: "2025",
    description: {
      cs: "AI recepční, která zvedá telefon a mluví s klienty za vás.",
      en: "An AI receptionist that answers calls and speaks with your clients.",
    },
    tagline: {
      cs: "Hlasová AI, která zvedne každý hovor a promluví s vaším klientem.",
      en: "Voice AI that picks up every call and speaks with your client.",
    },
    href: "/profese",
    started: "2025 Q1",
    lastUpdate: "2025 Q4",
    category: { cs: "Voice AI", en: "Voice AI" },
    projectType: { cs: "Produkt", en: "Product" },
    relatedSlugs: ["cortex", "zlaty-hreben"],
    sections: {
      overview: {
        cs: "AI recepční, která zvedá telefon a mluví s klienty za vás. Není to chatbot — je to hlasový asistent, který rozumí kontextu vašeho podnikání, odpovídá na otázky a řeší běžné úkoly jako rezervace nebo přepojování.",
        en: "An AI receptionist that answers the phone and speaks with your clients. It's not a chatbot — it's a voice assistant that understands your business context, answers questions, and handles routine tasks like reservations or call transfers.",
      },
      problem: {
        cs: "Každý zmeškaný telefonát je ztracený zákazník. Malé firmy nemají prostor na non-stop recepci, ale zákazníci očekávají okamžitou odezvu — ať už volají v poledne nebo o půlnoci.",
        en: "Every missed call is a lost customer. Small businesses can't afford a full-time receptionist, but customers expect immediate response — whether they call at noon or midnight.",
      },
      solution: {
        cs: "Hlasový engine napojený na kontext firmy. AI rozumí přirozené řeči, pracuje s kontextem a dokáže provádět akce — rezervovat termíny, přepojovat hovory, posílat potvrzení.",
        en: "A voice engine connected to business context. The AI understands natural speech, works with context, and can perform actions — book appointments, transfer calls, send confirmations.",
      },
      architecture: {
        cs: "Hlasový engine napojený na kontext firmy. Správa stavů hovoru. Integrace s kalendáři a interními systémy. Logging a analytika každého hovoru. Modulární design pro snadné přizpůsobení různým oborům.",
        en: "Voice engine connected to business context. Call state management. Integration with calendars and internal systems. Logging and analytics for every call. Modular design for easy adaptation to different industries.",
      },
      features: {
        cs: [
          "24/7 telefonická dostupnost",
          "Přirozená konverzace v češtině i angličtině",
          "Automatická správa rezervací",
          "Inteligentní přepojování na zaměstnance",
          "Personalizované odpovědi na základě kontextu firmy",
          "Kompletní přehled hovorů a analýza",
        ],
        en: [
          "24/7 phone availability",
          "Natural conversation in Czech and English",
          "Automatic booking management",
          "Intelligent call transfer to staff",
          "Personalized responses based on business context",
          "Complete call overview and analytics",
        ],
      },
      currentStatus: {
        cs: "Aktivní produkt s živými demo pro 6 profesí. Hlasový engine běží v produkci.",
        en: "Active product with live demos for 6 professions. Voice engine running in production.",
      },
      timeline: [
        { date: "2025 Q1", label: { cs: "Začátek vývoje hlasového engine", en: "Voice engine development started" } },
        { date: "2025 Q2", label: { cs: "První prototyp s podporou češtiny", en: "First prototype with Czech support" } },
        { date: "2025 Q3", label: { cs: "Správa rezervací a přepojování", en: "Booking management and call transfers" } },
        { date: "2025 Q4", label: { cs: "Profesní demo a produkční nasazení", en: "Profession demos and production deployment" } },
      ],
      futurePlans: {
        cs: "Rozšíření o další odvětví. Více jazyků. Pokročilejší analytika hovorů. Integrace s dalšími systémy.",
        en: "Expansion to more industries. More languages. Advanced call analytics. Integration with additional systems.",
      },
    },
    technologies: ["Vapi", "WebRTC", "Next.js", "React", "AI Voice Engine"],
    stats: [
      { value: "24/7", label: { cs: "Dostupnost", en: "Availability" } },
      { value: "<2s", label: { cs: "Odezva", en: "Response time" } },
      { value: "100%", label: { cs: "Zvednutých hovorů", en: "Calls answered" } },
    ],
    industries: [
      { name: { cs: "Hotely a penziony", en: "Hotels and pensions" }, desc: { cs: "Recepce, rezervace, informace pro hosty", en: "Reception, reservations, guest information" } },
      { name: { cs: "Kadeřnictví a salony", en: "Barbershops and salons" }, desc: { cs: "Objednávky, termíny, ceníky", en: "Appointments, schedules, pricing" } },
      { name: { cs: "Restaurace", en: "Restaurants" }, desc: { cs: "Rezervace, denní nabídka, speciální akce", en: "Reservations, daily menu, special events" } },
      { name: { cs: "Právní kanceláře", en: "Law firms" }, desc: { cs: "Úvodní konzultace, domluvení termínů", en: "Initial consultations, appointment scheduling" } },
      { name: { cs: "Lékařské ordinace", en: "Medical practices" }, desc: { cs: "Rezervace, objednávání, základní informace", en: "Booking, scheduling, basic information" } },
      { name: { cs: "E-shopy", en: "E-shops" }, desc: { cs: "Zákaznická podpora, stav objednávek", en: "Customer support, order status" } },
    ],
    demoLinks: [
      { slug: "hotel", label: { cs: "Hotel", en: "Hotel" } },
      { slug: "kadeřnictví", label: { cs: "Kadeřnictví", en: "Barbershop" } },
      { slug: "restaurace", label: { cs: "Restaurace", en: "Restaurant" } },
      { slug: "právník", label: { cs: "Právník", en: "Lawyer" } },
      { slug: "ordinace", label: { cs: "Ordinace", en: "Practice" } },
      { slug: "e-shop", label: { cs: "E-shop", en: "E-shop" } },
    ],
  },
  {
    id: "zlaty-hreben",
    name: "Zlatý Hřeben",
    slug: "zlaty-hreben",
    type: { cs: "Web", en: "Website" },
    status: { cs: "Koncept", en: "Concept" },
    statusVariant: "concept",
    year: "2025",
    description: {
      cs: "Web pro kadeřnictví — jednoduchý, funkční, bez zbytečností.",
      en: "Website for a barbershop — simple, functional, no fluff.",
    },
    tagline: {
      cs: "Čistá online prezentace, která odpovídá úrovni salonu.",
      en: "A clean online presence that matches the salon's standard.",
    },
    started: "2025 Q1",
    lastUpdate: "2025 Q2",
    category: { cs: "Webový projekt", en: "Web project" },
    projectType: { cs: "Webová prezentace", en: "Web presentation" },
    relatedSlugs: ["ponici", "recepce-tech"],
    sections: {
      overview: {
        cs: "Web pro kadeřnictví — jednoduchý, funkční, bez zbytečností. Cíl byl vytvořit čistou prezentaci, která funguje na všech zařízeních a rychle se načítá.",
        en: "A website for a barbershop — simple, functional, no fluff. The goal was a clean presentation that works on all devices and loads fast.",
      },
      problem: {
        cs: "Potřeba čisté online prezentace, která bude fungovat na všech zařízeních a bude se rychle načítat. Žádné zbytečné animace ani přehnaný design.",
        en: "Need for a clean online presence that works on all devices and loads fast. No unnecessary animations or overblown design.",
      },
      solution: {
        cs: "Čistý layout, rychlé načítání, responzivita. Web, který prostě funguje. Žádné zbytečné animace ani přehnaný design.",
        en: "Clean layout, fast loading, responsiveness. A website that just works. No unnecessary animations or overblown design.",
      },
      architecture: {
        cs: "Statický web s responzivním designem. Optimální pro rychlost a jednoduchost. Žádné závislosti na frameworku.",
        en: "Static website with responsive design. Optimized for speed and simplicity. No framework dependencies.",
      },
      features: {
        cs: [
          "Čistý, minimalistický layout",
          "Responzivní design pro všechna zařízení",
          "Rychlé načítání",
          "Kontaktní informace a otevírací doby",
        ],
        en: [
          "Clean, minimalist layout",
          "Responsive design for all devices",
          "Fast loading",
          "Contact information and opening hours",
        ],
      },
      currentStatus: {
        cs: "Koncept — připraveno k nasazení.",
        en: "Concept — ready for deployment.",
      },
      timeline: [
        { date: "2025 Q1", label: { cs: "Návrh layoutu a struktury", en: "Layout and structure design" } },
        { date: "2025 Q2", label: { cs: "Vývoj a testování", en: "Development and testing" } },
      ],
      futurePlans: {
        cs: "Připraveno k nasazení. Čeká na rozhodnutí o nasazení.",
        en: "Ready for deployment. Awaiting deployment decision.",
      },
    },
    technologies: ["HTML", "CSS", "Responsive Design"],
  },
  {
    id: "ponici",
    name: "Poníci",
    slug: "ponici",
    type: { cs: "Web", en: "Website" },
    status: { cs: "Klient", en: "Client" },
    statusVariant: "client",
    year: "2024",
    description: {
      cs: "Prezentační web pro dětský ranč s online rezervací.",
      en: "Presentation website for a kids' ranch with online booking.",
    },
    tagline: {
      cs: "Web, na kterém si rodiče rezervují lekci během dvou minut.",
      en: "A website where parents book a lesson in two minutes.",
    },
    started: "2024 Q1",
    lastUpdate: "2024 Q2",
    category: { cs: "Klientský projekt", en: "Client project" },
    projectType: { cs: "Webová prezentace", en: "Web presentation" },
    relatedSlugs: ["zlaty-hreben"],
    sections: {
      overview: {
        cs: "Prezentační web pro dětský ranč s online rezervací. Web musel být hravý, přehledný a funkční pro rodiče, kteří chtějí rychle zarezervovat termín.",
        en: "A presentation website for a kids' ranch with online booking. The site had to be playful, clear, and functional for parents who want to quickly book a visit.",
      },
      problem: {
        cs: "Rodiče potřebovali jednoduchý způsob, jak si zarezervovat termín na ranči. Web musel být přehledný a fungovat na mobilních zařízeních.",
        en: "Parents needed a simple way to book a visit to the ranch. The site had to be clear and work on mobile devices.",
      },
      solution: {
        cs: "Hravý, přehledný web s online rezervací. Vše responzivní a optimalizované pro mobilní zařízení.",
        en: "A playful, clear website with online booking. All responsive and optimized for mobile devices.",
      },
      architecture: {
        cs: "Responzivní web s integrovaným systémem rezervací. Fotogalerie, kontaktní formulář, přehled nabídek.",
        en: "Responsive website with integrated booking system. Photo gallery, contact form, service overview.",
      },
      features: {
        cs: [
          "Prezentace nabídky",
          "Fotogalerie",
          "Online rezervace termínů",
          "Kontaktní formulář",
          "Responzivní design",
        ],
        en: [
          "Service presentation",
          "Photo gallery",
          "Online booking",
          "Contact form",
          "Responsive design",
        ],
      },
      currentStatus: {
        cs: "Klientský projekt — nasazeno.",
        en: "Client project — deployed.",
      },
      timeline: [
        { date: "2024 Q1", label: { cs: "Návrh a vývoj", en: "Design and development" } },
        { date: "2024 Q2", label: { cs: "Nasazení a spuštění", en: "Deployment and launch" } },
      ],
      futurePlans: {
        cs: "Web je aktivně používán. Údržba a případné úpravy dle potřeb klienta.",
        en: "Website actively used. Maintenance and adjustments as needed by the client.",
      },
    },
    technologies: ["React", "Responsive Design", "Online Booking"],
  },
];
