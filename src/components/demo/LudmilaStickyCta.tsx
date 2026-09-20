'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/shared/Icon';

/**
 * Mobilní sticky CTA pro /Ludmila.
 *
 * Zobrazuje se jen na mobilu (< 768 px) a jen tam, kde dává smysl:
 *  - až po odscrollování hero sekce (nekryje vlastní CTA v hero),
 *  - nikdy ve stejnou chvíli, kdy je na obrazovce lišta dema v rámu
 *    (demo má vlastní „Zeptat se recepční / Zavolat“ — dvě stejné CTA
 *    na jedné obrazovce by působily jako chyba),
 *  - ne, když by zasahovala do patičky webu.
 * Respektuje safe-area iPhonu a `prefers-reduced-motion`.
 */
const PHONE = '+420720943766';
const PHONE_LABEL = '+420 720 943 766';

/** Od kolika px scrollu se lišta začne řešit (hero musí zmizet). */
const SCROLL_THRESHOLD = 260;
/** Výška lišty dema uvnitř iframu — její akce visí na spodní hraně rámu. */
const DEMO_BAR_HEIGHT = 62;
/** Výška naší lišty bez safe-area (pt-2.5 + 44 px tlačítka + pb-2.5). */
const OWN_BAR_HEIGHT = 64;
/** Hysteréze, aby lišta na hraně pásma při scrollu neblikala. */
const COLLISION_SLACK = 32;

export default function LudmilaStickyCta() {
  const [visible, setVisible] = useState(false);
  /** Je zrovna naše lišta stažená kvůli kolizi s lištou dema? (kvůli hysterézi) */
  const colliding = useRef(false);

  useEffect(() => {
    const frame = document.querySelector<HTMLIFrameElement>('#ukazka iframe');
    const footer = document.querySelector('footer');

    const update = () => {
      const viewport = window.innerHeight;
      const frameBox = frame ? frame.getBoundingClientRect() : null;
      const footerBox = footer ? footer.getBoundingClientRect() : null;

      /* Lišta dema je `position: fixed` uvnitř iframu → drží se na spodní
         hraně rámu, tedy v pásu [frameBottom - 62, frameBottom]. Naše lišta
         zabírá [viewport - 64, viewport]. Překryjí se proto jen tehdy, když
         je spodní hrana rámu od spodku viewportu blíž než jedna výška lišty. */
      const delta = frameBox ? frameBox.bottom - viewport : Number.POSITIVE_INFINITY;
      const slack = colliding.current ? COLLISION_SLACK : 0;
      const barsCollide =
        delta < DEMO_BAR_HEIGHT + slack && delta > -(OWN_BAR_HEIGHT + slack);
      colliding.current = barsCollide;

      /* Patička: lišta se schová, jakmile do ní zasahuje. */
      const footerOverlaps = footerBox ? footerBox.top < viewport - OWN_BAR_HEIGHT : false;

      setVisible(window.scrollY > SCROLL_THRESHOLD && !barsCollide && !footerOverlaps);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  /* Kotva na rám s demem; s vypnutými animacemi skáčeme rovnou. */
  const handleAsk = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('ukazka');
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Rychlé akce"
      inert={!visible}
      style={{ paddingBottom: 'calc(0.625rem + env(safe-area-inset-bottom))' }}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-2.5 backdrop-blur-sm transition-[opacity,translate,transform] duration-300 ease-out motion-reduce:transition-none md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="flex items-center gap-2.5 px-4 pt-2.5">
        <a
          href="#ukazka"
          onClick={handleAsk}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-accent-bright shadow-sm transition-colors duration-200 select-none hover:bg-accent-hover"
        >
          <Icon name="message-circle" className="h-4 w-4" />
          Zeptat se recepční
        </a>

        <a
          href={`tel:${PHONE}`}
          aria-label={`Zavolat na ${PHONE_LABEL}`}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface px-4 text-sm font-medium text-ink transition-colors duration-200 select-none hover:bg-surface-muted"
        >
          <Icon name="phone-call" className="h-4 w-4" />
          Zavolat
        </a>
      </div>
    </nav>
  );
}
