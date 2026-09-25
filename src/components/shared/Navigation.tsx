'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProductToggle from '@/components/shared/ProductToggle';
import type { ProductToggleMode } from '@/components/shared/ProductToggle';

/* Odkazy na produkty (/virtualni-asistenti, /weby) jsou pouze v navbaru
   přes ProductToggle — v menu je záměrně neduplikujeme. */
const MENU_ITEMS = [
  { label: 'Demo', href: '/demo' },
  { label: 'O mně', href: '/o-mne' },
];

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className="inline-flex h-5 w-5 flex-col justify-center gap-[5px]" aria-hidden="true">
      <span
        className={`block h-[1.5px] w-[22px] rounded-full bg-ink transition-all duration-300 ${open ? 'rotate-[45deg] translate-y-[3.5px]' : ''}`}
      />
      <span
        className={`block h-[1.5px] w-[22px] rounded-full bg-ink transition-all duration-300 ${open ? 'opacity-0' : ''}`}
      />
      <span
        className={`block h-[1.5px] w-[22px] rounded-full bg-ink transition-all duration-300 ${open ? '-rotate-[45deg] -translate-y-[3.5px]' : ''}`}
      />
    </span>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const mode: ProductToggleMode =
    pathname === '/weby' ? 'weby' : pathname === '/virtualni-asistenti' ? 'asistenti' : 'home';

  const handleMenuClose = useCallback(() => setMenuOpen(false), []);

  /* Esc zavře menu; zamčený scroll, dokud je menu otevřené. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      {/* „Mlha“ — obsah pod menu (včetně navbaru) se rozmaže a zesvětlí. */}
      <div
        aria-hidden="true"
        onClick={handleMenuClose}
        className={`fixed inset-0 z-40 bg-surface/60 backdrop-blur-md transition-opacity duration-300 ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Navbar — v otevřeném menu NEVIDITELNÝ celý (logo, toggle i burger). */}
      <header
        className={`sticky top-0 z-50 bg-surface/80 backdrop-blur-sm transition-opacity duration-200 ${
          menuOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-center gap-6 px-6 lg:px-8">
          {/* Logo — logo.png (na světlém podkladu webu) */}
          <Link
            href="/"
            aria-label="Recepce.tech — domů"
            className="flex shrink-0 items-center transition-opacity duration-200 hover:opacity-70"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Recepce.tech" className="h-7 w-auto" />
          </Link>

          {/* Product toggle */}
          <div className="mx-auto flex w-[200px] justify-center">
            <ProductToggle mode={mode} />
          </div>

          {/* Burger — tap target 44×45,8 px (Apple HIG); negativní marginy drží
              margin box na 28×41,8, takže se layout/pozice ikony nemění. */}
          <button
            type="button"
            className="shrink-0 -mx-2 -my-0.5 rounded-none px-3 py-1.5 text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            aria-label="Otevřít nabídku"
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            onClick={() => setMenuOpen(true)}
          >
            <BurgerIcon open={false} />
          </button>
        </nav>
      </header>

      {/* Fullscreen menu — nezávislé na headeru (fixované vůči viewportu).
          Vlastní křížek vpravo nahoře přesně na pozici burgeru; navbar
          zmizel, viditelné jsou jen dvě volby uprostřed + křížek. */}
      <div
        id="nav-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Hlavní nabídka"
        onClick={handleMenuClose}
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Křížek — stejné pozice jako burger (h-14 lišta, max-w-6xl, px-6) */}
        <div className="absolute inset-x-0 top-0">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-end px-6 lg:px-8">
            <button
              type="button"
              className="-mx-2 -my-0.5 rounded-none px-3 py-1.5 text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
              aria-label="Zavřít nabídku"
              onClick={handleMenuClose}
            >
              <BurgerIcon open />
            </button>
          </div>
        </div>

        <nav
          className="flex h-full flex-col items-center justify-center gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={handleMenuClose}
              className={`text-balance text-center text-3xl font-semibold tracking-[-0.02em] transition-colors duration-200 sm:text-4xl ${
                pathname === item.href ? 'text-accent' : 'text-ink hover:text-accent'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
