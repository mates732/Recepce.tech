import type { VapiDemoConfig, VapiAssistantResponse } from "./types";
import { DEMOS } from "./demos";
import { getAssistantConfig, validateVapiEnv } from "./env";

validateVapiEnv();

export type { VapiDemoConfig, VapiAssistantResponse };
export { DEMOS };

export { getAssistantConfig, validateVapiEnv } from "./env";

export function getDemo(id: string): VapiDemoConfig | undefined {
  return DEMOS.find((d) => d.id === id);
}

export function getEnabledDemos(): VapiDemoConfig[] {
  return DEMOS.filter((d) => d.enabled);
}

/** Mapuje slug (id demo nebo legacy profession slug) na konfiguraci asistenta. */
export function getConfigBySlug(slug: string): VapiAssistantResponse | undefined {
  const demo = getDemo(slug) ?? DEMOS.find((d) => d.slugs?.includes(slug));
  if (!demo) return undefined;
  return getAssistantConfig(demo.industry);
}
