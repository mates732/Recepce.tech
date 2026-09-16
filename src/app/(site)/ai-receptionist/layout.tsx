import type { ReactNode } from 'react';

export default function AiReceptionistLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '40px', maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <main>{children}</main>
      <aside aria-label="Side notes" style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.6 }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px', color: 'var(--color-muted)' }}>Scene notes</p>
        <p style={{ marginTop: '8px' }}>This page is a narrative, not a catalog.</p>
      </aside>
    </div>
  );
}
