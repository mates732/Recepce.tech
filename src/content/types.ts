import type { Locale } from "@/lib/types";

/**
 * Sdílená metadata všech obsahových entit.
 * Git je historie verzí — žádná samostatná revision vrstva.
 */
export type Status = "draft" | "published" | "archived";

export interface ContentMeta {
  id: string;
  status: Status;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  publishedAt?: string; // ISO — nastaví se při prvním publishi
}

/** Bilingvální hodnota — stejný pattern jako dosud, bez i18n frameworku. */
export type Localized<T = string> = Record<Locale, T>;

/* ─────────────────────────── entities ─────────────────────────── */

export interface ProjectContent extends ContentMeta {
  kind: "project";
  name: Localized;
  tagline: Localized;
  badge: Localized;
  poster: string;
  href: string;
  external?: boolean;
  category?: Localized;
  tags?: Localized<string[]>;
  outcome?: Localized;
  liveHref?: string;
}

export interface ProfessionLocal {
  name: string;
  desc: string;
  tags: string[];
  features: { label: string; desc: string }[];
}

export interface ProfessionContent extends ContentMeta {
  kind: "profession";
  colors: { accent: string; glow1: string; glow2: string };
  cs: ProfessionLocal;
  en: ProfessionLocal;
}

/* ─────────────────────────── navigation / site ─────────────────────────── */

export interface NavItem {
  id: string;
  labels: Localized;
  href?: string;
  children?: NavItem[];
}

export interface SiteSettings {
  siteName: string;
  baseUrl: string;
  description: Localized;
  keywords: string[];
  contact: { phone: string; email: string };
  social: {
    youtube: string;
    youtubeChannelId: string;
    github: string;
    instagram: string;
  };
  business: { name: Localized };
}

export interface SiteContent extends ContentMeta {
  kind: "site";
  brand: { root: string; suffix: string };
  settings: SiteSettings;
  navigation: NavItem[];
  footer: {
    tagline: Localized;
    navigationHeading: Localized;
    navLinks: { id: string; labels: Localized; href: string }[];
    connectHeading: Localized;
    madeIn: Localized;
  };
}

/* ─────────────────────────── pages ─────────────────────────── */

export interface ProjectFactContent {
  label: Localized;
  value: Localized;
  href?: string;
  external?: boolean;
}

export type SectionType =
  | "hero"
  | "laboratory"
  | "liveSystems"
  | "systemsAudit"
  | "systems"
  | "caseStudies"
  | "trustProof"
  | "audience"
  | "whatWeBuild"
  | "controlRoom"
  | "experiments"
  | "ecosystem"
  | "process"
  | "youtube"
  | "about"
  | "finalCta";

/**
 * Instance sekce na stránce. Pořadí v poli = pořadí renderu,
 * visible řídí zobrazení, label je admin metadata (override registru).
 */
export interface SectionInstance {
  section: SectionType;
  visible: boolean;
  label?: Localized;
}

export interface HomePageData {
  sections: SectionInstance[];
  hero: {
    title: Localized;
    emphasis: Localized<string[]>;
    subtitle: Localized;
    proof: Localized;
    ctaLabel: Localized;
    ctaHref: string;
    scrollTarget: string;
    altCtaLabel: Localized;
    altCtaHref: string;
    altScrollTarget: string;
  };
  laboratory: {
    title: Localized;
    subtitle: Localized;
    experiments: {
      name: Localized;
      status: string;
      problem: Localized;
      capabilities: Localized<string[]>;
      href: string;
    }[];
  };
  liveSystems: {
    title: Localized;
    subtitle: Localized;
    systems: {
      name: Localized;
      title?: Localized;
      subtitle?: Localized;
      description?: Localized;
      metadata?: Localized<string[]>;
      badge?: string;
      status: string;
      problem: Localized;
      ai: Localized;
      impact: Localized;
      href: string;
    }[];
  };
  systemsAudit: {
    title: Localized;
    subtitle: Localized;
    intro: Localized;
    stepLabel: Localized;
    nextLabel: Localized;
    backLabel: Localized;
    finishLabel: Localized;
    resultTitle: Localized;
    resultSubtitle: Localized;
    resultEmpty: Localized;
    restartLabel: Localized;
    reportHeader: Localized;
    reportSupporting: Localized;
    reportSummary: Localized;
    cardCta: Localized;
    previewTitle: Localized;
    previewItems: Localized<string[]>;
    potentialHigh: Localized;
    potentialMedium: Localized;
    whyLabel: Localized;
    solutionLabel: Localized;
    form: {
      title: Localized;
      subtitle: Localized;
      name: Localized;
      company: Localized;
      email: Localized;
      website: Localized;
      size: Localized;
      challenge: Localized;
      submit: Localized;
      sending: Localized;
      successTitle: Localized;
      successText: Localized;
      error: Localized;
    };
    questions: {
      id: string;
      label: Localized;
      multiple: boolean;
      options: { id: string; label: Localized }[];
    }[];
    areas: {
      id: string;
      name: Localized;
      desc: Localized;
      potential: "High" | "Medium";
      why: Localized;
      solution: Localized;
    }[];
  };
  systems: {
    title: Localized;
    subtitle: Localized;
    statement: Localized;
    stages: { label: Localized; desc: Localized }[];
  };
  caseStudies: {
    title: Localized;
    subtitle: Localized;
    hint: Localized;
    cta: Localized;
    archiveLabel: Localized;
    cases: {
      category: Localized;
      name: Localized;
      description: Localized;
      keyPoints: Localized<string[]>;
      href: string;
      external?: boolean;
      visual?: string;
      visualStyle?: "image" | "wordmark";
    }[];
  };
  trustProof: {
    title: Localized;
    subtitle: Localized;
    systems: {
      name: Localized;
      status: string;
      problem: Localized;
      solution: Localized;
      capabilities: Localized<string[]>;
      impact?: Localized;
    }[];
  };
  audience: {
    title: Localized;
    subtitle: Localized;
    cards: {
      title: Localized;
      items: Localized<string[]>;
    }[];
  };
  whatWeBuild: {
    title: Localized;
    subtitle: Localized;
    cards: { title: Localized; desc: Localized }[];
  };
  controlRoom: {
    title: Localized;
    subtitle: Localized;
    systems: { name: Localized; status: string }[];
    models: Localized<string[]>;
    modules: { label: Localized; desc: Localized }[];
  };
  experiments: {
    title: Localized;
    subtitle: Localized;
    phases: {
      label: Localized;
      title: Localized;
      items: { name: Localized; desc: Localized }[];
    }[];
  };
  ecosystem: {
    title: Localized;
    subtitle: Localized;
    cards: { title: Localized; desc: Localized; href: string }[];
  };
  process: {
    title: Localized;
    subtitle: Localized;
    steps: { title: Localized; desc: Localized }[];
  };
  youtube: { title: Localized; subtitle: Localized; cta: Localized; href: string };
  about: {
    name: string;
    handle: string;
    heading: Localized;
    blocks: { title: Localized; text: Localized }[];
  };
  finalCta: {
    title: Localized;
    emphasis: Localized<string[]>;
    subtitle: Localized;
    cta: Localized;
    altCta: Localized;
  };
}

export interface AboutPageData {
  statement: { title: Localized; subtitle: Localized };
  works: { items: Localized[] };
  personal: { label: Localized; title: Localized; text: Localized };
  principles: { label: Localized; items: Localized[] };
  brand: { label: Localized; title: string; desc: Localized; explore: Localized };
  products: { title: string; desc: Localized; href: string }[];
}

export interface ListingPageData {
  badge: Localized;
  title: Localized;
  subtitle: Localized;
}

export interface DemoItemContent {
  id: string;
  name: string;
  nameCs?: string;
  channels: string[];
  capabilities: string[];
  description: string;
  descriptionCs?: string;
}

export interface DemoPageData extends ListingPageData {
  demos: DemoItemContent[];
}

export interface YoutubePageData {
  title: Localized;
  subtitle: Localized;
  latestLabel: Localized;
  footerText: Localized;
  cta: Localized;
}

export interface VoicePageData {
  facts: ProjectFactContent[];
  badge: Localized;
  crossLink: { label: Localized; href: string };
  heroTitle: Localized[];
  heroDesc: Localized;
  cta: Localized;
  capabilities: string[];
  languages: Localized<string[]>;
  intelligence: {
    label: Localized;
    heading: Localized[];
    callerLabel: Localized;
    phrases: Localized[];
    aiLabel: Localized;
    steps: { icon: string; label: Localized; detail: Localized }[];
  };
}

export interface ChatMessageContent {
  from: "user" | "ai";
  text: Localized;
  wide?: boolean;
}

export interface ChatPageData {
  facts: ProjectFactContent[];
  badge: Localized;
  crossLink: { label: Localized; href: string };
  heroTitle: Localized[];
  heroDesc: Localized;
  cta: Localized;
  channelsLabel: Localized;
  channels: Localized;
  conversation: {
    label: Localized;
    sections: { label: Localized; messages: ChatMessageContent[] }[];
  };
  integrations: { label: Localized; value: string };
  flow: {
    label: Localized;
    heading: Localized;
    sub: Localized;
    messages: { text: string; channel: string }[];
  };
}

export interface ZlatyHrebenPageData {
  badge: Localized;
  heroTitle: string;
  heroDesc: Localized;
  facts: ProjectFactContent[];
  previewUrl: string;
  previewLabel: string;
  timeline: {
    label: Localized;
    steps: { title: Localized; desc: Localized }[];
  };
  completed: { label: Localized; items: Localized<string[]> };
  reflection: { label: Localized; text: Localized };
  final: { title: Localized[]; subtitle: Localized; cta: Localized };
}

export interface CortexChatMessage {
  sender: "a" | "b";
  text: string;
  typingMs?: number;
  delayMs?: number;
}

export interface PoniciPageData {
  badge: Localized;
  heroTitle: Localized[];
  heroDesc: Localized;
  cta: Localized;
  ctaHref: string;
  facts: ProjectFactContent[];
  previewUrl: string;
  previewLabel: string;
  sections: {
    challenge: {
      label: Localized;
      title: Localized;
      text: Localized;
      points: Localized<string[]>;
    };
    strategy: {
      label: Localized;
      title: Localized;
      text: Localized;
      questions: Localized<string[]>;
      pillars: { title: Localized; desc: Localized }[];
      services: Localized<string[]>;
    };
    design: {
      label: Localized;
      title: Localized;
      text: Localized;
      principle: Localized;
      colors: { name: Localized; value: string }[];
      typefaces: { name: Localized; note: Localized }[];
    };
    ux: {
      label: Localized;
      title: Localized;
      question: Localized;
      answers: { title: Localized; desc: Localized }[];
      personas: { title: Localized; desc: Localized; needs: Localized<string[]> }[];
      flow: Localized<string[]>;
    };
    web: {
      label: Localized;
      title: Localized;
      text: Localized;
      liveLabel: Localized;
    };
    tech: {
      label: Localized;
      title: Localized;
      text: Localized;
      items: Localized<string[]>;
    };
    result: {
      label: Localized;
      title: Localized[];
      text: Localized;
      conclusion: Localized;
      cta: Localized;
    };
  };
}

export interface CortexPageData {
  facts: ProjectFactContent[];
  hero: { label: Localized; title: string; tagline: Localized };
  screenshot: { src: string; alt: Localized };
  why: { label: Localized; text: Localized };
  chat: { cs: CortexChatMessage[]; en: CortexChatMessage[] };
  annotations: {
    label: Localized;
    note: Localized;
    appearAt: number;
    top: string;
    left?: string;
    right?: string;
  }[];
  confidence: {
    label: Localized;
    stages: { label: Localized; desc: Localized; range: [number, number] }[];
  };
  quoteSplit: { primary: Localized; secondary: Localized };
  editorial: { title: Localized; text: Localized };
  cinematic: {
    label: Localized;
    steps: { icon: string; label: Localized; sub: Localized }[];
  };
  final: { title: Localized[]; text: Localized; cta: Localized };
}

export type PageSlug =
  | "home"
  | "projekty"
  | "webs"
  | "communication"
  | "about"
  | "contact"
  | "demo"
  | "youtube"
  | "profese"
  | "cortex"
  | "voice"
  | "chat"
  | "zlaty-hreben"
  | "ponici";

export interface PageData {
  home: HomePageData;
  projekty: ListingPageData;
  webs: ListingPageData;
  communication: { badge: Localized };
  about: AboutPageData;
  contact: Record<string, never>;
  demo: DemoPageData;
  youtube: YoutubePageData;
  profese: Record<string, never>;
  cortex: CortexPageData;
  voice: VoicePageData;
  chat: ChatPageData;
  "zlaty-hreben": ZlatyHrebenPageData;
  ponici: PoniciPageData;
}

export interface PageContent<K extends PageSlug = PageSlug> extends ContentMeta {
  kind: "page";
  slug: K;
  seo: { title: Localized; description: Localized };
  data: PageData[K];
}

export type ContentItem =
  | ProjectContent
  | ProfessionContent
  | SiteContent
  | PageContent;

export type ContentKind = ContentItem["kind"];
