import type { BadgeTone } from '@/components/admin/ui';
import type { CallOutcome, ConversationStatus, AssistantStatus, VapiStatus } from '@/data/ops';

export const OUTCOME_LABELS: Record<CallOutcome, string> = {
  question_answered: 'Zodpovězeno',
  reservation_created: 'Objednávka vytvořena',
  reservation_changed: 'Objednávka změněna',
  info_only: 'Jen informace',
  human_handoff: 'Předáno člověku',
  no_response: 'Bez odezvy',
  failed: 'Selhalo',
};

export const OUTCOME_TONES: Record<CallOutcome, BadgeTone> = {
  question_answered: 'positive',
  reservation_created: 'positive',
  reservation_changed: 'info',
  info_only: 'neutral',
  human_handoff: 'warning',
  no_response: 'negative',
  failed: 'negative',
};

export const CONVERSATION_STATUS_LABELS: Record<ConversationStatus, string> = {
  resolved: 'Vyřešeno',
  unresolved: 'Nevyřešeno',
  escalated: 'Eskalováno',
  missed: 'Zmeškáno',
};

export const CONVERSATION_TONES: Record<ConversationStatus, BadgeTone> = {
  resolved: 'positive',
  unresolved: 'warning',
  escalated: 'info',
  missed: 'negative',
};

export const ASSISTANT_STATUS_LABELS: Record<AssistantStatus, string> = {
  active: 'Aktivní',
  inactive: 'Vypnutý',
  draft: 'V přípravě',
};

export const ASSISTANT_STATUS_TONES: Record<AssistantStatus, BadgeTone> = {
  active: 'positive',
  inactive: 'neutral',
  draft: 'warning',
};

export const VAPI_STATUS_LABELS: Record<VapiStatus, string> = {
  connected: 'Vapi připojeno',
  not_connected: 'Nepřipojeno',
  error: 'Chyba',
};

export const VAPI_STATUS_TONES: Record<VapiStatus, BadgeTone> = {
  connected: 'positive',
  not_connected: 'neutral',
  error: 'negative',
};

export const KNOWLEDGE_CATEGORY_LABELS: Record<string, string> = {
  faq: 'FAQ',
  business: 'Firemní údaje',
  products: 'Produkty',
  hours: 'Otevírací doba',
  locations: 'Lokality',
  policies: 'Pravidla',
  custom: 'Vlastní',
};

export const INTEGRATION_STATUS_LABELS: Record<string, string> = {
  connected: 'Připojeno',
  not_configured: 'Nenastaveno',
  error: 'Chyba',
};

export const INTEGRATION_STATUS_TONES: Record<string, BadgeTone> = {
  connected: 'positive',
  not_configured: 'neutral',
  error: 'negative',
};

export function outcomeTone(outcome: CallOutcome): BadgeTone {
  return OUTCOME_TONES[outcome] ?? 'neutral';
}

export function outcomeLabel(outcome: CallOutcome): string {
  return OUTCOME_LABELS[outcome] ?? outcome;
}
