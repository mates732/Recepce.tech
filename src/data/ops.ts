/**
 * Provozní data admin dashboardu.
 *
 * Záměr: frontend je hotový a plně funkční nad těmito strukturami. Až bude
 * backend připojen (Supabase / Vapi API), stačí nahradit exporty v tomto
 * souboru dotazy do DB — typy zůstávají kontraktem mezi UI a API.
 *
 * Demo data popisují reálně vypadající klienty. UGO Salaterie – Stromovka je
 * první plně nakonfigurovaný klient; ostatní klienti mají údaje minimální.
 * Žádné skutečné citlivé údaje (telefony jsou smyšlené, ale formát odpovídá
 * realitě; Vapi ID jsou placeholders načítané z env v produkci).
 */

import type { IconName } from '@/components/shared/Icon';

/* ------------------------------------------------------------------ */
/* Typy — kontrakt pro budoucí backend                                 */
/* ------------------------------------------------------------------ */

export type AssistantStatus = 'active' | 'inactive' | 'draft';
export type VapiStatus = 'connected' | 'not_connected' | 'error';
export type ConversationStatus = 'resolved' | 'unresolved' | 'escalated' | 'missed';
export type CallOutcome =
  | 'question_answered'
  | 'reservation_created'
  | 'reservation_changed'
  | 'info_only'
  | 'human_handoff'
  | 'no_response'
  | 'failed';

export interface ClientOps {
  id: string;
  name: string;
  slug: string;
  industry: string;
  status: AssistantStatus;
  website?: string;
  address?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  /** IČO / firemní údaje — jen pro demo realističnost */
  companyId?: string;
  notes?: string;
  createdAt: string;
  /** Barevná initData pro avatary — z UI odvozeno, ne z backendu */
  initials: string;
}

export interface AssistantVoice {
  provider: string;
  voice: string;
  language: string;
  speakingStyle: string;
  interruptionSensitivity: 'low' | 'medium' | 'high';
}

export interface AssistantBehavior {
  greeting: string;
  fallback: string;
  humanHandoff: string;
  maxConversationLengthSec: number;
  silenceTimeoutSec: number;
}

export interface Assistant {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: AssistantStatus;
  phoneNumber: string | null;
  vapiAssistantId: string | null;
  vapiStatus: VapiStatus;
  systemPrompt: string;
  voice: AssistantVoice;
  behavior: AssistantBehavior;
  /** Slug demo scénáře pro reálný Vapi hovor (src/lib/vapi/server.ts) */
  vapiDemoSlug?: string;
  createdAt: string;
  lastActivityAt: string | null;
}

export type KnowledgeCategory =
  | 'faq'
  | 'business'
  | 'products'
  | 'hours'
  | 'locations'
  | 'policies'
  | 'custom';

export interface KnowledgeEntry {
  id: string;
  clientId: string;
  assistantId?: string;
  title: string;
  category: KnowledgeCategory;
  /** Konkrétní otázka, na kterou záznam odpovídá (pro FAQ typ záznamů) */
  question?: string;
  content: string;
  source: string;
  updatedAt: string;
}

export interface TranscriptMessage {
  id: string;
  role: 'assistant' | 'caller' | 'system';
  text: string;
  /** Sekundy od začátku hovoru */
  atSec: number;
}

export interface Conversation {
  id: string;
  assistantId: string;
  clientId: string;
  /** Číslo volajícího — demo data používají maskovaný formát */
  callerNumber: string;
  callerName?: string;
  startedAt: string;
  durationSec: number;
  status: ConversationStatus;
  outcome: CallOutcome;
  summary: string;
  detectedIntent: string;
  escalationReason?: string;
  transcript: TranscriptMessage[];
  metadata: {
    direction: 'inbound' | 'outbound';
    endReason: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    transferredTo?: string;
    recordingUrl?: string;
    costUsd?: number;
    latencyMs?: number;
  };
}

export interface CallRecord {
  id: string;
  conversationId: string;
  assistantId: string;
  clientId: string;
  startedAt: string;
  durationSec: number;
  outcome: CallOutcome;
  status: 'ended' | 'ongoing' | 'failed' | 'missed';
}

export type IntegrationKind =
  | 'vapi'
  | 'webhook'
  | 'crm'
  | 'calendar'
  | 'email';

export interface Integration {
  id: string;
  assistantId: string;
  kind: IntegrationKind;
  name: string;
  /** Stručný popis stavu — např. „Webhook na end-of-call report“ */
  detail: string;
  status: 'connected' | 'not_configured' | 'error';
  /** Konfigurační klíče bez hodnot — citlivé údaje nikdy do UI */
  configKeys: string[];
}

export interface UsageRecord {
  id: string;
  clientId: string;
  periodStart: string;
  periodEnd: string;
  calls: number;
  minutes: number;
  includedMinutes: number;
}

export interface OpsStats {
  activeAssistants: number;
  totalCalls: number;
  minutesUsed: number;
  avgCallDurationSec: number;
  callsToday: number;
  unresolvedConversations: number;
}

/* ------------------------------------------------------------------ */
/* Klienti                                                             */
/* ------------------------------------------------------------------ */

export const OPS_CLIENTS: ClientOps[] = [
  {
    id: 'ugo',
    name: 'UGO Salaterie',
    slug: 'ugo-salaterie',
    industry: 'Gastronomie — saláty a limonády',
    status: 'active',
    website: 'https://www.ugosalaterie.cz',
    address: 'Vltavská 24, 118 00 Praha 7 — Stromovka',
    contactName: 'Provozovatel Stromovka',
    contactEmail: 'stromovka@ugosalaterie.cz',
    companyId: 'IČO 00000000 (doplnit)',
    notes:
      'První pilotní klient. Asistent „UGO Salaterie – Stromovka“ zvedá telefon mimo provozní dobu i během špičky. Zaměřit se na letní provoz — hovory o víkendech Stromovka výrazně rostou.',
    createdAt: '2025-06-12T09:00:00+02:00',
    initials: 'UG',
  },
  {
    id: 'textil-ludmila',
    name: 'Textil Ludmila',
    slug: 'textil-ludmila',
    industry: 'Textil a látky',
    status: 'active',
    contactName: 'Ludmila',
    contactEmail: 'objednavky@textil-ludmila.cz',
    notes: 'Bilance a používání se řeší v sekci Fakturace.',
    createdAt: '2025-08-02T14:30:00+02:00',
    initials: 'TL',
  },
  {
    id: 'noname-barbershop',
    name: 'Noname Barbershop',
    slug: 'noname-barbershop',
    industry: 'Pánské holičství',
    status: 'active',
    contactName: 'Marek',
    contactEmail: 'booking@nonamebarbers.cz',
    createdAt: '2025-08-18T10:00:00+02:00',
    initials: 'NB',
  },
  {
    id: 'paws-and-care',
    name: 'Paws & Care',
    slug: 'paws-and-care',
    industry: 'Veterinární klinika',
    status: 'draft',
    contactName: 'Vet. klinika Paws & Care',
    createdAt: '2025-09-05T11:20:00+02:00',
    initials: 'PC',
  },
];

/* ------------------------------------------------------------------ */
/* Asistenti                                                           */
/* ------------------------------------------------------------------ */

const UGO_SYSTEM_PROMPT = `Jsi UGO, telefonní asistent UGO Salaterie na Stromovce v Praze.

TVOJE ROLE
- Zvedáš telefon, představ se: „Dobrý den, tady UGO z UGO Salaterie Stromovka.“
- Odpovídáš na dotazy k menu, cenám, alergenům a otevírací době.
- Pomáháš s objednáním salátu nebo limonády k vyzvednutí.
- Komunikuješ česky; když volající přepne do angličtiny, přepneš s ním.

STYL
- Mluv přirozeně a stručně. Krátké věty, žádné odborné fráze.
- Jedna otázka najednou. Nevypisuj celou nabídku, naveď na konkrétní kategorii.
- Cena se vždy uvádí v Kč včetně DPH.

CO NEDĚLAT
- Nevymýšlej si produkty ani ceny, které neznáš — nabídni přepojení na personál.
- Nepřijímej velké skupinové objednávky (nad 10 jídel), nabídni e-mail.
- Neřeš reklamace — přepoj na vedoucího směny.

PŘEPOJENÍ NA ČLOVĚKA
- Když si nejsi jistý, zeptej se: „Mám vás přepojit na personál?“
- Reklamace, faktury a firemní zakázky vždy přepoj.`;

const GENERIC_SYSTEM_PROMPT = `Jsi telefonní asistent. Představ se jménem firmy, odpovídej stručně a zdvořile, při nejasnostech nabídni přepojení na člověka.

(Detailní prompt se doplňuje podle konkrétního klienta.)`;

export const OPS_ASSISTANTS: Assistant[] = [
  {
    id: 'ugo-stromovka',
    clientId: 'ugo',
    name: 'UGO Salaterie – Stromovka',
    description:
      'Telefonní asistent pro pobočku ve Stromovce. Zvedá hovory během špičky i mimo provozní dobu, odpovídá na menu, alergeny a otevírací dobu, přijímá objednávky k vyzvednutí.',
    status: 'active',
    phoneNumber: '+420 555 010 203',
    vapiAssistantId: 'vapi_ugo_stromovka',
    vapiStatus: 'connected',
    vapiDemoSlug: 'ugo-stromovka',
    systemPrompt: UGO_SYSTEM_PROMPT,
    voice: {
      provider: '11labs',
      voice: 'Antonín (český mužský, přirozený)',
      language: 'čeština (cs-CZ)',
      speakingStyle: 'přátelský, nasazený tempem bistra — krátké věty',
      interruptionSensitivity: 'medium',
    },
    behavior: {
      greeting:
        'Dobrý den, tady UGO z UGO Salaterie Stromovka. Jak vám můžu pomoct?',
      fallback:
        'Promiňte, tohle úplně jistě nevím. Nabídnu přepojení na personál, nebo vám mohu pomoci s něčím jiným?',
      humanHandoff:
        'Chápu, to přepojím na vedoucího směny. Chvíli vydržte, prosím.',
      maxConversationLengthSec: 420,
      silenceTimeoutSec: 12,
    },
    createdAt: '2025-06-12T10:00:00+02:00',
    lastActivityAt: '2025-09-22T18:41:00+02:00',
  },
  {
    id: 'ludmila-recepce',
    clientId: 'textil-ludmila',
    name: 'Ludmila — objednávky',
    description:
      'Asistent pro přijímání objednávek látek a odpovídání na dotazy k dodacím lhůtám.',
    status: 'active',
    phoneNumber: '+420 555 010 204',
    vapiAssistantId: 'vapi_ludmila_recepce',
    vapiStatus: 'connected',
    vapiDemoSlug: 'ludmila',
    systemPrompt: GENERIC_SYSTEM_PROMPT,
    voice: {
      provider: '11labs',
      voice: 'Zdeňka (česká ženská, klidná)',
      language: 'čeština (cs-CZ)',
      speakingStyle: 'klidný, soustředěný',
      interruptionSensitivity: 'medium',
    },
    behavior: {
      greeting: 'Dobrý den, tady Ludmila, Textil Ludmila. Čím vám pomohu?',
      fallback: 'Tohle si musím ověřit. Přepojím vás na kolegu, nebo mám nechat vzkaz?',
      humanHandoff: 'Přepojím vás na objednávkové oddělení.',
      maxConversationLengthSec: 360,
      silenceTimeoutSec: 15,
    },
    createdAt: '2025-08-02T15:00:00+02:00',
    lastActivityAt: '2025-09-21T09:12:00+02:00',
  },
  {
    id: 'noname-booking',
    clientId: 'noname-barbershop',
    name: 'Noname — rezervace',
    description:
      'Rezervační asistent pro pánské holičství. Zvládá termíny, změny a cenové dotazy.',
    status: 'active',
    phoneNumber: '+420 555 010 205',
    vapiAssistantId: 'vapi_noname_booking',
    vapiStatus: 'connected',
    vapiDemoSlug: 'noname-barbershop',
    systemPrompt: GENERIC_SYSTEM_PROMPT,
    voice: {
      provider: '11labs',
      voice: 'Antonín (český mužský, přirozený)',
      language: 'čeština (cs-CZ)',
      speakingStyle: 'uvolněný, hovorový',
      interruptionSensitivity: 'high',
    },
    behavior: {
      greeting: 'Noname Barbershop, dobrý den. Chcete rezervovat termín?',
      fallback: 'To nevím napaměti. Můžu vás přepojit do salonu, nebo si mám zapsat vzkaz?',
      humanHandoff: 'Dobře, přepojím vás přímo do salonu.',
      maxConversationLengthSec: 300,
      silenceTimeoutSec: 10,
    },
    createdAt: '2025-08-18T10:30:00+02:00',
    lastActivityAt: '2025-09-20T16:55:00+02:00',
  },
  {
    id: 'paws-frontdesk',
    clientId: 'paws-and-care',
    name: 'Paws & Care — recepce',
    description:
      'Připravovaný asistent pro veterinární kliniku. Zatím v konfiguraci, bez telefonního čísla.',
    status: 'draft',
    phoneNumber: null,
    vapiAssistantId: null,
    vapiStatus: 'not_connected',
    systemPrompt: GENERIC_SYSTEM_PROMPT,
    voice: {
      provider: '11labs',
      voice: 'Zdeňka (česká ženská, klidná)',
      language: 'čeština (cs-CZ)',
      speakingStyle: 'klidný, uklidňující',
      interruptionSensitivity: 'low',
    },
    behavior: {
      greeting: 'Veterinární klinika Paws & Care, dobrý den.',
      fallback: 'Tohle přenechám veterináři. Přepojím vás.',
      humanHandoff: 'Přepojím vás na ordinaci.',
      maxConversationLengthSec: 300,
      silenceTimeoutSec: 15,
    },
    createdAt: '2025-09-05T12:00:00+02:00',
    lastActivityAt: null,
  },
];

/* ------------------------------------------------------------------ */
/* Znalostní báze — UGO plně rozpracovaná                              */
/* ------------------------------------------------------------------ */

const UGO_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: 'ugo-kb-01',
    clientId: 'ugo',
    assistantId: 'ugo-stromovka',
    title: 'Poloha a dostupnost',
    category: 'locations',
    question: 'Kde přesně se nacházíte?',
    content:
      'Salaterie stojí ve Stromovce v Praze 7, na hlavní cestě od vstupu od Vltavské. Nejbližší zastávka tramvaje je Kramářova vila (linka 1, 12, 15, 25), odtud je to pěšky asi 5 minut parkem. Přístup pro vozíky a kočárky je bezbariérový z hlavní cesty.',
    source: 'Manuálně upraveno adminem',
    updatedAt: '2025-09-08T11:00:00+02:00',
  },
  {
    id: 'ugo-kb-02',
    clientId: 'ugo',
    assistantId: 'ugo-stromovka',
    title: 'Otevírací doba',
    category: 'hours',
    question: 'Jakou máte otevírací dobu?',
    content:
      'Pondělí–pátek 9:00–19:00, sobota–neděle 10:00–19:00. V zimním období (listopad–únor) zkráceno na 10:00–18:00. Během školních prázdnin platí letní režim i ve všední dny.',
    source: 'Import z webu ugosalaterie.cz',
    updatedAt: '2025-09-01T09:30:00+02:00',
  },
  {
    id: 'ugo-kb-03',
    clientId: 'ugo',
    assistantId: 'ugo-stromovka',
    title: 'Saláty — nabídka a ceny',
    category: 'products',
    question: 'Jaké saláty máte a kolik stojí?',
    content:
      'Základní nabídka: Caesar (195 Kč), Řecký (185 Kč), Quinoa s pečenou zeleninou (205 Kč), UGO bowl s kuřecím masem (215 Kč), Veggie mix (175 Kč). Všechny saláty vycházejí z vlastní zeleninové základny připravované denně. K salátu za 45 Kč přidáme bagetu nebo limonádu.',
    source: 'Jídelní lístek 2025 (PDF)',
    updatedAt: '2025-09-10T14:20:00+02:00',
  },
  {
    id: 'ugo-kb-04',
    clientId: 'ugo',
    assistantId: 'ugo-stromovka',
    title: 'Alergeny',
    category: 'policies',
    question: 'Co když mám alergii na ořechy / lepek?',
    content:
      'Každý salát má vyčíslené alergeny 1–14 dle vyhlášky. Caesar obsahuje lepek (bageta, krutony) a mléčné výrobky (parmezán). Quinoa bowl je bezlepkový; ořechy se používají jen v mandlovém mléce do kávy (alergen 8). Volné alergeny sdělí asistent u konkrétní položky; při vážné alergii doporučí ověření u personálu.',
    source: 'Alergenová tabulka od provozovatele',
    updatedAt: '2025-08-25T16:00:00+02:00',
  },
  {
    id: 'ugo-kb-05',
    clientId: 'ugo',
    assistantId: 'ugo-stromovka',
    title: 'UGO asistent',
    category: 'custom',
    question: 'Kdo je UGO?',
    content:
      'UGO je jméno hlasového asistenta UGO Salaterie — převzal telefonní linku Stromovka. Asistent se představuje právě jako UGO, ať je konzistentní s názvem značky.',
    source: 'Brief od provozovatele',
    updatedAt: '2025-06-14T10:00:00+02:00',
  },
  {
    id: 'ugo-kb-06',
    clientId: 'ugo',
    assistantId: 'ugo-stromovka',
    title: 'Objednávky k vyzvednutí',
    category: 'business',
    question: 'Můžu si salát objednat předem?',
    content:
      'Objednávka k vyzvednutí se přijímá telefonicky nejdéle 30 minut před vyzvednutím. Asistent zapisuje jméno, počet kusů a čas vyzvednutí; potvrzení probíhá SMS. Velké objednávky nad 10 jídel směřuje asistent na e-mail stromovka@ugosalaterie.cz.',
    source: 'Manuálně upraveno adminem',
    updatedAt: '2025-09-12T08:45:00+02:00',
  },
  {
    id: 'ugo-kb-07',
    clientId: 'ugo',
    assistantId: 'ugo-stromovka',
    title: 'Limonády a nápoje',
    category: 'products',
    question: 'Jaké limonády prodáváte?',
    content:
      'Vlastní limonády na točce: citron–máta, malina–bazalka, okurka–zázvor (45 Kč / 0,3 l). Láhve s sebou 0,75 l za 95 Kč. K dispozici je také káva z pražírny Bella (mandlové mléko za příplatek — obsahuje ořechy, alergen 8).',
    source: 'Jídelní lístek 2025 (PDF)',
    updatedAt: '2025-09-10T14:22:00+02:00',
  },
  {
    id: 'ugo-kb-08',
    clientId: 'ugo',
    assistantId: 'ugo-stromovka',
    title: 'Platba a jízdenky',
    category: 'faq',
    question: 'Jak můžete platit?',
    content:
      'Platba kartou i hotově. Parkovací lístky Stromovky salaterie neprodává — asistent na to volajícího upozorní. Firemní objednávky se účtují na fakturu po domluvě s vedoucím směny.',
    source: 'FAQ od provozovatele',
    updatedAt: '2025-07-02T13:00:00+02:00',
  },
  {
    id: 'ugo-kb-09',
    clientId: 'ugo',
    assistantId: 'ugo-stromovka',
    title: 'Sezónní provoz a zimní režim',
    category: 'custom',
    question: 'Jste otevření i v zimě?',
    content:
      'Stromovka má prodejní okénko otevřené celý rok; v zimě se zkracuje provozní doba (viz záznam Otevírací doba). Sezónní zkrácení platí automaticky od 1. listopadu do konce února — asistent podle data sám použije správnou dobu.',
    source: 'Manuálně upraveno adminem',
    updatedAt: '2025-08-30T10:10:00+02:00',
  },
  {
    id: 'tl-kb-01',
    clientId: 'textil-ludmila',
    assistantId: 'ludmila-recepce',
    title: 'Dodací lhůty',
    category: 'business',
    question: 'Jak dlouho trvá dodání látek?',
    content: 'Skladové látky expedujeme do 3 pracovních dnů, šití na míru 2–3 týdny.',
    source: 'Obchodní podmínky',
    updatedAt: '2025-08-10T09:00:00+02:00',
  },
  {
    id: 'nb-kb-01',
    clientId: 'noname-barbershop',
    assistantId: 'noname-booking',
    title: 'Ceník střihů',
    category: 'products',
    question: 'Kolik stojí pánský střih?',
    content: 'Pánský střih 450 Kč, střih + úprava vousů 650 Kč, komplet (střih + vousy + péče o pleť) 790 Kč.',
    source: 'Ceník salonu',
    updatedAt: '2025-08-20T12:00:00+02:00',
  },
];

/* ------------------------------------------------------------------ */
/* Konverzace — reálně vypadající transkripty                          */
/* ------------------------------------------------------------------ */

const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-ugo-0901',
    assistantId: 'ugo-stromovka',
    clientId: 'ugo',
    callerNumber: '+420 77* *** 412',
    startedAt: '2025-09-22T18:41:00+02:00',
    durationSec: 132,
    status: 'resolved',
    outcome: 'reservation_created',
    summary:
      'Volající objednal dva Caesary a limonádu citron–máta k vyzvednutí v 19:10. Asistent potvrdil jméno a poslal SMS souhrn.',
    detectedIntent: 'objednávka k vyzvednutí',
    transcript: [
      { id: 'm1', role: 'system', text: 'Příchozí hovor na linku Stromovka', atSec: 0 },
      {
        id: 'm2',
        role: 'assistant',
        text: 'Dobrý den, tady UGO z UGO Salaterie Stromovka. Jak vám můžu pomoct?',
        atSec: 3,
      },
      {
        id: 'm3',
        role: 'caller',
        text: 'Dobrý den, máte ještě otevřený? Chci si objednat dva saláty na večer.',
        atSec: 9,
      },
      {
        id: 'm4',
        role: 'assistant',
        text: 'Otevřeno máme do devatenácti, stihneme to. Co byste si dal?',
        atSec: 14,
      },
      { id: 'm5', role: 'caller', text: 'Dva Caesary a jednu limonádu citron s mátou.', atSec: 21 },
      {
        id: 'm6',
        role: 'assistant',
        text: 'Dva Caesar saláty a limonádu citron–máta, to vychází na 435 korun. Na jaké jméno objednávku zapisuji?',
        atSec: 26,
      },
      { id: 'm7', role: 'caller', text: 'Petr Novák.', atSec: 38 },
      {
        id: 'm8',
        role: 'assistant',
        text: 'Děkuji, Petro. Objednávku na 19:10 potvrzuji SMSkou na tohle číslo. Dělám něco dalšího?',
        atSec: 42,
      },
      { id: 'm9', role: 'caller', text: 'Ne, to je všechno. Díky!', atSec: 55 },
      {
        id: 'm10',
        role: 'assistant',
        text: 'Super, těšíme se. Přeji hezký večer!',
        atSec: 58,
      },
      { id: 'm11', role: 'system', text: 'Hovor ukončen volajícím · SMS potvrzení odesláno', atSec: 132 },
    ],
    metadata: {
      direction: 'inbound',
      endReason: 'caller_hangup',
      sentiment: 'positive',
      costUsd: 0.21,
      latencyMs: 780,
    },
  },
  {
    id: 'conv-ugo-0902',
    assistantId: 'ugo-stromovka',
    clientId: 'ugo',
    callerNumber: '+420 60* *** 087',
    startedAt: '2025-09-22T12:18:00+02:00',
    durationSec: 96,
    status: 'resolved',
    outcome: 'question_answered',
    summary:
      'Dotaz na bezlepkové možnosti. Asistent vysvětlil alergeny quinoa bowl a nabídl zahrnutí do objednávky.',
    detectedIntent: 'dotaz na alergeny',
    transcript: [
      { id: 'm1', role: 'system', text: 'Příchozí hovor na linku Stromovka', atSec: 0 },
      {
        id: 'm2',
        role: 'assistant',
        text: 'Dobrý den, tady UGO z UGO Salaterie Stromovka. Čím vám můžu pomoct?',
        atSec: 3,
      },
      { id: 'm3', role: 'caller', text: 'Dobrý den, máte něco bez lepku?', atSec: 8 },
      {
        id: 'm4',
        role: 'assistant',
        text: 'Ano — quinoa bowl s pečenou zeleninou je bez lepku, stojí 205 korun. Obsahuje ale mléčné výrobky, to by bylo fajn?',
        atSec: 12,
      },
      { id: 'm5', role: 'caller', text: 'Mléčné mi nevadí. A je to syté?', atSec: 30 },
      {
        id: 'm6',
        role: 'assistant',
        text: 'Quinoa je hodně sytá, k tomu pečená zelenina a dresink. Je to náš druhý nejoblíbenější salát.',
        atSec: 34,
      },
      { id: 'm7', role: 'caller', text: 'Super, tak si ho dám zítra v oběd.', atSec: 52 },
      {
        id: 'm8',
        role: 'assistant',
        text: 'Skvělé, těšíme se zítra! Máte ještě něco?',
        atSec: 56,
      },
      { id: 'm9', role: 'caller', text: 'Ne, díky. Nashledanou.', atSec: 66 },
      { id: 'm10', role: 'assistant', text: 'Nashledanou!', atSec: 68 },
      { id: 'm11', role: 'system', text: 'Hovor ukončen volajícím', atSec: 96 },
    ],
    metadata: {
      direction: 'inbound',
      endReason: 'caller_hangup',
      sentiment: 'positive',
      costUsd: 0.17,
      latencyMs: 810,
    },
  },
  {
    id: 'conv-ugo-0903',
    assistantId: 'ugo-stromovka',
    clientId: 'ugo',
    callerNumber: '+420 73* *** 655',
    startedAt: '2025-09-21T10:05:00+02:00',
    durationSec: 214,
    status: 'escalated',
    outcome: 'human_handoff',
    summary:
      'Firemní objednávka 35 salátů na akci. Asistent správně odmítl zapsat a přepojil na vedoucího směny.',
    detectedIntent: 'firemní zakázka',
    escalationReason: 'objednávka nad limit 10 jídel',
    transcript: [
      { id: 'm1', role: 'system', text: 'Příchozí hovor na linku Stromovka', atSec: 0 },
      {
        id: 'm2',
        role: 'assistant',
        text: 'Dobrý den, tady UGO z UGO Salaterie Stromovka. Jak vám můžu pomoct?',
        atSec: 4,
      },
      {
        id: 'm3',
        role: 'caller',
        text: 'Dobrý den, pořádáme v pátek teambuilding a potřebujeme 35 salátů. Jak to řešíte?',
        atSec: 10,
      },
      {
        id: 'm4',
        role: 'assistant',
        text: 'Takovou velkou zakázku zapisovat nemůžu sám — to řeší náš vedoucí směny, který domluví detaily i fakturu. Přepnu vás, dobře?',
        atSec: 16,
      },
      { id: 'm5', role: 'caller', text: 'Jo, to by bylo ideální.', atSec: 34 },
      {
        id: 'm6',
        role: 'assistant',
        text: 'Přepojím vás tedy na vedoucího, chvíli vydržte.',
        atSec: 38,
      },
      { id: 'm7', role: 'system', text: 'Přepojeno na vedoucího směny (interní č. 2)', atSec: 46 },
      { id: 'm8', role: 'system', text: 'Hovor převzat člověkem', atSec: 71 },
    ],
    metadata: {
      direction: 'inbound',
      endReason: 'transferred',
      sentiment: 'neutral',
      transferredTo: 'Vedoucí směny',
      costUsd: 0.24,
      latencyMs: 860,
    },
  },
  {
    id: 'conv-ugo-0904',
    assistantId: 'ugo-stromovka',
    clientId: 'ugo',
    callerNumber: '+420 91* *** 233',
    startedAt: '2025-09-20T15:47:00+02:00',
    durationSec: 58,
    status: 'unresolved',
    outcome: 'no_response',
    summary:
      'Volající se ptal na sezónní zkrácenou dobu v říjnu; asistent potvrdil zkrácení, ale neznal přesné datum zahájení. Vyžaduje ověření u provozovatele.',
    detectedIntent: 'otevírací doba — zimní režim',
    escalationReason: 'chybějící znalost — datum zahájení zimního režimu',
    transcript: [
      { id: 'm1', role: 'system', text: 'Příchozí hovor na linku Stromovka', atSec: 0 },
      {
        id: 'm2',
        role: 'assistant',
        text: 'Dobrý den, tady UGO z UGO Salaterie Stromovka. Čím vám můžu pomoct?',
        atSec: 3,
      },
      { id: 'm3', role: 'caller', text: 'Od kdy máte zavedený ten zimní provoz?', atSec: 9 },
      {
        id: 'm4',
        role: 'assistant',
        text: 'Zimní režim máme od listopadu do konce února, otevíráme v něm od deseti do šesti. Přesné datum zahájení pro letošek ale nevím — mám vás přepojit na personál, nebo vám mohu později zavolat zpět?',
        atSec: 13,
      },
      { id: 'm5', role: 'caller', text: 'Ne, nepřepojte, jen jsem se ptal. Díky.', atSec: 38 },
      { id: 'm6', role: 'system', text: 'Hovor ukončen volajícím · poznámka pro admina: doplnit datum', atSec: 58 },
    ],
    metadata: {
      direction: 'inbound',
      endReason: 'caller_hangup',
      sentiment: 'neutral',
      costUsd: 0.12,
      latencyMs: 790,
    },
  },
  {
    id: 'conv-nb-0901',
    assistantId: 'noname-booking',
    clientId: 'noname-barbershop',
    callerNumber: '+420 77* *** 921',
    startedAt: '2025-09-22T17:02:00+02:00',
    durationSec: 87,
    status: 'resolved',
    outcome: 'reservation_created',
    summary: 'Rezervace pánského střihu na čtvrtek 18:00 s pánem Barbershopem.',
    detectedIntent: 'rezervace termínu',
    transcript: [
      { id: 'm1', role: 'system', text: 'Příchozí hovor na linku Noname Barbershop', atSec: 0 },
      {
        id: 'm2',
        role: 'assistant',
        text: 'Noname Barbershop, dobrý den. Chcete rezervovat termín?',
        atSec: 3,
      },
      { id: 'm3', role: 'caller', text: 'Jo, máte něco ve čtvrtek večer?', atSec: 8 },
      {
        id: 'm4',
        role: 'assistant',
        text: 'Ve čtvrtek mám volný termín v šest a v šest čtyřicet. Který vám vyhovuje?',
        atSec: 12,
      },
      { id: 'm5', role: 'caller', text: 'V šest, prosím.', atSec: 26 },
      {
        id: 'm6',
        role: 'assistant',
        text: 'Dobře, čtvrtek v šest na pánský střih za 450 korun. Jak se jmenujete?',
        atSec: 30,
      },
      { id: 'm7', role: 'caller', text: 'Jirka.', atSec: 44 },
      { id: 'm8', role: 'assistant', text: 'Zapsáno, Jirko. Těšíme se!', atSec: 47 },
      { id: 'm9', role: 'system', text: 'Hovor ukončen volajícím · rezervace zapsána do kalendáře', atSec: 87 },
    ],
    metadata: {
      direction: 'inbound',
      endReason: 'caller_hangup',
      sentiment: 'positive',
      costUsd: 0.15,
      latencyMs: 720,
    },
  },
  {
    id: 'conv-tl-0901',
    assistantId: 'ludmila-recepce',
    clientId: 'textil-ludmila',
    callerNumber: '+420 60* *** 118',
    startedAt: '2025-09-21T09:12:00+02:00',
    durationSec: 143,
    status: 'resolved',
    outcome: 'question_answered',
    summary: 'Dotaz na dodací lhůtu šití na míru — asistent sdělil 2–3 týdny.',
    detectedIntent: 'dotaz na dodací lhůtu',
    transcript: [
      { id: 'm1', role: 'system', text: 'Příchozí hovor na linku Textil Ludmila', atSec: 0 },
      {
        id: 'm2',
        role: 'assistant',
        text: 'Dobrý den, tady Ludmila, Textil Ludmila. Čím vám pomohu?',
        atSec: 4,
      },
      { id: 'm3', role: 'caller', text: 'Jak dlouho trvá šití zátěsy na míru?', atSec: 10 },
      {
        id: 'm4',
        role: 'assistant',
        text: 'Šití na míru trvá dvě až tři týdny od potvrzení objednávky. Skladové látky posíláme do tří dnů.',
        atSec: 15,
      },
      { id: 'm5', role: 'caller', text: 'Děkuji, to stačí.', atSec: 48 },
      { id: 'm6', role: 'system', text: 'Hovor ukončen volajícím', atSec: 143 },
    ],
    metadata: {
      direction: 'inbound',
      endReason: 'caller_hangup',
      sentiment: 'neutral',
      costUsd: 0.18,
      latencyMs: 830,
    },
  },
  {
    id: 'conv-ugo-0905',
    assistantId: 'ugo-stromovka',
    clientId: 'ugo',
    callerNumber: 'anonymní',
    startedAt: '2025-09-19T08:58:00+02:00',
    durationSec: 0,
    status: 'missed',
    outcome: 'no_response',
    summary: 'Zmeškaný hovor před otevírací dobou — asistent nebyl aktivní, volání směrováno mimo provozní okno.',
    detectedIntent: 'neznámý',
    transcript: [
      { id: 'm1', role: 'system', text: 'Příchozí hovor mimo provozní okno asistenta', atSec: 0 },
      { id: 'm2', role: 'system', text: 'Hovor nezvednut · upozornění odesláno adminovi', atSec: 30 },
    ],
    metadata: {
      direction: 'inbound',
      endReason: 'no_answer',
      sentiment: 'neutral',
      costUsd: 0,
    },
  },
  {
    id: 'conv-ugo-0906',
    assistantId: 'ugo-stromovka',
    clientId: 'ugo',
    callerNumber: '+420 77* *** 774',
    startedAt: '2025-09-18T13:31:00+02:00',
    durationSec: 178,
    status: 'resolved',
    outcome: 'reservation_changed',
    summary:
      'Změna existující objednávky — volající přidal ke skupinové objednávce dvě limonády a přesunul vyzvednutí na 14:00.',
    detectedIntent: 'změna objednávky',
    transcript: [
      { id: 'm1', role: 'system', text: 'Příchozí hovor na linku Stromovka', atSec: 0 },
      {
        id: 'm2',
        role: 'assistant',
        text: 'Dobrý den, tady UGO z UGO Salaterie Stromovka. Jak vám můžu pomoct?',
        atSec: 3,
      },
      {
        id: 'm3',
        role: 'caller',
        text: 'Dobrý den, mám dnes objednané čtyři saláty na 13:30, chtěl bych přesunout na čtrnáct a přidat dvě limonády.',
        atSec: 10,
      },
      {
        id: 'm4',
        role: 'assistant',
        text: 'Jasně, na jaké jméno je ta objednávka?',
        atSec: 17,
      },
      { id: 'm5', role: 'caller', text: 'Kovář.', atSec: 25 },
      {
        id: 'm6',
        role: 'assistant',
        text: 'Díky, pane Kováři. Čtyři saláty přesunuty na 14:00, přidány dvě limonády — dohromady 1 010 korun. Potvrzení vám jde SMSkou.',
        atSec: 29,
      },
      { id: 'm7', role: 'caller', text: 'Perfektní, díky moc.', atSec: 62 },
      { id: 'm8', role: 'system', text: 'Hovor ukončen volajícím · objednávka upravena', atSec: 178 },
    ],
    metadata: {
      direction: 'inbound',
      endReason: 'caller_hangup',
      sentiment: 'positive',
      costUsd: 0.22,
      latencyMs: 800,
    },
  },
];

/* ------------------------------------------------------------------ */
/* Hovory — časová řada pro analytiku (posledních ~30 dní)             */
/* ------------------------------------------------------------------ */

export interface DailyCallStats {
  date: string;
  calls: number;
  minutes: number;
}

export const CALLS_DAILY: DailyCallStats[] = [
  { date: '2025-08-25', calls: 9, minutes: 14 },
  { date: '2025-08-26', calls: 12, minutes: 19 },
  { date: '2025-08-27', calls: 8, minutes: 11 },
  { date: '2025-08-28', calls: 14, minutes: 22 },
  { date: '2025-08-29', calls: 17, minutes: 26 },
  { date: '2025-08-30', calls: 23, minutes: 38 },
  { date: '2025-08-31', calls: 21, minutes: 33 },
  { date: '2025-09-01', calls: 11, minutes: 17 },
  { date: '2025-09-02', calls: 13, minutes: 20 },
  { date: '2025-09-03', calls: 10, minutes: 15 },
  { date: '2025-09-04', calls: 15, minutes: 24 },
  { date: '2025-09-05', calls: 18, minutes: 28 },
  { date: '2025-09-06', calls: 26, minutes: 41 },
  { date: '2025-09-07', calls: 24, minutes: 37 },
  { date: '2025-09-08', calls: 12, minutes: 18 },
  { date: '2025-09-09', calls: 14, minutes: 21 },
  { date: '2025-09-10', calls: 16, minutes: 25 },
  { date: '2025-09-11', calls: 11, minutes: 16 },
  { date: '2025-09-12', calls: 19, minutes: 30 },
  { date: '2025-09-13', calls: 28, minutes: 45 },
  { date: '2025-09-14', calls: 25, minutes: 40 },
  { date: '2025-09-15', calls: 13, minutes: 20 },
  { date: '2025-09-16', calls: 15, minutes: 23 },
  { date: '2025-09-17', calls: 17, minutes: 27 },
  { date: '2025-09-18', calls: 14, minutes: 21 },
  { date: '2025-09-19', calls: 20, minutes: 31 },
  { date: '2025-09-20', calls: 29, minutes: 46 },
  { date: '2025-09-21', calls: 27, minutes: 42 },
  { date: '2025-09-22', calls: 18, minutes: 27 },
];

/* Výsledky hovorů za posledních 30 dní — pro prstencový graf a tabulku */
export const OUTCOME_BREAKDOWN: Array<{
  outcome: CallOutcome;
  count: number;
}> = [
  { outcome: 'question_answered', count: 186 },
  { outcome: 'reservation_created', count: 74 },
  { outcome: 'reservation_changed', count: 21 },
  { outcome: 'info_only', count: 63 },
  { outcome: 'human_handoff', count: 34 },
  { outcome: 'no_response', count: 17 },
  { outcome: 'failed', count: 5 },
];

/* ------------------------------------------------------------------ */
/* Integrace                                                           */
/* ------------------------------------------------------------------ */

export const OPS_INTEGRATIONS: Integration[] = [
  {
    id: 'int-ugo-vapi',
    assistantId: 'ugo-stromovka',
    kind: 'vapi',
    name: 'Vapi',
    detail: 'Hlasové hovory — asistent vapi_ugo_stromovka',
    status: 'connected',
    configKeys: ['VAPI_ASSISTANT_ID_UGO_STROMOVKA', 'VAPI_PHONE_NUMBER_ID'],
  },
  {
    id: 'int-ugo-webhook',
    assistantId: 'ugo-stromovka',
    kind: 'webhook',
    name: 'Webhook — end-of-call',
    detail: 'POST /api/webhooks/vapi · HMAC podpis ověřován',
    status: 'connected',
    configKeys: ['VAPI_SERVER_SECRET'],
  },
  {
    id: 'int-ugo-email',
    assistantId: 'ugo-stromovka',
    kind: 'email',
    name: 'E-mail — souhrny hovorů',
    detail: 'Denní shrnutí hovorů na stromovka@ugosalaterie.cz',
    status: 'connected',
    configKeys: ['SMTP_HOST', 'SMTP_FROM'],
  },
  {
    id: 'int-ugo-calendar',
    assistantId: 'ugo-stromovka',
    kind: 'calendar',
    name: 'Kalendář',
    detail: 'Pro salaterii není kalendář potřeba — objednávky k vyzvednutí',
    status: 'not_configured',
    configKeys: [],
  },
  {
    id: 'int-ugo-crm',
    assistantId: 'ugo-stromovka',
    kind: 'crm',
    name: 'CRM',
    detail: 'Není připojeno — objednávky chodí jen SMS potvrzením',
    status: 'not_configured',
    configKeys: [],
  },
  {
    id: 'int-nb-vapi',
    assistantId: 'noname-booking',
    kind: 'vapi',
    name: 'Vapi',
    detail: 'Hlasové hovory — asistent vapi_noname_booking',
    status: 'connected',
    configKeys: ['VAPI_ASSISTANT_ID_NONAME_BARBERSHOP'],
  },
  {
    id: 'int-nb-calendar',
    assistantId: 'noname-booking',
    kind: 'calendar',
    name: 'Google Calendar',
    detail: 'Rezervace se zapisují do salonního kalendáře',
    status: 'connected',
    configKeys: ['GOOGLE_CALENDAR_ID', 'GOOGLE_SERVICE_ACCOUNT'],
  },
  {
    id: 'int-tl-vapi',
    assistantId: 'ludmila-recepce',
    kind: 'vapi',
    name: 'Vapi',
    detail: 'Hlasové hovory — asistent vapi_ludmila_recepce',
    status: 'connected',
    configKeys: ['VAPI_ASSISTANT_ID_LUDMILA'],
  },
  {
    id: 'int-tl-webhook',
    assistantId: 'ludmila-recepce',
    kind: 'webhook',
    name: 'Webhook — end-of-call',
    detail: 'POST /api/webhooks/vapi · HMAC podpis ověřován',
    status: 'connected',
    configKeys: ['VAPI_SERVER_SECRET'],
  },
  {
    id: 'int-paws-vapi',
    assistantId: 'paws-frontdesk',
    kind: 'vapi',
    name: 'Vapi',
    detail: 'Čeká na vytvoření asistenta ve Vapi',
    status: 'not_configured',
    configKeys: [],
  },
];

/* ------------------------------------------------------------------ */
/* Používání — měsíční agregáty                                        */
/* ------------------------------------------------------------------ */

export const OPS_USAGE: UsageRecord[] = [
  {
    id: 'usage-ugo-09',
    clientId: 'ugo',
    periodStart: '2025-09-01',
    periodEnd: '2025-09-30',
    calls: 214,
    minutes: 336,
    includedMinutes: 300,
  },
  {
    id: 'usage-ugo-08',
    clientId: 'ugo',
    periodStart: '2025-08-01',
    periodEnd: '2025-08-31',
    calls: 236,
    minutes: 351,
    includedMinutes: 300,
  },
  {
    id: 'usage-tl-09',
    clientId: 'textil-ludmila',
    periodStart: '2025-09-01',
    periodEnd: '2025-09-30',
    calls: 61,
    minutes: 88,
    includedMinutes: 300,
  },
  {
    id: 'usage-nb-09',
    clientId: 'noname-barbershop',
    periodStart: '2025-09-01',
    periodEnd: '2025-09-30',
    calls: 138,
    minutes: 174,
    includedMinutes: 300,
  },
];

/* ------------------------------------------------------------------ */
/* Odvozené helpery — v produkci dotazy do DB, zde filtrace nad daty   */
/* ------------------------------------------------------------------ */

export function getClientById(id: string): ClientOps | undefined {
  return OPS_CLIENTS.find((c) => c.id === id);
}

export function getAssistantById(id: string): Assistant | undefined {
  return OPS_ASSISTANTS.find((a) => a.id === id);
}

export function getAssistantsForClient(clientId: string): Assistant[] {
  return OPS_ASSISTANTS.filter((a) => a.clientId === clientId);
}

export function getKnowledgeForClient(clientId: string): KnowledgeEntry[] {
  return UGO_KNOWLEDGE.filter((k) => k.clientId === clientId);
}

export function getKnowledgeForAssistant(assistantId: string): KnowledgeEntry[] {
  return UGO_KNOWLEDGE.filter((k) => k.assistantId === assistantId);
}

export function getConversationById(id: string): Conversation | undefined {
  return CONVERSATIONS.find((c) => c.id === id);
}

export function getConversationsForAssistant(assistantId: string): Conversation[] {
  return CONVERSATIONS.filter((c) => c.assistantId === assistantId);
}

export function getIntegrationsForAssistant(assistantId: string): Integration[] {
  return OPS_INTEGRATIONS.filter((i) => i.assistantId === assistantId);
}

export function getUsageForClient(clientId: string): UsageRecord[] {
  return OPS_USAGE.filter((u) => u.clientId === clientId);
}

export function getAllConversations(): Conversation[] {
  return CONVERSATIONS;
}

export function getOpsStats(): OpsStats {
  const active = OPS_ASSISTANTS.filter((a) => a.status === 'active').length;
  const totalCalls = CALLS_DAILY.reduce((s, d) => s + d.calls, 0);
  const totalMinutes = CALLS_DAILY.reduce((s, d) => s + d.minutes, 0);
  const today = CALLS_DAILY[CALLS_DAILY.length - 1]?.calls ?? 0;
  const unresolved = CONVERSATIONS.filter(
    (c) => c.status === 'unresolved' || c.status === 'missed'
  ).length;
  const avgDuration = CONVERSATIONS.filter((c) => c.durationSec > 0);
  const avg =
    avgDuration.length > 0
      ? avgDuration.reduce((s, c) => s + c.durationSec, 0) / avgDuration.length
      : 0;

  return {
    activeAssistants: active,
    totalCalls,
    minutesUsed: totalMinutes,
    avgCallDurationSec: Math.round(avg),
    callsToday: today,
    unresolvedConversations: unresolved,
  };
}

/* Export konverzací i pro ostatní moduly */
export { CONVERSATIONS as OPS_CONVERSATIONS, UGO_KNOWLEDGE as OPS_KNOWLEDGE };
