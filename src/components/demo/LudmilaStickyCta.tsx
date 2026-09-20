'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/shared/Icon';

/**
 * Mobilní sticky CTA pro /Ludmila.
 *
 * Zobrazuje se jen na mobilu (< 768 px) a jen tam, kde dává smysl:
 *  - až po odscrollování hero sekce (nekryje vlastní CTA v hero),
 *  - ne, když je v záběru rám s demem (demo má vlastní lištu s mikrofonem),
 *  - ne, když je v záběru patička webu (nekryje odkazy v patičce).
 * Respektuje safe-area iPhonu a `prefers-reduced-motion`.
 */
const PHONE = '+420720943766';
const PHONE_LABEL = '+420 720 943 766';
const SCROLL_THRESHOLD = 260;

export default function LudmilaStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = document.querySelector('#ukazka iframe');
    const footer = document.querySelector('footer');

    const update = () => {
      const frameBottom = frame ? frame.getBoundingClientRect().bottom : Number.NEGATIVE_INFINITY;
      const footerTop = footer ? footer.getBoundingClientRect().top : Number.POSITIVE_INFINITY;

      // Vlastní rychlé akce má i demo v iframu — když jsou na obrazovce
      // (dole v záběru), naše lišta se schová, aby se dvě CTA nepřekrývaly.
      const demoBarOnScreen =
        frameBottom > window.innerHeight - 150 && frameBottom < window.innerHeight + 80;
      // Patička webu: lišta se schová, aby nekryla její odkazy.
      const footerOnScreen = footerTop < window.innerHeight - 64;

      setVisible(window.scrollY > SCROLL_THRESHOLD && !demoBarOnScreen && !footerOnScreen);
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
