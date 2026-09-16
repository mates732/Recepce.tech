export default function NotFound() {
  return (
    <main style={{ color: 'var(--color-ink)', minHeight: '60vh', display: 'grid', placeContent: 'center', textAlign: 'center' }}>
      <span style={{ display: 'inline-block', padding: '6px 10px', border: '1px solid var(--color-border)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        404
      </span>
      <h1 style={{ marginTop: '24px', fontSize: 'clamp(2rem, 8vw, 4rem)', lineHeight: 1.05, textWrap: 'balance' }}>
        Tato stránka neexistuje.
      </h1>
      <p style={{ marginTop: '12px', color: 'var(--color-muted)', maxWidth: '380px', margin: '12px auto 0' }}>
        Nic tu není. Nebo to teprve vzniká.
      </p>
    </main>
  );
}
