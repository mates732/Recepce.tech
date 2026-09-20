'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/shared/Icon';

/**
 * Mobilní sticky CTA pro /Ludmila.
 *
 * Zobrazuje se jen na mobilu (< 768 px) a jen tam, kde dává smysl:
 *  - až po odscrollování karty s tlačítkem (nekryje vlastní CTA),
 *  - ne, když běží hovor s asistentem (tlačítko hovoru je na stránce),
 *  - ne, když by zasahovala do patičky webu.
 * Respektuje safe-area iPhonu a `prefers-reduced-motion`.
 */
const PHONE = '+420720943766';
const PHONE_LABEL = '+420 720 943 766';

/** Od kolika px scrollu se lišta začne řešit (karta s tlačítkem musí zmizet). */
const SCROLL_THRESHOLD = 420;
/** Výška naší lišty bez safe-area (pt-2.5 + 44 px tlačítka + pb-2.5). */
const OWN_BAR_HEIGHT = 64;

export default function LudmilaStickyCta() {
  const [visible, setVisible] = useState(false);
  const [callActive, setCallActive] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');

    const update = () => {
      const viewport = window.innerHeight;
      const footerBox = footer ? footer.getBoundingClientRect() : null;

      /* Patička: lišta se schová, jakmile do ní zasahuje. */
      const footerOverlaps =
        footerBox && footerBox.top < viewport - OWN_BAR_HEIGHT;

      setVisible(
        window.scrollY > SCROLL_THRESHOLD && !footerOverlaps && !callActive,
      );
    };

    /* VapiCallButton vyhazuje událost se změnou stavu hovoru — během hovoru
       lištu skrýváme, aby nepřekážela kartě s probíhajícím hovorem. */
    const onCallState = (event: Event) => {
      const detail = (event as CustomEvent<{ active?: boolean }>).detail;
      setCallActive(Boolean(detail?.active));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('vapi-call-state', onCallState);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('vapi-call-state', onCallState);
    };
  }, [callActive]);

  /* Kotva na kartu s recepčním; s vypnutými animacemi skáčeme rovnou. */
  const handleAsk = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('recepce');
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
          href="#recepce"
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
