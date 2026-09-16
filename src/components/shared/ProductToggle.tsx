'use client';

import Link from 'next/link';

export type ProductMode = 'asistenti' | 'weby';

/**
 * Režim přepínače. 'home' = neutrální vstupní bod (/) — žádný produkt
 * není aktivní, přepínač funguje jen jako navigace mezi produkty.
 */
export type ProductToggleMode = ProductMode | 'home';

interface ProductToggleProps {
  mode?: ProductToggleMode;
}

const PRODUCTS: { value: ProductMode; label: string; href: string }[] = [
  { value: 'asistenti', label: 'VIRTUÁLNÍ ASISTENTI', href: '/virtualni-asistenti' },
  { value: 'weby', label: 'WEBY', href: '/weby' },
];

export default function ProductToggle({ mode = 'asistenti' }: ProductToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Přepínač hlavní služby"
      className="inline-flex items-center"
    >
      {PRODUCTS.map((product, index) => {
        const active = mode !== 'home' && mode === product.value;
        return (
          <div key={product.value} className="flex items-center">
            {index > 0 && (
              <span
                className="mx-2 text-[10px] font-medium leading-none tracking-[0.2em] text-faint sm:mx-3"
                aria-hidden="true"
              >
                |
              </span>
            )}

            <Link
              href={product.href}
              role="tab"
              aria-selected={active}
              aria-current={active ? 'page' : undefined}
              className={`relative rounded px-1 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.12em] transition-colors duration-150 sm:text-[11px] ${
                active
                  ? 'text-accent'
                  : 'text-muted hover:text-ink'
              }`}
              data-product={product.value}
            >
              {product.label}
              <span
                aria-hidden="true"
                className={`absolute left-1 right-1 -bottom-[4px] h-[1.5px] origin-left transition-transform duration-150 ${
                  active
                    ? 'scale-x-100 bg-accent'
                    : 'scale-x-0 bg-accent'
                }`}
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
