const assistantIds = {
  atombike: process.env.VAPI_ASSISTANT_ID_ATOMBIKE,
  'therapy-point': process.env.VAPI_ASSISTANT_ID_THERAPY_POINT,
  'noname-barbershop': process.env.VAPI_ASSISTANT_ID_NONAME_BARBERSHOP,
  'paws-and-care': process.env.VAPI_ASSISTANT_ID_PAWS_AND_CARE,
  ludmila: process.env.VAPI_ASSISTANT_ID_LUDMILA,
} as const;

export type VapiDemoSlug = keyof typeof assistantIds;

export function isVapiDemoSlug(value: unknown): value is VapiDemoSlug {
  return typeof value === 'string' && value in assistantIds;
}

export function getVapiConfig(slug: VapiDemoSlug) {
  return {
    apiKey: process.env.VAPI_API_KEY,
    assistantId: assistantIds[slug],
    // Každý asistent může žít ve vlastní Vapi organizaci — v takovém případě
    // má svůj veřejný klíč (PUBLIC_VAPI_PUBLIC_KEY_<SLUG>), jinak se použije
    // sdílený klíč recepce.tech.
    browserPublicKey:
      slug === 'ludmila'
        ? process.env.PUBLIC_VAPI_PUBLIC_KEY_LUDMILA
        : undefined,
  };
}

export function isVapiConfigured(slug: VapiDemoSlug) {
  const config = getVapiConfig(slug);
  return Boolean(config.apiKey && config.assistantId);
}
