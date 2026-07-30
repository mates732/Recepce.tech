import type { VapiDemoConfig, VapiAssistantResponse } from "./types";
import { DEMOS } from "./demos";
import { validateVapiEnv } from "./env";

validateVapiEnv();

export type { VapiDemoConfig, VapiAssistantResponse };
export { DEMOS };

export {
  getAssistantConfig,
  getAssistantId,
  getAssistantApiKey,
  getPublicKey,
  getPrivateKey,
  getAllAssistantEnvNames,
  validateVapiEnv,
} from "./env";

export function getDemo(id: string): VapiDemoConfig | undefined {
  return DEMOS.find((d) => d.id === id);
}

export function getEnabledDemos(): VapiDemoConfig[] {
  return DEMOS.filter((d) => d.enabled);
}
