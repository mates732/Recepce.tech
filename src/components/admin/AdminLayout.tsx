'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/shared/Icon';
import type { IconName } from '@/components/shared/Icon';

const NAV_MAIN: Array<{ label: string; href: string; icon: IconName }> = [
  { label: 'Přehled', href: '/admin', icon: 'grid' },
  { label: 'Asistenti', href: '/admin/assistants', icon: 'phone-call' },
  { label: 'Klienti', href: '/admin/clients', icon: 'building' },
  { label: 'Znalosti', href: '/admin/knowledge', icon: 'book-open' },
  { label: 'Konverzace', href: '/admin/conversations', icon: 'inbox' },
  { label: 'Analytika', href: '/admin/analytics', icon: 'bar-chart' },
];

const NAV_BOTTOM: Array<{ label: string; href: string; icon: IconName }> = [
  { label: 'Nastavení', href: '/admin/settings', icon: 'wrench' },
  { label: 'Fakturace', href: '/admin/billing', icon: 'briefcase' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname.startsWith(href + '/');
  }

  function renderNav(items: Array<{ label: string; href: string; icon: IconName }>) {
    return items.map((item) => {
      const active = isActive(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setSidebarOpen(false)}
          aria-current={active ? 'page' : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            active
              ? 'bg-accent text-accent-bright'
              : 'text-muted hover:text-ink hover:bg-surface-muted'
          }`}
        >
          <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
          {item.label}
        </Link>
      );
    });
  }

  return (
    <div className="min-h-screen bg-page">
      {/* Sidebar — desktop fixní, mobil skrytý za hamburgrem */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Admin navigace"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-bright">
              <Icon name="phone-call" className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-semibold tracking-[0.11em] text-ink">
              RECEPCE.TECH
            </span>
          </Link>
          <button
            type="button"
            className="p-1 text-muted hover:text-ink lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Zavřít menu"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Hlavní navigace">
          {renderNav(NAV_MAIN)}
        </nav>

        <div className="space-y-1 border-t border-border p-3">
          {renderNav(NAV_BOTTOM)}
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              <Icon name="log-out" className="h-[18px] w-[18px] shrink-0" />
              Odhlásit se
            </button>
          </form>
        </div>
      </aside>

      {/* Mobilní overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="lg:pl-64">
        {/* Mobilní horní lišta */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur lg:hidden">
          <Link href="/admin" className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.11em] text-ink">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-accent-bright">
              <Icon name="phone-call" className="h-3.5 w-3.5" />
            </span>
            RECEPCE.TECH
          </Link>
          <button
            type="button"
            className="p-1.5 text-ink"
            onClick={() => setSidebarOpen(true)}
            aria-label="Otevřít menu"
          >
            <Icon name="menu" className="h-6 w-6" />
          </button>
        </header>

        <main className="mx-auto max-w-6xl p-5 lg:p-8" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
