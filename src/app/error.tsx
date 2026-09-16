'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // no-op: nelogujeme, nespouštíme nic navíc.
  }, [error]);

  return (
    <main style={{ color: 'var(--color-ink)', minHeight: '60vh', display: 'grid', placeContent: 'center', textAlign: 'center' }}>
      <span style={{ display: 'inline-block', padding: '6px 10px', border: '1px solid var(--color-border)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Chyba
      </span>
      <h1 style={{ marginTop: '22px', fontSize: 'clamp(2rem, 8vw, 4rem)', lineHeight: 1.05, textWrap: 'balance' }}>
        Něco se pokazilo.
      </h1>
      <p style={{ marginTop: '12px', color: 'var(--color-muted)', maxWidth: '380px', margin: '12px auto 0' }}>
        Nic se neděje — zkuste to znovu.
      </p>
      <button
        onClick={() => reset()}
        style={{ marginTop: '24px', padding: '10px 18px', background: 'var(--color-accent)', color: 'var(--color-accent-bright)', border: 'none', fontWeight: 600, cursor: 'pointer' }}
      >
        Zkusit znovu
      </button>
    </main>
  );
}
