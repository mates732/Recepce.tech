const assistantIds = {
  atombike: process.env.VAPI_ASSISTANT_ID_ATOMBIKE,
  'noname-barbershop': process.env.VAPI_ASSISTANT_ID_NONAME_BARBERSHOP,
  'paws-and-care': process.env.VAPI_ASSISTANT_ID_PAWS_AND_CARE,
} as const;

export type VapiDemoSlug = keyof typeof assistantIds;

export function isVapiDemoSlug(value: unknown): value is VapiDemoSlug {
  return typeof value === 'string' && value in assistantIds;
}

export function getVapiConfig(slug: VapiDemoSlug) {
  return {
    apiKey: process.env.VAPI_API_KEY,
    assistantId: assistantIds[slug],
  };
}

export function isVapiConfigured(slug: VapiDemoSlug) {
  const config = getVapiConfig(slug);
  return Boolean(config.apiKey && config.assistantId);
}
