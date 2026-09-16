export default function AiReceptionistPage() {
  return (
    <section style={{ color: 'var(--color-ink)' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px', color: 'var(--color-muted)' }}>AI receptionist</p>
      <h1 style={{ fontFamily: "'Söhne', system-ui, sans-serif", fontSize: 'clamp(2.6rem, 8vw, 5.2rem)', lineHeight: 1.02, textWrap: 'balance', marginTop: '18px' }}>
        Vy pracujete.
        <br />
        Klára vyřídí zbytek.
      </h1>
      <p style={{ marginTop: '22px', maxWidth: '42ch', color: 'var(--color-muted)', fontSize: '1.05rem' }}>
        Klára answers the phone, understands what the customer actually wants, checks availability, books the appointment, and confirms it. Same number. Same voice. Different business.
      </p>
      <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <a href="#klara" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 18px', background: 'var(--color-accent)', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
          Promluvit si s Klárou
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Klára je jen první ze čtyř</span>
      </div>
    </section>
  );
}
