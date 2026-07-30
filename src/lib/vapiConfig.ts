/**
 * @deprecated Use `@/config/vapi` instead.
 * All assistant credentials now come from environment variables.
 */
export interface VapiAssistantConfig {
  assistantId: string;
  apiKey: string;
}

export const VAPI_ASSISTANTS: Record<string, VapiAssistantConfig> = {};

export function getVapiConfig(_slug: string): VapiAssistantConfig | undefined {
  return undefined;
}
