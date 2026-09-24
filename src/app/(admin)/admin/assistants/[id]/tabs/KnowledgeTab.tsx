import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';
import { Badge, EmptyState } from '@/components/admin/ui';
import type { KnowledgeEntry } from '@/data/ops';
import { formatRelativeCz } from '@/lib/format';
import { KNOWLEDGE_CATEGORY_LABELS } from '@/lib/opsLabels';

export default function KnowledgeTab({ knowledge }: { knowledge: KnowledgeEntry[] }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink">Znalostní báze asistenta</h2>
          <p className="mt-0.5 text-sm text-muted">
            Strukturované záznamy, na které se asistent odpovídá. Spravujte je centrálně v{' '}
            <Link href="/admin/knowledge" className="underline underline-offset-2 hover:text-ink">
              Znalostech
            </Link>
            .
          </p>
        </div>
        <Link
          href={`/admin/knowledge?assistant=${knowledge[0]?.assistantId ?? ''}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover"
        >
          <Icon name="plus" className="h-4 w-4" />
          Přidat záznam
        </Link>
      </div>

      {knowledge.length === 0 ? (
        <EmptyState
          icon={<Icon name="book-open" className="h-10 w-10" />}
          title="Žádné záznamy"
          description="Tento asistent zatím nemá připojené žádné znalosti."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Kategorie
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Otázka
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Odpověď
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Zdroj
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Aktualizováno
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {knowledge.map((entry) => (
                <tr key={entry.id} className="align-top transition-colors hover:bg-surface-muted/40">
                  <td className="px-4 py-3.5">
                    <Badge tone="outline">{KNOWLEDGE_CATEGORY_LABELS[entry.category] ?? entry.category}</Badge>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-ink">{entry.question ?? entry.title}</td>
                  <td className="max-w-md px-4 py-3.5 text-sm leading-relaxed text-muted">
                    <span className="line-clamp-2">{entry.content}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-muted">{entry.source}</td>
                  <td className="px-4 py-3.5 text-right text-sm text-muted">
                    {formatRelativeCz(entry.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
