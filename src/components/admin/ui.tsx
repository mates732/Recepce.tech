import type { ReactNode } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/shared/Icon';

export { Button } from '@/components/shared/Button';

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */

export type BadgeTone =
  | 'neutral'
  | 'positive'
  | 'warning'
  | 'negative'
  | 'info'
  | 'outline';

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-ink border-transparent',
  positive: 'bg-emerald-100 text-emerald-800 border-transparent',
  warning: 'bg-amber-100 text-amber-800 border-transparent',
  negative: 'bg-red-100 text-red-800 border-transparent',
  info: 'bg-sky-100 text-sky-800 border-transparent',
  outline: 'bg-transparent text-muted border-border',
};

export function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${BADGE_TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Status dot                                                          */
/* ------------------------------------------------------------------ */

export function StatusDot({
  tone = 'neutral',
  className = '',
}: {
  tone?: BadgeTone;
  className?: string;
}) {
  const colors: Record<BadgeTone, string> = {
    neutral: 'bg-muted',
    positive: 'bg-emerald-500',
    warning: 'bg-amber-500',
    negative: 'bg-red-500',
    info: 'bg-sky-500',
    outline: 'bg-border',
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[tone]} ${className}`} />;
}

/* ------------------------------------------------------------------ */
/* Stat card                                                           */
/* ------------------------------------------------------------------ */

export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
}: {
  label: string;
  value: string;
  hint?: ReactNode;
  icon?: ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          {label}
        </p>
        {icon ? <span className="text-muted">{icon}</span> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-ink tabular-nums">
        {value}
      </p>
      {hint ? <div className="mt-1 text-xs text-muted">{hint}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-surface-muted/40"
      >
        {body}
      </Link>
    );
  }

  return <div className="rounded-xl border border-border bg-surface p-5">{body}</div>;
}

/* ------------------------------------------------------------------ */
/* Section card                                                        */
/* ------------------------------------------------------------------ */

export function SectionCard({
  title,
  description,
  action,
  children,
  className = '',
  contentClassName = '',
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={`rounded-xl border border-border bg-surface ${className}`}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            {title ? <h2 className="font-semibold text-ink">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
          </div>
          {action}
        </header>
      )}
      <div className={contentClassName || 'p-5'}>{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-muted/40 px-6 py-12 text-center">
      {icon ? <div className="mx-auto mb-4 text-muted">{icon}</div> : null}
      <p className="font-semibold text-ink">{title}</p>
      {description ? <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page header                                                         */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">{title}</h1>
        {description ? <p className="mt-1 text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs (client component wrapper is separate — see TabsNav.tsx)       */
/* ------------------------------------------------------------------ */

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

/* ------------------------------------------------------------------ */
/* Form controls                                                       */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition';

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Icon
        name="search"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pl-10`}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Avatar                                                              */
/* ------------------------------------------------------------------ */

export function Avatar({ initials, className = '' }: { initials: string; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold uppercase tracking-[0.08em] text-accent ${className}`}
    >
      {initials}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Table helpers                                                       */
/* ------------------------------------------------------------------ */

export const thClass =
  'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted';
export const thRightClass =
  'px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted';
