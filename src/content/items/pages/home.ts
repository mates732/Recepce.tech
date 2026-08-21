import type { PageContent } from "../../types";

export const HOME_PAGE: PageContent<"home"> = {
  kind: "page",
  id: "home",
  slug: "home",
  status: "published",
  createdAt: "2026-08-11",
  updatedAt: "2026-08-16",
  publishedAt: "2026-08-11",
  seo: {
    title: {
      cs: "Recepce.tech — Digitální systémové studio",
      en: "Recepce.tech — Digital Systems Studio",
    },
    description: {
      cs: "Navrhujeme a stavíme digitální systémy — weby, komunikaci se zákazníky, interní nástroje a automatizaci, které řeší reálné firemní problémy.",
      en: "We design and build digital systems — websites, customer communication, internal tools and automation that solve real business problems.",
    },
  },
  data: {
    sections: [
      { section: "hero", visible: true },
      { section: "laboratory", visible: true },
      { section: "liveSystems", visible: true },
      { section: "systemsAudit", visible: true },
      { section: "systems", visible: true },
      { section: "caseStudies", visible: true },
      { section: "trustProof", visible: true },
      { section: "audience", visible: true },
      { section: "whatWeBuild", visible: true },
      { section: "controlRoom", visible: true },
      { section: "experiments", visible: true },
      { section: "about", visible: true },
      { section: "youtube", visible: true },
      { section: "finalCta", visible: true },
    ],
    hero: {
      title: {
        cs: "Stavíme digitální systémy, které řeší firemní problémy.",
        en: "We build digital systems that solve business problems.",
      },
      emphasis: { cs: ["systémy"], en: ["systems"] },
      subtitle: {
        cs: "Weby · Komunikace · Automatizace",
        en: "Websites · Communication · Automation",
      },
      proof: {
        cs: "Produkční systémy, živá dema a reálné výsledky.",
        en: "Production systems, live demos and real results.",
      },
      ctaLabel: { cs: "Zjistit, kde může systém pomoci", en: "Find where a system can help" },
      ctaHref: "#systems-audit",
      scrollTarget: "systems-audit",
      altCtaLabel: { cs: "Prohlédnout systémy", en: "View the systems" },
      altCtaHref: "#live-systems",
      altScrollTarget: "live-systems",
    },
    laboratory: {
      title: { cs: "Laboratoř", en: "The Laboratory" },
      subtitle: {
        cs: "Výzkum, experimenty a prototypy. Systémy, které testujeme, rozbíjíme a stavíme znovu — dokud nefungují v produkci.",
        en: "Research, experiments and prototypes. Systems we test, break and rebuild — until they work in production.",
      },
      experiments: [
        {
          name: { cs: "Hlasová komunikace", en: "Voice Communication" },
          status: "Testing",
          problem: {
            cs: "Přirozené telefonní konverzace, ne robotické odpovědi.",
            en: "Natural phone conversations, not robotic replies.",
          },
          capabilities: {
            cs: ["Persona a tón hlasu", "Kontext v reálném čase", "Přerušování a dialogy"],
            en: ["Persona & tone", "Real-time context", "Interruptions & dialogue"],
          },
          href: "/systems/communication/voice",
        },
        {
          name: { cs: "Znalostní systémy", en: "Knowledge Systems" },
          status: "Experiment",
          problem: {
            cs: "Přesné odpovědi z firemních dat, ne halucinace.",
            en: "Accurate answers from business data, not hallucinations.",
          },
          capabilities: {
            cs: ["Vyhledávání v dokumentech", "Zdrojované odpovědi", "Aktualizace znalostí"],
            en: ["Document retrieval", "Cited answers", "Knowledge updates"],
          },
          href: "/systems/communication",
        },
        {
          name: { cs: "Automatizační workflow", en: "Automation Workflows" },
          status: "Prototype",
          problem: {
            cs: "Opakující se práce, kterou zvládne systém.",
            en: "Repetitive work a system can handle.",
          },
          capabilities: {
            cs: ["CRM aktualizace", "Obohacení leadů", "Reporting"],
            en: ["CRM updates", "Lead enrichment", "Reporting"],
          },
          href: "/cortex",
        },
        {
          name: { cs: "Webové systémy", en: "Website Systems" },
          status: "Experiment",
          problem: {
            cs: "Weby, které prodávají — ne šablony, které nikdo nečte.",
            en: "Websites that sell — not templates nobody reads.",
          },
          capabilities: {
            cs: ["Design pro produktový launch", "Copy asistovaná technologií", "Výkon na prvním místě"],
            en: ["Product-launch design", "Tech-assisted copy", "Performance-first"],
          },
          href: "/webs",
        },
      ],
    },
    liveSystems: {
      title: { cs: "Systémy v provozu", en: "Live Systems" },
      subtitle: {
        cs: "Systémy, které běží pro reálné firmy. Ne slajdy — provoz.",
        en: "Systems running for real businesses. Not slides — operations.",
      },
      systems: [
        {
          name: { cs: "Cortex", en: "Cortex" },
          status: "Production",
          problem: {
            cs: "Hledání a oslovování nových firem zabere prodejnímu týmu hodiny denně.",
            en: "Finding and reaching out to new companies takes hours every day.",
          },
          ai: {
            cs: "Automatizované vyhledávání a oslovení firem",
            en: "Automated company research & outreach",
          },
          impact: {
            cs: "Pomáhá najít firmy, které odpovídají vašemu ideálnímu zákazníkovi.",
            en: "Helps find companies that match your ideal customer.",
          },
          href: "/cortex",
        },
        {
          name: { cs: "Telefonní komunikace", en: "Phone Communication" },
          status: "Production",
          problem: {
            cs: "První kontakt se zákazníkem často končí hlasovou schránkou.",
            en: "First contact with customers often ends at voicemail.",
          },
          ai: {
            cs: "Zpracování příchozích hovorů",
            en: "Handling inbound calls",
          },
          impact: {
            cs: "Žádný hovor nezůstane bez odpovědi — a tým šetří čas.",
            en: "No call goes unanswered — and the team saves time.",
          },
          href: "/systems/communication/voice",
        },
        {
          name: { cs: "Komunikace napříč kanály", en: "Channel Communication" },
          status: "Production",
          problem: {
            cs: "Zákazníci na webu čekají na odpověď — a odcházejí.",
            en: "Customers on your website wait for an answer — and leave.",
          },
          ai: {
            cs: "Odpovědi napříč kanály 24/7",
            en: "24/7 answers across channels",
          },
          impact: {
            cs: "Odpovídá na webu, WhatsAppu i e-mailem — 24/7.",
            en: "Answers on web, WhatsApp and email — 24/7.",
          },
          href: "/systems/communication/chat",
        },
        {
          name: { cs: "Automatizační systémy", en: "Automation Systems" },
          status: "Beta",
          problem: {
            cs: "Interní procesy zabírají čas, který patří rozvoji firmy.",
            en: "Internal processes take time that belongs to growing the business.",
          },
          ai: {
            cs: "Automatizace opakujících se procesů",
            en: "Automation of repetitive processes",
          },
          impact: {
            cs: "Opakující se práce běží sama — přesně a konzistentně.",
            en: "Repetitive work runs itself — accurately and consistently.",
          },
          href: "/projekty",
        },
      ],
    },
    systemsAudit: {
      title: { cs: "Zjistěte, kde může systém pomoci vaší firmě", en: "Find out where a system can help your business" },
      subtitle: {
        cs: "Krátký audit s 5 otázkami. Bez závazků, bez technického žargonu — jen konkrétní oblasti, kde má smysl stavět nebo automatizovat.",
        en: "A short 5-question audit. No commitment, no technical jargon — just specific areas where building or automating makes sense.",
      },
      intro: {
        cs: "Nejdřív rozumíme vašemu byznysu, až potom navrhujeme systémy.",
        en: "We understand your business first, then we design systems.",
      },
      stepLabel: { cs: "Otázka", en: "Question" },
      nextLabel: { cs: "Pokračovat", en: "Continue" },
      backLabel: { cs: "Zpět", en: "Back" },
      finishLabel: { cs: "Zjistit příležitosti", en: "Find opportunities" },
      resultTitle: { cs: "Vidíme tyto příležitosti", en: "Here are the opportunities we see" },
      reportHeader: {
        cs: "Analyzovali jsme vaše odpovědi.",
        en: "We analyzed your answers.",
      },
      reportSupporting: {
        cs: "Našli jsme oblasti, kde může digitální systém vaší firmě nejvíce pomoci.",
        en: "We found the areas where a digital system can help your business the most.",
      },
      cardCta: { cs: "Probrat tuto možnost", en: "Discuss this option" },
      previewTitle: {
        cs: "Co vám připravíme",
        en: "What we'll prepare for you",
      },
      previewItems: {
        cs: [
          "Návrh vhodných systémů",
          "Oblasti s největším potenciálem",
          "První návrh architektury",
        ],
        en: [
          "A proposal of suitable systems",
          "Areas with the biggest potential",
          "A first architecture draft",
        ],
      },
      resultSubtitle: {
        cs: "Na základě vašich odpovědí. Vše je zvládnutelné — začínáme od toho, co přinese největší dopad.",
        en: "Based on your answers. Everything is manageable — we start with what brings the biggest impact.",
      },
      resultEmpty: {
        cs: "Zatím nic nerozpoznáváme. Vyplňte formulář a najdeme to společně.",
        en: "Nothing recognized yet. Fill in the form and we'll find it together.",
      },
      restartLabel: { cs: "Spustit znovu", en: "Start over" },
      reportSummary: {
        cs: "Na základě vašich odpovědí vidíme několik oblastí, kde má systém smysl. Každá oblast má potenciál, důvod a konkrétní řešení — bez obecných frází.",
        en: "Based on your answers, we see several areas where a system makes sense. Each area has a potential, a reason and a concrete solution — no generic phrases.",
      },
      potentialHigh: { cs: "Vysoký potenciál", en: "High potential" },
      potentialMedium: { cs: "Střední potenciál", en: "Medium potential" },
      whyLabel: { cs: "Proč", en: "Why" },
      solutionLabel: { cs: "Možné řešení", en: "Possible solution" },
      form: {
        title: { cs: "Získejte souhrn příležitostí", en: "Get your opportunity summary" },
        subtitle: {
          cs: "Vyplňte kontakt — pošleme vám souhrn auditu a navrhneme další kroky.",
          en: "Fill in your details — we'll send you the audit summary and propose next steps.",
        },
        name: { cs: "Jméno", en: "Name" },
        company: { cs: "Firma", en: "Company" },
        email: { cs: "E-mail", en: "Email" },
        website: { cs: "Web (volitelné)", en: "Website (optional)" },
        size: { cs: "Velikost firmy", en: "Company size" },
        challenge: { cs: "Největší výzva (volitelné)", en: "Biggest challenge (optional)" },
        submit: { cs: "Odeslat a probrat možnosti", en: "Send and discuss options" },
        sending: { cs: "Odesílám…", en: "Sending…" },
        successTitle: { cs: "Děkujeme!", en: "Thank you!" },
        successText: {
          cs: "Souhrn auditu máte na cestě. Ozveme se do 24 hodin.",
          en: "Your audit summary is on its way. We'll get back to you within 24 hours.",
        },
        error: { cs: "Odeslání se nepodařilo. Zkuste to znovu.", en: "Something went wrong. Please try again." },
      },
      questions: [
        {
          id: "industry",
          multiple: false,
          label: {
            cs: "Jaký je obor vaší firmy?",
            en: "What industry is your business in?",
          },
          options: [
            { id: "services", label: { cs: "Služby", en: "Services" } },
            { id: "ecommerce", label: { cs: "E-commerce", en: "E-commerce" } },
            { id: "health", label: { cs: "Zdravotnictví", en: "Healthcare" } },
            { id: "gastro", label: { cs: "Gastronomie", en: "Hospitality" } },
            { id: "education", label: { cs: "Vzdělávání", en: "Education" } },
            { id: "industry", label: { cs: "Průmysl a výroba", en: "Industry & manufacturing" } },
            { id: "other", label: { cs: "Jiné", en: "Other" } },
          ],
        },
        {
          id: "size",
          multiple: false,
          label: {
            cs: "Kolik lidí firmu tvoří?",
            en: "How many people make up your business?",
          },
          options: [
            { id: "solo", label: { cs: "Jen já", en: "Just me" } },
            { id: "small", label: { cs: "2–10 lidí", en: "2–10 people" } },
            { id: "medium", label: { cs: "10–50 lidí", en: "10–50 people" } },
            { id: "large", label: { cs: "50+ lidí", en: "50+ people" } },
          ],
        },
        {
          id: "tasks",
          multiple: true,
          label: {
            cs: "Co vám zabírá nejvíc času?",
            en: "What takes most of your time?",
          },
          options: [
            { id: "messages", label: { cs: "Odpovídání zákazníkům", en: "Answering customers" } },
            { id: "reservations", label: { cs: "Rezervace a objednávky", en: "Bookings and orders" } },
            { id: "search", label: { cs: "Vyhledávání nových zákazníků", en: "Finding new customers" } },
            { id: "reporting", label: { cs: "Reporting a přehledy", en: "Reporting and overviews" } },
            { id: "admin", label: { cs: "Administrativa a papírování", en: "Admin and paperwork" } },
          ],
        },
        {
          id: "channels",
          multiple: true,
          label: {
            cs: "Jak komunikujete se zákazníky?",
            en: "How do you communicate with customers?",
          },
          options: [
            { id: "phone", label: { cs: "Telefon", en: "Phone" } },
            { id: "email", label: { cs: "E-mail", en: "Email" } },
            { id: "chat", label: { cs: "Chat na webu", en: "Website chat" } },
            { id: "whatsapp", label: { cs: "WhatsApp / Messenger", en: "WhatsApp / Messenger" } },
            { id: "inperson", label: { cs: "Osobně", en: "In person" } },
          ],
        },
        {
          id: "processes",
          multiple: true,
          label: {
            cs: "Které procesy se ve firmě opakují?",
            en: "Which processes repeat in your business?",
          },
          options: [
            { id: "customer", label: { cs: "Komunikace se zákazníky", en: "Customer communication" } },
            { id: "orders", label: { cs: "Příjem objednávek", en: "Order intake" } },
            { id: "data", label: { cs: "Přepisování dat mezi systémy", en: "Copying data between systems" } },
            { id: "outreach", label: { cs: "Oslovování nových firem", en: "Outreach to new companies" } },
            { id: "support", label: { cs: "Zákaznická podpora", en: "Customer support" } },
          ],
        },
      ],
      areas: [
        {
          id: "communication",
          name: { cs: "Automatizace zákaznické komunikace", en: "Customer communication automation" },
          desc: {
            cs: "Systém odpovídá na zprávy a hovory 24/7 — nikdo nečeká, žádný dotaz se neztratí.",
            en: "A system answers messages and calls 24/7 — nobody waits, no question gets lost.",
          },
          potential: "High",
          why: {
            cs: "Vaše odpovědi ukazují, že komunikace se zákazníky je ve středu vašeho byznysu.",
            en: "Your answers show customer communication sits at the center of your business.",
          },
          solution: {
            cs: "Komunikační systém s hlasem a chatem",
            en: "Communication system with voice & chat",
          },
        },
        {
          id: "leads",
          name: { cs: "Získávání nových zákazníků", en: "New customer acquisition" },
          desc: {
            cs: "Systém najde a osloví nové zákazníky automaticky.",
            en: "The system finds and reaches out to new customers automatically.",
          },
          potential: "Medium",
          why: {
            cs: "Vyhledávání a oslovování nových firem děláte dnes ručně.",
            en: "You currently find and reach out to new companies manually.",
          },
          solution: {
            cs: "Výzkumný a outreach pipeline",
            en: "Research & outreach pipeline",
          },
        },
        {
          id: "workflows",
          name: { cs: "Interní workflow", en: "Internal workflows" },
          desc: {
            cs: "Opakující se úkoly běží samy — reporting, administrativa, přepisování dat.",
            en: "Repetitive tasks run themselves — reporting, admin, data entry.",
          },
          potential: "Medium",
          why: {
            cs: "Opakující se úkoly a přepisování dat mezi systémy zabírají váš čas.",
            en: "Repetitive tasks and copying data between systems eat up your time.",
          },
          solution: {
            cs: "Automatizované workflow",
            en: "Automated workflows",
          },
        },
        {
          id: "reception",
          name: { cs: "Rezervace a objednávky", en: "Bookings and orders" },
          desc: {
            cs: "Systém přijímá rezervace a objednávky i mimo pracovní dobu.",
            en: "A system takes bookings and orders even after hours.",
          },
          potential: "High",
          why: {
            cs: "Rezervace a objednávky k vám přicházejí i mimo pracovní dobu.",
            en: "Bookings and orders come in even outside working hours.",
          },
          solution: {
            cs: "Rezervační systém pro hlas a chat",
            en: "Booking system for voice & chat",
          },
        },
      ],
    },
    systems: {
      title: { cs: "Architektura systémů", en: "Systems Architecture" },
      subtitle: {
        cs: "Systémové myšlení místo seznamu technologií.",
        en: "Systems thinking instead of a list of technologies.",
      },
      statement: {
        cs: "Nepřipojujeme jen technologie. Navrhujeme kompletní systémy.",
        en: "We don't just connect technologies. We design complete systems.",
      },
      stages: [
        {
          label: { cs: "Business Problem", en: "Business Problem" },
          desc: {
            cs: "Vše začíná u problému, který stojí peníze.",
            en: "Everything starts with a problem that costs money.",
          },
        },
        {
          label: { cs: "Logic & Intelligence", en: "Logic & Intelligence" },
          desc: {
            cs: "Rozhodování rozdělené do rolí s jasným úkolem.",
            en: "Decision-making split into roles with a clear task.",
          },
        },
        {
          label: { cs: "Knowledge Layer", en: "Knowledge Layer" },
          desc: {
            cs: "Firemní data jako zdroj pravdy.",
            en: "Business data as the source of truth.",
          },
        },
        {
          label: { cs: "Automation", en: "Automation" },
          desc: {
            cs: "Rozhodnutí končí akcí: CRM, e-maily, hovory.",
            en: "Decisions end in action: CRM, emails, calls.",
          },
        },
        {
          label: { cs: "Business Outcome", en: "Business Outcome" },
          desc: {
            cs: "Měřitelné výsledky: ušetřené hodiny, zachycené leady.",
            en: "Measurable results: saved hours, captured leads.",
          },
        },
      ],
    },
    caseStudies: {
      title: { cs: "Případové studie", en: "Case Studies" },
      subtitle: {
        cs: "Systémy, které jsme postavili srdcem.",
        en: "Systems we built with heart.",
      },
      hint: { cs: "Posouvejte doleva / doprava", en: "Scroll left / right" },
      cta: { cs: "Zobrazit případovou studii", en: "View case study" },
      archiveLabel: { cs: "Projektový archiv", en: "Project archive" },
      cases: [
        {
          category: { cs: "Web & digitální zážitek", en: "Web & digital experience" },
          name: { cs: "Ponici.cz", en: "Ponici.cz" },
          description: {
            cs: "Digitální transformace jezdecké školy — strategie, design, UX a vývoj.",
            en: "Digital transformation of a riding school — strategy, design, UX and development.",
          },
          keyPoints: {
            cs: ["Klientský projekt · Praha", "Vlastní identita a design", "Next.js · živý web"],
            en: ["Client project · Prague", "Custom identity & design", "Next.js · live website"],
          },
          href: "/projekty/ponici",
          visual: "/images/ponici/ponici-home.png",
          visualStyle: "image",
        },
        {
          category: { cs: "Web & design", en: "Web & design" },
          name: { cs: "Zlatý Hřeben", en: "Zlatý Hřeben" },
          description: {
            cs: "Prémiová webová prezentace pro pánské holičství — od vizuální identity po responzivní UI.",
            en: "A premium barbershop website — from visual identity to responsive UI.",
          },
          keyPoints: {
            cs: ["Klientský projekt · design & vývoj", "Vlastní vizuální identita", "Next.js · Vercel"],
            en: ["Client project · design & development", "Custom visual identity", "Next.js · Vercel"],
          },
          href: "/projekty/zlaty-hreben",
          visual: "/images/webs/screenshot.png",
          visualStyle: "image",
        },
        {
          category: { cs: "Interní systém", en: "Internal system" },
          name: { cs: "Cortex", en: "Cortex" },
          description: {
            cs: "Interní systém pro výzkum firem a evidence-based oslovení.",
            en: "An internal system for company research and evidence-based outreach.",
          },
          keyPoints: {
            cs: ["Automatizovaný výzkum a oslovení", "Důkazy místo odhadů", "AI · automatizace · scraping"],
            en: ["Automated research & outreach", "Evidence instead of guesses", "AI · automation · scraping"],
          },
          href: "/cortex",
          visual: "/images/cortex/cortex-dashboard.png",
          visualStyle: "image",
        },
      ],
    },
    trustProof: {
      title: { cs: "Nejen koncepty. Stavíme funkční systémy.", en: "Not just concepts. We build working systems." },
      subtitle: {
        cs: "Každý systém níže je skutečný — má status, řešený problém a nasazenou technologii.",
        en: "Every system below is real — it has a status, a problem it solves and deployed technology.",
      },
      systems: [
        {
          name: { cs: "Recepční systém", en: "Reception System" },
          status: "Production",
          problem: {
            cs: "Zákazníci čekali na odpověď mimo pracovní dobu.",
            en: "Customers waited for an answer outside working hours.",
          },
          solution: {
            cs: "Systém, který komunikuje se zákazníky 24/7.",
            en: "A system that talks to customers 24/7.",
          },
          capabilities: { cs: ["Komunikace 24/7", "Znalost firmy", "Automatizace"], en: ["24/7 communication", "Business knowledge", "Automation"] },
          impact: {
            cs: "Rychlejší reakce a méně manuální komunikace.",
            en: "Faster responses and less manual communication.",
          },
        },
        {
          name: { cs: "Cortex", en: "Cortex" },
          status: "Beta",
          problem: {
            cs: "Firmy hledají nové zákazníky bez jasného systému.",
            en: "Businesses look for new customers without a clear system.",
          },
          solution: {
            cs: "Pipeline pro identifikaci relevantních příležitostí.",
            en: "A pipeline for identifying relevant opportunities.",
          },
          capabilities: { cs: ["Identifikace příležitostí", "Vyhodnocování firem", "Automatizace"], en: ["Opportunity identification", "Company evaluation", "Automation"] },
          impact: {
            cs: "Méně času na hledání, více času na jednání.",
            en: "Less time searching, more time negotiating.",
          },
        },
        {
          name: { cs: "Telefonní systém", en: "Phone System" },
          status: "Testing",
          problem: {
            cs: "Telefonická komunikace zabírá týmu čas.",
            en: "Phone communication takes up the team's time.",
          },
          solution: {
            cs: "Automatizovaný první kontakt.",
            en: "Automated first contact.",
          },
          capabilities: { cs: ["Automatizovaný první kontakt", "Přirozené hovory"], en: ["Automated first contact", "Natural conversations"] },
          impact: {
            cs: "Tým se věnuje jen hovorům, které vyžadují člověka.",
            en: "The team only handles calls that need a human.",
          },
        },
        {
          name: { cs: "Kanálová komunikace", en: "Channel Communication" },
          status: "Production",
          problem: {
            cs: "Dotazy se hromadí na více kanálech najednou.",
            en: "Questions pile up across multiple channels at once.",
          },
          solution: {
            cs: "Jedna inteligence ve všech kanálech — web, WhatsApp, e-mail.",
            en: "One intelligence across all channels — web, WhatsApp, email.",
          },
          capabilities: { cs: ["Jedna inteligence napříč kanály", "Odpovědi 24/7"], en: ["One intelligence across channels", "24/7 answers"] },
          impact: {
            cs: "Žádný dotaz nezůstane bez odpovědi.",
            en: "No question goes unanswered.",
          },
        },
      ],
    },
    audience: {
      title: { cs: "Kde systém dává největší smysl?", en: "Where does a system make the most sense?" },
      subtitle: {
        cs: "Podle typu firmy. Nejdřív pochopíme vaši situaci, pak navrhneme řešení.",
        en: "Depending on your business. We understand your situation first, then design the solution.",
      },
      cards: [
        {
          title: { cs: "Zákaznická komunikace", en: "Customer Communication" },
          items: {
            cs: ["Hodně zákaznických dotazů", "Zákaznická podpora", "Rezervace a objednávky"],
            en: ["Many customer questions", "Support workload", "Booking processes"],
          },
        },
        {
          title: { cs: "Prodej a nové leady", en: "Sales & Leads" },
          items: {
            cs: ["Potřeba nových zákazníků", "Ruční vyhledávání firem", "Studené oslovení"],
            en: ["Need for new customers", "Manual research", "Cold outreach"],
          },
        },
        {
          title: { cs: "Interní provoz", en: "Internal Operations" },
          items: {
            cs: ["Opakující se workflow", "Manuální procesy", "Přepisování dat mezi systémy"],
            en: ["Repetitive workflows", "Manual processes", "Copying data between systems"],
          },
        },
        {
          title: { cs: "Systémy na míru", en: "Custom Systems" },
          items: {
            cs: ["Nestandardní problémy", "Existující procesy", "Vlastní představa řešení"],
            en: ["Unique problems", "Existing processes", "A specific idea in mind"],
          },
        },
      ],
    },
    whatWeBuild: {
      title: { cs: "Co stavíme", en: "What we build" },
      subtitle: {
        cs: "Systémy pro každou část byznysu. Od webu po interní nástroje.",
        en: "Systems for every part of the business. From the website to internal tools.",
      },
      cards: [
        {
          title: { cs: "Digitální přítomnost", en: "Digital Presence" },
          desc: {
            cs: "Weby, landing pages a rozhraní navržené tak, aby vaši firmu nebylo možné přehlédnout.",
            en: "Websites, landing pages and interfaces designed to make your business impossible to ignore.",
          },
        },
        {
          title: { cs: "Zákaznické systémy", en: "Customer Systems" },
          desc: {
            cs: "Rezervace, komunikace, příjem zakázek a podpora — systémy, které pracují za vás.",
            en: "Booking, communication, intake and support — systems that work for you.",
          },
        },
        {
          title: { cs: "Firemní systémy", en: "Business Systems" },
          desc: {
            cs: "Interní dashboardy, workflow a nástroje, které zpřehlední provoz firmy.",
            en: "Internal dashboards, workflows and tools that make operations clear.",
          },
        },
        {
          title: { cs: "Automatizace", en: "Automation" },
          desc: {
            cs: "Propojení opakujících se procesů a odstranění zbytečné manuální práce.",
            en: "Connecting repetitive processes and removing unnecessary manual work.",
          },
        },
        {
          title: { cs: "Inteligentní systémy", en: "Intelligent Systems" },
          desc: {
            cs: "Systémy, které využívají moderní technologie tam, kde přinášejí skutečnou výhodu.",
            en: "Systems that use modern technology where it creates a genuine advantage.",
          },
        },
      ],
    },
    controlRoom: {
      title: { cs: "Řídicí centrum", en: "Control Room" },
      subtitle: {
        cs: "Za oponou našich systémů. Co běží, co testujeme a co stavíme.",
        en: "Behind the scenes of our systems. What runs, what we test, and what we build.",
      },
      systems: [
        { name: { cs: "Recepční systém", en: "Reception System" }, status: "Production" },
        { name: { cs: "Cortex", en: "Cortex" }, status: "Beta" },
        { name: { cs: "Telefonní systém", en: "Phone System" }, status: "Testing" },
        { name: { cs: "Kanálová komunikace", en: "Channel Communication" }, status: "Production" },
        { name: { cs: "Automatizační systémy", en: "Automation Systems" }, status: "Beta" },
        { name: { cs: "Výzkumné systémy", en: "Research Systems" }, status: "Building" },
      ],
      models: {
        cs: ["Jazyk a logika", "Rozpoznávání řeči", "Znalostní vrstva", "Automatizace", "Integrace", "Monitoring"],
        en: ["Language & logic", "Speech understanding", "Knowledge layer", "Automation", "Integrations", "Monitoring"],
      },
      modules: [
        {
          label: { cs: "Agenti a logika", en: "Agents & Logic" },
          desc: { cs: "Rozhodování s jasnou rolí a úkolem.", en: "Decision-making with a clear role and task." },
        },
        {
          label: { cs: "Znalostní vrstva", en: "Knowledge Layer" },
          desc: { cs: "Firemní data jako zdroj pravdy.", en: "Business data as the source of truth." },
        },
        {
          label: { cs: "Automatizace", en: "Automation" },
          desc: { cs: "Akce místo odpovědí.", en: "Actions instead of answers." },
        },
        {
          label: { cs: "Integrační vrstva", en: "Integration Layer" },
          desc: { cs: "CRM, kanály, interní systémy.", en: "CRM, channels, internal systems." },
        },
        {
          label: { cs: "Monitoring", en: "Monitoring" },
          desc: { cs: "Každý systém měříme a iterujeme.", en: "Every system is measured and iterated." },
        },
      ],
    },
    experiments: {
      title: { cs: "Časová osa experimentů", en: "Experiments Timeline" },
      subtitle: {
        cs: "Laboratoř nikdy nespí. Toto je aktuální stav.",
        en: "The lab never sleeps. Here's the current state.",
      },
      phases: [
        {
          label: { cs: "Aktuální experimenty", en: "Current experiments" },
          title: { cs: "Právě probíhá", en: "Running now" },
          items: [
            {
              name: { cs: "Voice persona research", en: "Voice persona research" },
              desc: {
                cs: "Přirozenější tón a chování agentů.",
                en: "More natural tone and behavior for agents.",
              },
            },
            {
              name: { cs: "Knowledge retrieval", en: "Knowledge retrieval" },
              desc: {
                cs: "Přesnější odpovědi z větších dat.",
                en: "More accurate answers from larger datasets.",
              },
            },
            {
              name: { cs: "Automation workflows", en: "Automation workflows" },
              desc: {
                cs: "Více procesů, které běží samy.",
                en: "More processes that run themselves.",
              },
            },
          ],
        },
        {
          label: { cs: "Výzkum", en: "Research" },
          title: { cs: "Na stole", en: "On the bench" },
          items: [
            {
              name: { cs: "Spolupracující systémy", en: "Collaborating systems" },
              desc: {
                cs: "Více komponent, které spolupracují na úkolu.",
                en: "Multiple components collaborating on a task.",
              },
            },
            {
              name: { cs: "Paměť a kontext", en: "Memory & context" },
              desc: {
                cs: "Systémy, které si pamatují a učí se.",
                en: "Systems that remember and learn.",
              },
            },
            {
              name: { cs: "Voice UX vzory", en: "Voice UX patterns" },
              desc: {
                cs: "Konverzace, které působí lidsky.",
                en: "Conversations that feel human.",
              },
            },
          ],
        },
        {
          label: { cs: "Budoucí systémy", en: "Future systems" },
          title: { cs: "Na rýsovacím prkně", en: "On the drawing board" },
          items: [
            {
              name: { cs: "Provozní agent", en: "Operations agent" },
              desc: {
                cs: "Systém, který řídí provoz firmy.",
                en: "A system that runs business operations.",
              },
            },
            {
              name: { cs: "Prediktivní systémy", en: "Predictive systems" },
              desc: {
                cs: "Předvídání potřeb dřív, než nastanou.",
                en: "Anticipating needs before they arise.",
              },
            },
            {
              name: { cs: "Autonomní workflow", en: "Autonomous workflows" },
              desc: {
                cs: "End-to-end procesy bez lidského dohledu.",
                en: "End-to-end processes without human supervision.",
              },
            },
          ],
        },
      ],
    },
    ecosystem: {
      title: { cs: "Projekty", en: "Projects" },
      subtitle: { cs: "Vše, co stavíme. Na jednom místě.", en: "Everything we build. In one place." },
      cards: [
        {
          title: { cs: "Cortex", en: "Cortex" },
          desc: {
            cs: "Prodejní systém. Vyhledá firmy. Vyhodnotí příležitosti. Osloví automaticky.",
            en: "A sales system. Finds leads. Evaluates opportunities. Reaches out automatically.",
          },
          href: "/cortex",
        },
        {
          title: { cs: "Komunikační systémy", en: "Communication Systems" },
          desc: {
            cs: "Hlasová a chatová komunikace pro firmy. 24/7 zákaznická podpora a recepce.",
            en: "Voice and chat communication for businesses. 24/7 customer support and reception.",
          },
          href: "/systems/communication",
        },
        {
          title: { cs: "Weby", en: "Websites" },
          desc: {
            cs: "Prémiové webové prezentace, které vypadají jako produktový launch, ne jako šablona.",
            en: "Premium web presentations that feel like product launches. Not templates.",
          },
          href: "/webs",
        },
        {
          title: { cs: "YouTube", en: "YouTube" },
          desc: { cs: "Veřejná dokumentace vývoje, experimentů a launchů.", en: "Public documentation of development, experiments and launches." },
          href: "/youtube",
        },
      ],
    },
    process: {
      title: { cs: "Jak vznikají systémy", en: "How systems are built" },
      subtitle: { cs: "Od nápadu po produkci. Každá fáze má svůj význam.", en: "From idea to production. Every phase matters." },
      steps: [
        { title: { cs: "Nápad", en: "Idea" }, desc: { cs: "Definice problému, cílů a vize. Žádné zbytečnosti.", en: "Define the problem, goals, and vision. No fluff." } },
        { title: { cs: "Design", en: "Design" }, desc: { cs: "Architektura řešení, UX, vizuální jazyk. Každý prvek má důvod.", en: "Solution architecture, UX, visual language. Every element has a reason." } },
        { title: { cs: "Technologie", en: "Technology" }, desc: { cs: "Výběr nástrojů, integrace, vývoj. Technologie je prostředek, ne cíl.", en: "Tooling, integration, development. Technology is a means, not a goal." } },
        { title: { cs: "Vývoj", en: "Development" }, desc: { cs: "Čistý kód, API, infrastruktura. Stavíme pro produkci.", en: "Clean code, APIs, infrastructure. Built for production." } },
        { title: { cs: "Launch", en: "Launch" }, desc: { cs: "Nasazení, monitoring, optimalizace. Hotovo není nikdy.", en: "Deployment, monitoring, optimization. Never truly done." } },
        { title: { cs: "Optimalizace", en: "Optimization" }, desc: { cs: "Data, feedback, iterace. Každý cyklus je lepší.", en: "Data, feedback, iteration. Every cycle is better." } },
      ],
    },
    youtube: {
      title: { cs: "YouTube", en: "YouTube" },
      subtitle: {
        cs: "Technologie, vývoj a reálné projekty. Bez zbytečné teorie.",
        en: "Tech, development and real projects. No unnecessary theory.",
      },
      cta: { cs: "Sledovat na YouTube", en: "Follow on YouTube" },
      href: "/youtube",
    },
    about: {
      name: "Matyáš Vojan",
      handle: "recepce.tech",
      heading: { cs: "Kdo staví tyto systémy?", en: "Who builds these systems?" },
      blocks: [
        {
          title: { cs: "Filozofie", en: "Philosophy" },
          text: {
            cs: "Jednoduchost jako cíl, ne jako výchozí bod. Každý krok musí dávat smysl. Stavím systémy, které fungují samy.",
            en: "Simplicity as a goal, not a starting point. Every step must make sense. I build systems that work on their own.",
          },
        },
        {
          title: { cs: "Přístup", en: "Approach" },
          text: {
            cs: "Web + software + automatizace. Vrstvy, které se navzájem posilují. Každý projekt začíná problémem, ne technologií.",
            en: "Web + software + automation. Layers that reinforce each other. Every project starts with a problem, not a technology.",
          },
        },
        {
          title: { cs: "Zaměření", en: "Focus" },
          text: {
            cs: "Systémy, které doručují reálnou hodnotu. Komunikace se zákazníky, automatizace, interní nástroje, weby — vše, co posouvá byznys dopředu.",
            en: "Systems that deliver real value. Customer communication, automation, internal tools, websites — everything that moves businesses forward.",
          },
        },
      ],
    },
    finalCta: {
      title: { cs: "Postavte si svůj systém.", en: "Build your system." },
      emphasis: { cs: ["svůj"], en: ["your"] },
      subtitle: {
        cs: "Popište nám problém, který chcete vyřešit. Navrhneme řešení, které dává smysl.",
        en: "Describe the problem you want to solve. We'll design a solution that makes sense.",
      },
      cta: { cs: "Začít konzultaci", en: "Start a consultation" },
      altCta: { cs: "Prozkoumat projekty", en: "Explore projects" },
    },
  },
};
