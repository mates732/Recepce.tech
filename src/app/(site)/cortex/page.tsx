export default function CortexPage() {
  return (
    <section style={{ color: 'var(--color-ink)' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px', color: 'var(--color-muted)' }}>Cortex</p>
      <h1 style={{ fontFamily: "'Söhne', system-ui, sans-serif", fontSize: 'clamp(2.4rem, 7vw, 4.4rem)', lineHeight: 1.04, textWrap: 'balance', marginTop: '16px' }}>
        A question that became useful.
      </h1>
      <p style={{ marginTop: '22px', maxWidth: '44ch', color: 'var(--color-muted)' }}>
        Before it was a product, it was a question: can a voice AI feel natural? The answer is still forming.
      </p>
      <p style={{ marginTop: '24px', color: 'var(--color-muted)' }}>Check back when the next iteration arrives.</p>
    </section>
  );
}
