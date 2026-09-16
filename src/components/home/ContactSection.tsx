'use client';

import { useState } from 'react';
import { Icon } from '@/components/shared/Icon';

/**
 * Finální kapitola — velká otevřená kontaktní sekce.
 * Vlevo statement, vpravo minimalistický formulář na jemných linkách.
 * Žádná masivní karta. Submit odešle mailto s předvyplněným tělem —
 * funguje bez backendu a zachovává stávající kanál (e-mail).
 */

const INTERESTS = [
  { value: 'web', label: 'WEB' },
  { value: 'asistent', label: 'VIRTUÁLNÍ ASISTENT' },
  { value: 'jine', label: 'JINÉ' },
] as const;

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [interest, setInterest] = useState<(typeof INTERESTS)[number]['value'] | null>(null);
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Poptávka${interest ? ` — ${INTERESTS.find((i) => i.value === interest)?.label}` : ''}${name ? ` — ${name}` : ''}`,
    );
    const body = encodeURIComponent(
      `${message}\n\n${name}\n${email}`,
    );
    window.location.href = `mailto:vojanmatyas@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const inputCls =
    'w-full border-b border-border-strong bg-transparent py-3 text-[15px] text-ink placeholder:text-faint transition-colors duration-200 focus:border-accent focus:outline-none';

  return (
    <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
      {/* Levá strana — statement */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
          MÁTE NĚCO V HLAVĚ?
        </p>
        <h2 className="mt-6 text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
          Web. Virtuální asistent.
          <br />
          <span className="text-accent">Nebo zatím jen nápad.</span>
        </h2>
        <p className="mt-7 max-w-md text-base leading-relaxed text-muted">
          Řekněte mi, co potřebujete. Ozvu se a probereme, co dává smysl.
        </p>

        <a
          href="mailto:vojanmatyas@gmail.com"
          className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-2 transition-colors duration-200 hover:text-accent"
        >
          <Icon name="mail" className="h-4 w-4 text-accent" />
          vojanmatyas@gmail.com
        </a>

        <div className="mt-10 flex items-center gap-3 border-t border-border pt-6 text-[12px] font-medium uppercase tracking-[0.18em] text-faint">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
          Recepce.tech — Web × Virtuální asistenti
        </div>
      </div>

      {/* Pravá strana — minimalistický formulář */}
      <form onSubmit={onSubmit} className="lg:pt-4">
        <div className="grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              JMÉNO
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vaše jméno"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
              E-MAIL
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vas@email.cz"
              className={inputCls}
            />
          </label>
        </div>

        <label className="mt-7 block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            CO POTŘEBUJETE?
          </span>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Pár vět o projektu, termínu nebo čemkoli důležitém…"
            className={`${inputCls} resize-none`}
          />
        </label>

        {/* Volitelný zájem */}
        <fieldset className="mt-7">
          <legend className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            MÁM ZÁJEM O (VOLITELNÉ)
          </legend>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {INTERESTS.map((i) => (
              <button
                key={i.value}
                type="button"
                aria-pressed={interest === i.value}
                onClick={() => setInterest(interest === i.value ? null : i.value)}
                className={`border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                  interest === i.value
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-border-strong text-muted hover:border-faint hover:text-ink'
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="group mt-10 inline-flex h-12 items-center gap-2.5 bg-accent px-7 text-[13px] font-semibold uppercase tracking-[0.1em] text-accent-bright transition-colors duration-200 hover:bg-accent-hover"
        >
          ODESLAT
          <Icon
            name="arrow-right"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>

        {sent && (
          <p className="mt-4 text-[12px] text-muted" role="status">
            Otevírám e-mail — stačí ho odeslat. Ozvu se co nejdřív.
          </p>
        )}
      </form>
    </div>
  );
}
