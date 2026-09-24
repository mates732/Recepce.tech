/**
 * Konfigurace Vapi demo asistentů.
 *
 * Soukromý API klíč (VAPI_API_KEY) sem záměrně nepatří — ten používá jen
 * serverová komunikace s Vapi API (src/lib/vapi/client.ts přes src/lib/env.ts).
 * Do prohlížeče smí jít výhradně veřejný klíč + ID asistenta.
 */

const assistantIds = {
  atombike: 'VAPI_ASSISTANT_ID_ATOMBIKE',
  'therapy-point': 'VAPI_ASSISTANT_ID_THERAPY_POINT',
  'noname-barbershop': 'VAPI_ASSISTANT_ID_NONAME_BARBERSHOP',
  'paws-and-care': 'VAPI_ASSISTANT_ID_PAWS_AND_CARE',
  ludmila: 'VAPI_ASSISTANT_ID_LUDMILA',
  'ugo-stromovka': 'VAPI_ASSISTANT_ID_UGO_STROMOVKA',
} as const;

export type VapiDemoSlug = keyof typeof assistantIds;

export function isVapiDemoSlug(value: unknown): value is VapiDemoSlug {
  return typeof value === 'string' && value in assistantIds;
}

/** Název env proměnné s per-asistent veřejným klíčem, např. PUBLIC_VAPI_PUBLIC_KEY_LUDMILA. */
function publicKeyEnvName(slug: VapiDemoSlug): string {
  return `PUBLIC_VAPI_PUBLIC_KEY_${slug.toUpperCase().replace(/-/g, '_')}`;
}

export function getVapiConfig(slug: VapiDemoSlug) {
  return {
    assistantId: process.env[assistantIds[slug]],
    // Každý asistent může žít ve vlastní Vapi organizaci — v takovém případě má
    // svůj veřejný klíč (PUBLIC_VAPI_PUBLIC_KEY_<SLUG>), jinak se použije
    // sdílený klíč recepce.tech.
    browserPublicKey:
      process.env[publicKeyEnvName(slug)] ?? process.env.PUBLIC_VAPI_PUBLIC_KEY,
  };
}

/** Demo je připravené na reálný hovor z prohlížeče: stačí veřejný klíč + ID. */
export function isVapiConfigured(slug: VapiDemoSlug) {
  const config = getVapiConfig(slug);
  return Boolean(config.assistantId && config.browserPublicKey);
}
