'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/shared/Icon';
import { Badge, EmptyState, SearchInput } from '@/components/admin/ui';
import type { KnowledgeEntry, KnowledgeCategory } from '@/data/ops';
import { formatRelativeCz } from '@/lib/format';
import { KNOWLEDGE_CATEGORY_LABELS } from '@/lib/opsLabels';

const CATEGORIES: Array<{ id: KnowledgeCategory | 'all'; label: string }> = [
  { id: 'all', label: 'Vše' },
  { id: 'faq', label: 'FAQ' },
  { id: 'business', label: 'Firemní údaje' },
  { id: 'products', label: 'Produkty' },
  { id: 'hours', label: 'Otevírací doba' },
  { id: 'locations', label: 'Lokality' },
  { id: 'policies', label: 'Pravidla' },
  { id: 'custom', label: 'Vlastní' },
];

export default function KnowledgeBrowser({
  entries,
  clients,
  getClientName,
}: {
  entries: KnowledgeEntry[];
  clients: Array<{ id: string; name: string }>;
  getClientName: (id: string) => string;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<KnowledgeCategory | 'all'>('all');
  const [clientId, setClientId] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (category !== 'all' && entry.category !== category) return false;
      if (clientId !== 'all' && entry.clientId !== clientId) return false;
      if (!q) return true;
      const haystack = `${entry.title} ${entry.question ?? ''} ${entry.content}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, query, category, clientId]);

  return (
    <div className="space-y-4">
      {/* Filtry */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Hledat v otázkách a odpovědích…"
          className="min-w-[260px] flex-1 sm:max-w-md"
        />
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
          aria-label="Filtr klienta"
        >
          <option value="all">Všichni klienti</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtr kategorie">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            aria-pressed={category === cat.id}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              category === cat.id
                ? 'border-accent bg-accent text-accent-bright'
                : 'border-border bg-surface text-muted hover:text-ink'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted">
        {filtered.length} z {entries.length} záznamů
      </p>

      {/* Seznam záznamů */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Icon name="search" className="h-10 w-10" />}
          title="Nic nenalezeno"
          description="Zkuste jiné hledané slovo nebo zrušte filtry."
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((entry) => {
            const open = openId === entry.id;
            return (
              <li key={entry.id} className="rounded-xl border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : entry.id)}
                  aria-expanded={open}
                  className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left"
                >
                  <Badge tone="outline">{KNOWLEDGE_CATEGORY_LABELS[entry.category]}</Badge>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink">
                      {entry.question ?? entry.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {getClientName(entry.clientId)} · {entry.source}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {formatRelativeCz(entry.updatedAt)}
                  </span>
                  <Icon
                    name="chevron-right"
                    className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-90' : ''}`}
                  />
                </button>

                {open && (
                  <div className="border-t border-border px-5 py-4">
                    {entry.question && (
                      <p className="mb-2 text-sm font-medium text-ink">{entry.title}</p>
                    )}
                    <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
                      {entry.content}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                      <span>Zdroj: {entry.source}</span>
                      <span>·</span>
                      <span>Naposledy aktualizováno {formatRelativeCz(entry.updatedAt)}</span>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
