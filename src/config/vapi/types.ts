export interface VapiDemoConfig {
  id: string;
  assistantId: string;
  displayName: string;
  industry: string;
  locale: string;
  defaultVoice: string;
  firstMessage?: string;
  enabled: boolean;
  /** Legacy profession slugs for backward compatibility */
  slugs?: string[];
}

export interface VapiAssistantResponse {
  assistantId: string;
  apiKey: string;
}
