import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";

export type MockupType = "dashboard" | "conversation" | "browser";

export interface ShowcaseProject {
  slug: string;
  title: (locale: Locale) => string;
  description: (locale: Locale) => string;
  features: (locale: Locale) => string;
  url: (locale: Locale) => string;
  previewLabel: string;
  accent: string;
  titleScale: number;
  mockupType: MockupType;
}

export const showcaseProjects: ShowcaseProject[] = [
  {
    slug: "cortex",
    title: (l) => t(l, "scene.cortex.title"),
    description: (l) => t(l, "scene.cortex.desc"),
    features: (l) => t(l, "scene.cortex.features"),
    url: (l) => t(l, "scene.cortex.url"),
    previewLabel: "Cortex",
    accent: "rgba(120, 140, 255, 0.08)",
    titleScale: 1,
    mockupType: "dashboard",
  },
  {
    slug: "recepce",
    title: (l) => t(l, "scene.recepce.title"),
    description: (l) => t(l, "scene.recepce.desc"),
    features: (l) => t(l, "scene.recepce.features"),
    url: (l) => t(l, "scene.recepce.url"),
    previewLabel: "Recepce.tech",
    accent: "rgba(100, 200, 180, 0.06)",
    titleScale: 1,
    mockupType: "conversation",
  },
  {
    slug: "zlaty-hreben",
    title: (l) => t(l, "scene.zlaty.title"),
    description: (l) => t(l, "scene.zlaty.desc"),
    features: (l) => t(l, "scene.zlaty.brand") + " · " + t(l, "scene.zlaty.web") + " · " + t(l, "scene.zlaty.dev"),
    url: (l) => t(l, "scene.zlaty.url"),
    previewLabel: "Zlatý Hřeben",
    accent: "rgba(200, 170, 100, 0.06)",
    titleScale: 1.04,
    mockupType: "browser",
  },
  {
    slug: "ponici",
    title: (l) => t(l, "scene.ponici.title"),
    description: (l) => t(l, "scene.ponici.desc"),
    features: (l) => t(l, "scene.ponici.features"),
    url: (l) => t(l, "scene.ponici.url"),
    previewLabel: "Poníci.cz",
    accent: "rgba(180, 140, 100, 0.06)",
    titleScale: 0.96,
    mockupType: "browser",
  },
];
