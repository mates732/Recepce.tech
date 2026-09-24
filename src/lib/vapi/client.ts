import { env } from '@/lib/env';
import crypto from 'crypto';

const VAPI_BASE_URL = 'https://api.vapi.ai';

interface VapiAssistant {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface VapiCall {
  id: string;
  assistantId: string;
  phoneNumberId?: string;
  customer?: {
    number: string;
    name?: string;
  };
  startedAt: string;
  endedAt?: string;
  endedReason?: string;
  cost?: number;
  costBreakdown?: {
    transport?: number;
    stt?: number;
    llm?: number;
    tts?: number;
    vapi?: number;
  };
  duration?: number;
  billableDuration?: number;
  status: string;
  metadata?: Record<string, unknown>;
  recordingUrl?: string;
  transcript?: string;
}

interface VapiWebhookPayload {
  message: {
    type: string;
    call?: VapiCall;
    timestamp: string;
  };
}

async function vapiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${VAPI_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${env.VAPI_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text().catch(() => '');
    throw new Error(`Vapi API error (${response.status}): ${error}`);
  }

  return response.json();
}

export async function getVapiAssistant(assistantId: string): Promise<VapiAssistant> {
  return vapiFetch<VapiAssistant>(`/assistant/${assistantId}`);
}

export async function getVapiCall(callId: string): Promise<VapiCall> {
  return vapiFetch<VapiCall>(`/call/${callId}`);
}

export async function listVapiCalls(params?: {
  assistantId?: string;
  limit?: number;
  offset?: number;
  startedAtGt?: string;
  startedAtLt?: string;
}): Promise<VapiCall[]> {
  const searchParams = new URLSearchParams();
  if (params?.assistantId) searchParams.set('assistantId', params.assistantId);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  if (params?.startedAtGt) searchParams.set('startedAtGt', params.startedAtGt);
  if (params?.startedAtLt) searchParams.set('startedAtLt', params.startedAtLt);

  return vapiFetch<VapiCall[]>(`/call?${searchParams.toString()}`);
}

export function verifyVapiWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export function parseVapiWebhookPayload(payload: unknown): VapiWebhookPayload | null {
  if (!payload || typeof payload !== 'object') return null;
  const obj = payload as Record<string, unknown>;
  if (typeof obj.message !== 'object' || !obj.message) return null;
  const message = obj.message as Record<string, unknown>;
  if (typeof message.type !== 'string') return null;
  return payload as VapiWebhookPayload;
}

export function calculateCallBillableMinutes(call: VapiCall): number {
  if (call.billableDuration && call.billableDuration > 0) {
    return Math.ceil(call.billableDuration / 60);
  }
  if (call.duration && call.duration > 0) {
    return Math.ceil(call.duration / 60);
  }
  if (call.startedAt && call.endedAt) {
    const start = new Date(call.startedAt).getTime();
    const end = new Date(call.endedAt).getTime();
    const durationSeconds = Math.floor((end - start) / 1000);
    return Math.ceil(durationSeconds / 60);
  }
  return 0;
}

export function getVapiCallCost(call: VapiCall): number {
  if (call.cost && call.cost > 0) return Math.round(call.cost * 100);
  if (call.costBreakdown) {
    const total = Object.values(call.costBreakdown).reduce((sum, v) => sum + (v || 0), 0);
    return Math.round(total * 100);
  }
  return 0;
}