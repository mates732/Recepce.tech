export interface Profession {
  id: string;
  colors: { accent: string; glow1: string; glow2: string };
  cs: {
    name: string;
    desc: string;
    tags: string[];
    features: { label: string; desc: string }[];
  };
  en: {
    name: string;
    desc: string;
    tags: string[];
    features: { label: string; desc: string }[];
  };
}

export const PROFESSIONS: Profession[] = [
  {
    id: "barbershop",
    colors: { accent: "#A0A0A0", glow1: "rgba(160,160,160,0.07)", glow2: "rgba(96,96,96,0.04)" },
    cs: {
      name: "Barbershop",
      desc: "AI recepční, která nezmešká jediný hovor. Rezervace termínů, SMS potvrzení a správa kalendáře – vše automaticky.",
      tags: ["Rezervace termínů", "Automatické SMS", "Víkendové hovory", "Správa kalendáře"],
      features: [
        { label: "Rezervace termínů", desc: "Zákazníci si objednají přes hovor bez čekání. AI najde nejbližší volný slot a zapíše ho do kalendáře." },
        { label: "Automatické SMS", desc: "Potvrzení rezervace a připomínka 24h předem – odeslané automaticky, bez vašeho zásahu." },
        { label: "Víkendové hovory", desc: "Příjem objednávek i v sobotu a neděli. AI zastihne zákazníky, vy se věnujete stříhání." },
        { label: "Správa kalendáře", desc: "Synchronizace napříč barbery i křesly v reálném čase. Žádné kolize, žádné přeobsazení." },
      ],
    },
    en: {
      name: "Barbershop",
      desc: "An AI receptionist that never misses a call. Appointment booking, SMS confirmations, and calendar management – all automatic.",
      tags: ["Appointment booking", "Auto SMS", "Weekend calls", "Calendar management"],
      features: [
        { label: "Appointment booking", desc: "Customers book via call without waiting. AI finds the next available slot and adds it to the calendar." },
        { label: "Auto SMS", desc: "Booking confirmation and reminder 24h before – sent automatically, no manual work." },
        { label: "Weekend calls", desc: "Accept bookings on Saturdays and Sundays. AI catches every call while you focus on cutting." },
        { label: "Calendar management", desc: "Real-time sync across barbers and chairs. No conflicts, no overbooking." },
      ],
    },
  },
  {
    id: "dentalni-hygiena",
    colors: { accent: "#00C2FF", glow1: "rgba(0,194,255,0.07)", glow2: "rgba(0,153,204,0.05)" },
    cs: {
      name: "Dentální hygiena",
      desc: "Okamžitá odpověď pro vaše pacienty. Diskrétní rezervace a správa konzultačních termínů bez čekání.",
      tags: ["Diskrétní rezervace", "Konzultační termíny", "Recall pacientů", "Sledování kapacity"],
      features: [
        { label: "Diskrétní rezervace", desc: "Pacienti se objednají hovorem bez zbytečného vysvětlování. AI respektuje citlivost zdravotních údajů." },
        { label: "Konzultační termíny", desc: "První konzultace i pravidelné hygieny – AI najde ideální slot podle délky procedury." },
        { label: "Recall pacientů", desc: "Automatické připomenutí po doporučené době. Zvyšte návratnost bez manuální práce." },
        { label: "Sledování kapacity", desc: "Přehled o vytížení hygienistek v reálném čase. Optimalizace ordinačních hodin." },
      ],
    },
    en: {
      name: "Dental Hygiene",
      desc: "Instant answers for your patients. Discreet booking and consultation scheduling without waiting.",
      tags: ["Discreet booking", "Consultation slots", "Patient recall", "Capacity tracking"],
      features: [
        { label: "Discreet booking", desc: "Patients book via call without unnecessary explanations. AI respects medical data sensitivity." },
        { label: "Consultation slots", desc: "First consultations and regular cleanings – AI finds the ideal slot based on procedure duration." },
        { label: "Patient recall", desc: "Automatic reminders after the recommended interval. Increase return rates without manual work." },
        { label: "Capacity tracking", desc: "Real-time overview of hygienist availability. Optimize office hours effortlessly." },
      ],
    },
  },
  {
    id: "estetika",
    colors: { accent: "#A78BFA", glow1: "rgba(167,139,250,0.07)", glow2: "rgba(124,58,237,0.05)" },
    cs: {
      name: "Estetická klinika",
      desc: "Vaše klinika, vaše pravidla. Inteligentní rezervace procedur a automatické připomínky pro klienty.",
      tags: ["Online rezervace", "Výběr procedury", "SMS připomínky", "Diskrétní komunikace"],
      features: [
        { label: "Online rezervace", desc: "Klienti si vyberou proceduru a termín hovorem. AI doporučí vhodný slot podle délky a typu zákroku." },
        { label: "Výběr procedury", desc: "AI poradí s výběrem na základě popisu problému – botox, výplně, laser nebo konzultace." },
        { label: "SMS připomínky", desc: "Automatické připomenutí s instrukcemi před procedurou. Snižte no-show rate." },
        { label: "Diskrétní komunikace", desc: "Veškerá komunikace probíhá s maximální diskrétností. Žádné citlivé údaje mimo zabezpečený kanál." },
      ],
    },
    en: {
      name: "Aesthetic Clinic",
      desc: "Your clinic, your rules. Intelligent procedure booking and automatic client reminders.",
      tags: ["Online booking", "Procedure selection", "SMS reminders", "Discreet communication"],
      features: [
        { label: "Online booking", desc: "Clients choose a procedure and time via call. AI recommends the best slot based on treatment type and duration." },
        { label: "Procedure selection", desc: "AI helps clients choose based on their description – Botox, fillers, laser, or consultation." },
        { label: "SMS reminders", desc: "Automatic reminders with pre-procedure instructions. Reduce no-show rates." },
        { label: "Discreet communication", desc: "All communication is fully confidential. No sensitive data outside the secure channel." },
      ],
    },
  },
  {
    id: "fitness",
    colors: { accent: "#60A5FA", glow1: "rgba(96,165,250,0.07)", glow2: "rgba(0,102,255,0.05)" },
    cs: {
      name: "Fitness & PT",
      desc: "Trenéři se soustředí na klienty, ne na telefon. Automatické rezervace tréninků a správa kapacity studia.",
      tags: ["Rezervace tréninků", "Skupinové hodiny", "Kapacita studia", "Motivační připomínky"],
      features: [
        { label: "Rezervace tréninků", desc: "Klienti si rezervují osobní trénink hovorem. AI najde čas podle vytížení trenéra." },
        { label: "Skupinové hodiny", desc: "Přihlášení na jógu, pilates nebo HIIT – AI hlídá kapacitu a zapíše klienta automaticky." },
        { label: "Kapacita studia", desc: "Maximální počet cvičících na lekci. Při naplnění AI nabídne alternativní termín." },
        { label: "Motivační připomínky", desc: "Automatické zprávy před tréninkem. Zvyšte docházku a udržte klienty v pohybu." },
      ],
    },
    en: {
      name: "Fitness & PT",
      desc: "Trainers focus on clients, not phones. Automated session booking and studio capacity management.",
      tags: ["Session booking", "Group classes", "Studio capacity", "Motivational reminders"],
      features: [
        { label: "Session booking", desc: "Clients book personal training via call. AI finds the best time based on trainer availability." },
        { label: "Group classes", desc: "Sign up for yoga, Pilates, or HIIT – AI tracks capacity and enrolls clients automatically." },
        { label: "Studio capacity", desc: "Maximum attendees per class. When full, AI offers alternative slots." },
        { label: "Motivational reminders", desc: "Auto-messages before each session. Boost attendance and keep clients moving." },
      ],
    },
  },
  {
    id: "kadernictvi",
    colors: { accent: "#F9A8D4", glow1: "rgba(249,168,212,0.07)", glow2: "rgba(232,120,144,0.05)" },
    cs: {
      name: "Kadeřnictví",
      desc: "Žádná zmeškaná rezervace. Inteligentní booking s výběrem kadeřníka a připomínky pro každou návštěvu.",
      tags: ["Online rezervace", "Výběr kadeřníka", "SMS potvrzení", "Historie návštěv"],
      features: [
        { label: "Online rezervace", desc: "Zákazníci si objednají hovorem 24/7. AI najde volný termín u oblíbeného kadeřníka." },
        { label: "Výběr kadeřníka", desc: "AI umožňuje výběr konkrétního kadeřníka na základě zkušenosti nebo specializace." },
        { label: "SMS potvrzení", desc: "Automatické potvrzení rezervace a připomínka den předem. Minimalizace zmeškaných návštěv." },
        { label: "Historie návštěv", desc: "AI eviduje preference a historii – barvy, střihy, produkty. Každá návštěva staví na té předchozí." },
      ],
    },
    en: {
      name: "Hair Salon",
      desc: "No missed bookings. Intelligent scheduling with stylist selection and reminders for every visit.",
      tags: ["Online booking", "Stylist selection", "SMS confirmation", "Visit history"],
      features: [
        { label: "Online booking", desc: "Customers book 24/7 via call. AI finds available slots with their preferred stylist." },
        { label: "Stylist selection", desc: "AI enables selection of a specific stylist based on expertise or specialization." },
        { label: "SMS confirmation", desc: "Automatic booking confirmation and reminder one day before. Minimize missed appointments." },
        { label: "Visit history", desc: "AI tracks preferences and history – colors, cuts, products. Every visit builds on the last." },
      ],
    },
  },
  {
    id: "masaze",
    colors: { accent: "#34D399", glow1: "rgba(52,211,153,0.07)", glow2: "rgba(0,184,132,0.05)" },
    cs: {
      name: "Masáže & wellness",
      desc: "Klid od prvního kontaktu. Inteligentní rezervace procedur a automatická komunikace s klienty.",
      tags: ["Rezervace procedur", "Výběr terapeuta", "Přípravné instrukce", "Automatické připomínky"],
      features: [
        { label: "Rezervace procedur", desc: "Klienti si vyberou masáž nebo wellness balíček hovorem. AI poradí podle preferencí." },
        { label: "Výběr terapeuta", desc: "Rezervace konkrétního terapeuta nebo volba „první volný“. AI respektuje osobní preference." },
        { label: "Přípravné instrukce", desc: "Automatické odeslání instrukcí před procedurou – pitný režim, kontraindikace, parkování." },
        { label: "Automatické připomínky", desc: "Připomínka 48h a 24h předem. Snižte storna a udržte plnou kapacitu." },
      ],
    },
    en: {
      name: "Massage & Wellness",
      desc: "Calm from the first contact. Intelligent procedure booking and automated client communication.",
      tags: ["Procedure booking", "Therapist selection", "Prep instructions", "Auto reminders"],
      features: [
        { label: "Procedure booking", desc: "Clients choose a massage or wellness package via call. AI recommends based on preferences." },
        { label: "Therapist selection", desc: "Book a specific therapist or the first available. AI respects personal preferences." },
        { label: "Prep instructions", desc: "Auto-send preparation instructions – hydration, contraindications, parking details." },
        { label: "Auto reminders", desc: "Reminder 48h and 24h before. Reduce cancellations and maintain full capacity." },
      ],
    },
  },
  {
    id: "stomatologie",
    colors: { accent: "#38BDF8", glow1: "rgba(56,189,248,0.07)", glow2: "rgba(2,132,199,0.05)" },
    cs: {
      name: "Stomatologie",
      desc: "Rychlá pomoc při akutní bolesti i běžné kontroly. AI objedná pacienty 24/7, vy se věnujete léčbě.",
      tags: ["Urgentní objednání", "Pravidelné kontroly", "Dotazy k pojišťovně", "Noční pohotovost"],
      features: [
        { label: "Urgentní objednání", desc: "Pacient s bolestí volá a AI ho okamžitě zařadí do nejbližšího volného slotu pro akutní případy." },
        { label: "Pravidelné kontroly", desc: "Automatické připomenutí preventivní prohlídky. AI naplánuje termín podle preferencí pacienta." },
        { label: "Dotazy k pojišťovně", desc: "Základní informace o spoluúčasti a výkonech – AI zodpoví bez zatížení sestry." },
        { label: "Noční pohotovost", desc: "Příjem urgentních hovorů i v noci. AI vyhodnotí závažnost a spojí s lékařem při akutním stavu." },
      ],
    },
    en: {
      name: "Dentistry",
      desc: "Fast help for acute pain and routine check-ups. AI books patients 24/7 while you focus on treatment.",
      tags: ["Urgent booking", "Regular check-ups", "Insurance queries", "After-hours urgency"],
      features: [
        { label: "Urgent booking", desc: "Patients in pain call and AI immediately schedules them into the next available emergency slot." },
        { label: "Regular check-ups", desc: "Automatic preventive check-up reminders. AI schedules based on patient preferences." },
        { label: "Insurance queries", desc: "Basic information about coverage and procedures – AI answers without burdening your staff." },
        { label: "After-hours urgency", desc: "Accept urgent calls at night. AI triages severity and connects with the doctor for acute cases." },
      ],
    },
  },
];
