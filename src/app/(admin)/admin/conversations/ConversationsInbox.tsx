'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/shared/Icon';
import { Badge, EmptyState, SearchInput, Avatar } from '@/components/admin/ui';
import type { Conversation, ConversationStatus, TranscriptMessage } from '@/data/ops';
import { formatDuration, formatRelativeCz, formatShortDateTimeCz } from '@/lib/format';
import {
  CONVERSATION_STATUS_LABELS,
  CONVERSATION_TONES,
  outcomeLabel,
  outcomeTone,
} from '@/lib/opsLabels';

const STATUS_FILTERS: Array<{ id: ConversationStatus | 'all'; label: string }> = [
  { id: 'all', label: 'Vše' },
  { id: 'unresolved', label: 'Nevyřešené' },
  { id: 'escalated', label: 'Eskalované' },
  { id: 'resolved', label: 'Vyřešené' },
  { id: 'missed', label: 'Zmeškané' },
];

const ROLE_LABELS: Record<TranscriptMessage['role'], string> = {
  assistant: 'Asistent',
  caller: 'Volající',
  system: 'Systém',
};

export default function ConversationsInbox({
  conversations,
  assistants,
  getClientName,
}: {
  conversations: Conversation[];
  assistants: Array<{ id: string; name: string }>;
  getClientName: (id: string) => string;
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ConversationStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id ?? null);

  const assistantName = (id: string) => assistants.find((a) => a.id === id)?.name ?? '—';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = conversations.filter((c) => {
      if (status !== 'all' && c.status !== status) return false;
      if (!q) return true;
      const hay = `${c.callerNumber} ${c.summary} ${c.detectedIntent} ${assistantName(c.assistantId)}`.toLowerCase();
      return hay.includes(q);
    });
    return list.sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }, [conversations, query, status, assistants]);

  const selected = conversations.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
      {/* Seznam */}
      <div className="space-y-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Hledat podle čísla, asistenta, souhrnu…"
        />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtr statusu">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatus(f.id)}
              aria-pressed={status === f.id}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                status === f.id
                  ? 'border-accent bg-accent text-accent-bright'
                  : 'border-border bg-surface text-muted hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted">{filtered.length} konverzací</p>

        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {filtered.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-muted">Žádné konverzace.</li>
          ) : (
            filtered.map((conv) => {
              const isSelected = selected?.id === conv.id;
              return (
                <li key={conv.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(conv.id)}
                    aria-current={isSelected ? 'true' : undefined}
                    className={`w-full px-4 py-3.5 text-left transition-colors ${
                      isSelected ? 'bg-surface-muted' : 'hover:bg-surface-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium text-ink">
                        {conv.callerNumber}
                      </span>
                      <span className="shrink-0 text-xs text-muted">
                        {formatRelativeCz(conv.startedAt)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted">
                      {assistantName(conv.assistantId)} · {getClientName(conv.clientId)}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-muted">
                      {conv.summary}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge tone={CONVERSATION_TONES[conv.status]}>
                        {CONVERSATION_STATUS_LABELS[conv.status]}
                      </Badge>
                      <span className="text-xs tabular-nums text-muted">
                        {formatDuration(conv.durationSec)}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Detail */}
      {selected ? (
        <ConversationDetail
          key={selected.id}
          conversation={selected}
          assistantName={assistantName(selected.assistantId)}
          clientName={getClientName(selected.clientId)}
        />
      ) : (
        <EmptyState
          icon={<Icon name="inbox" className="h-10 w-10" />}
          title="Vyberte konverzaci"
          description="Klikněte na konverzaci v seznamu a zobrazí se detail hovoru."
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail konverzace                                                   */
/* ------------------------------------------------------------------ */

function ConversationDetail({
  conversation,
  assistantName,
  clientName,
}: {
  conversation: Conversation;
  assistantName: string;
  clientName: string;
}) {
  const { metadata } = conversation;

  return (
    <div className="space-y-5">
      {/* Hlavička */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-ink">
              <Icon name="phone" className="h-4 w-4 text-muted" />
              {conversation.callerNumber}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {assistantName} · {clientName} ·{' '}
              {formatShortDateTimeCz(conversation.startedAt)} ·{' '}
              {formatDuration(conversation.durationSec)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={outcomeTone(conversation.outcome)}>
              {outcomeLabel(conversation.outcome)}
            </Badge>
            <Badge tone={CONVERSATION_TONES[conversation.status]}>
              {CONVERSATION_STATUS_LABELS[conversation.status]}
            </Badge>
          </div>
        </div>

        {/* Souhrn AI */}
        <div className="p-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            AI souhrn
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink">{conversation.summary}</p>

          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg bg-surface-muted/50 px-3.5 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                Zjištěný záměr
              </dt>
              <dd className="mt-1 text-ink">{conversation.detectedIntent}</dd>
            </div>
            <div className="rounded-lg bg-surface-muted/50 px-3.5 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                Sentiment
              </dt>
              <dd className="mt-1 text-ink">
                {metadata.sentiment === 'positive'
                  ? 'Pozitivní'
                  : metadata.sentiment === 'negative'
                    ? 'Negativní'
                    : 'Neutrální'}
              </dd>
            </div>
            <div className="rounded-lg bg-surface-muted/50 px-3.5 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                Ukončení
              </dt>
              <dd className="mt-1 text-ink">{metadata.endReason}</dd>
            </div>
          </dl>

          {conversation.escalationReason && (
            <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-900">
              <Icon name="alert-circle" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong>Eskalace:</strong> {conversation.escalationReason}
                {metadata.transferredTo ? ` — přepojeno na ${metadata.transferredTo}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Transkript */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-semibold text-ink">Transkript</h3>
          <span className="text-xs text-muted">
            {conversation.transcript.length} zpráv
          </span>
        </div>
        <div className="space-y-3 p-5">
          {conversation.transcript.map((msg) =>
            msg.role === 'system' ? (
              <div key={msg.id} className="text-center">
                <span className="rounded-full bg-surface-muted/70 px-3 py-1 text-[11px] text-muted">
                  {msg.text} · {formatDuration(msg.atSec)}
                </span>
              </div>
            ) : (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'caller' ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
                    msg.role === 'assistant'
                      ? 'bg-accent text-accent-bright'
                      : 'bg-surface-muted text-ink'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <Icon name="phone-call" className="h-3.5 w-3.5" />
                  ) : (
                    <Icon name="user" className="h-3.5 w-3.5" />
                  )}
                </span>
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-accent-soft text-accent-ink'
                      : 'bg-surface-muted text-ink'
                  }`}
                >
                  <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {ROLE_LABELS[msg.role]} · {formatDuration(msg.atSec)}
                  </span>
                  {msg.text}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-semibold text-ink">Metadata hovoru</h3>
        </div>
        <dl className="grid gap-x-6 gap-y-3 p-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <MetaItem label="Směr" value={metadata.direction === 'inbound' ? 'Příchozí' : 'Odchozí'} />
          <MetaItem label="Důvod ukončení" value={metadata.endReason} />
          <MetaItem label="Náklady Vapi" value={metadata.costUsd != null ? `$${metadata.costUsd.toFixed(2)}` : '—'} />
          <MetaItem label="Latence" value={metadata.latencyMs ? `${metadata.latencyMs} ms` : '—'} />
          <MetaItem
            label="Přepojeno na"
            value={metadata.transferredTo ?? '—'}
          />
          <MetaItem
            label="Nahrávka"
            value={metadata.recordingUrl ? 'k dispozici' : 'neexistuje'}
          />
        </dl>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
