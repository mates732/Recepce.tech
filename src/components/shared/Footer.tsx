import Link from 'next/link';

const LINKS = [
  { label: 'WEBY', href: '/weby' },
  { label: 'VIRTUÁLNÍ ASISTENTI', href: '/virtualni-asistenti' },
  { label: 'DEMO', href: '/demo' },
  { label: 'O MNĚ', href: '/o-me' },
  { label: 'KONTAKT', href: '/#kontakt' },
] as const;

const LEGAL_LINKS = [
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
] as const;

/**
 * Minimální footer — navigace + právní odkazy. Žádná přeplněná patička.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-8 lg:px-8">
        <p className="text-[12px] font-semibold tracking-[0.14em] text-ink">RECEPCE.TECH</p>
        <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted transition-colors duration-200 hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          {LEGAL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-medium tracking-[0.08em] text-faint transition-colors duration-200 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <span className="text-[11px] tracking-[0.08em] text-faint">CZ / EU</span>
        </div>
      </div>
    </footer>
  );
}
