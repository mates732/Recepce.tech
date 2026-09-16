'use client';

import { motion } from 'framer-motion';
import { TransitionSection } from '@/components/home/Transitions';
import { SectionHeading } from '@/components/shared/SectionHeading';

export default function NotChatbot() {
  return (
    <section style={{ color: 'var(--color-ink)' }}>
      <TransitionSection>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 20px' }}>
          <SectionHeading
            eyebrow="To není chatbott"
            title="Chatbot odpoví. My provedeme."
            description="Chatbot řekne cenu. My zvedneme telefon, pochopíme, co zákazník chce, a rezervujeme termín."
            size="display"
            align="left"
          />
        </div>
      </TransitionSection>

      <TransitionSection className="max-w-[1000px] mx-auto px-5 pb-15">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* left column: chatbot */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                margin: '0',
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: 'clamp(2rem, 8vw, 5rem)',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                color: 'var(--color-muted)',
              }}
            >
              chatbot
            </p>
            <p
              style={{
                marginTop: '16px',
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: '1.1rem',
                color: 'var(--color-muted)',
                maxWidth: '26ch',
                margin: '16px auto 0',
              }}
            >
              řekne cenu
            </p>
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                style={{
                  margin: '32px auto 0',
                  width: '100%',
                  maxWidth: '280px',
                  padding: '16px 20px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  borderRadius: '12px',
                  fontFamily: "var(--font-sans)",
                  fontSize: '0.95rem',
                  color: 'var(--color-ink)',
                }}
              >
                <p style={{ margin: '0 0 6px' }}>“Jaká je cena za střih?”</p>
                <p style={{ margin: '0', fontStyle: 'italic', color: 'var(--color-muted)' }}>
                  “250 Kč.”
                </p>
              </div>
            </motion.div>
          </div>

          {/* right column: recepce.tech */}
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                margin: '0',
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: 'clamp(2rem, 8vw, 5rem)',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                color: 'var(--color-ink)',
              }}
            >
              recepce.tech
            </p>
            <p
              style={{
                marginTop: '16px',
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: '1.1rem',
                color: 'var(--color-ink)',
                maxWidth: '26ch',
                margin: '16px auto 0',
              }}
            >
              zvedne. odpoví. pochopí. rezervuje. provede.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                style={{
                  margin: '32px auto 0',
                  width: '100%',
                  maxWidth: '280px',
                  padding: '16px 20px',
                  border: '1px solid var(--color-accent-soft)',
                  background: 'var(--color-accent-soft)',
                  borderRadius: '12px',
                  fontFamily: "var(--font-sans)",
                  fontSize: '0.95rem',
                  color: 'var(--color-ink)',
                }}
              >
                <p style={{ margin: '0 0 6px' }}>“Jaká je cena za střih?”</p>
                <p style={{ margin: '0 0 6px' }}>“250 Kč. Kdybychom měli volno, můžeme se objednat.”</p>
                <p style={{ margin: '0 0 6px' }}>“Máte volno příští středu?”</p>
                <p style={{ margin: '0 0 6px' }}>“Ano, ve 16:00 i v 17:30.”</p>
                <p style={{ margin: '0' }}>“V 16:00.”</p>
                <p style={{ margin: '0', marginTop: '8px', fontWeight: 600, color: 'var(--color-accent)' }}>
                  “Termín jsem rezervovala. Termín je zapsán.”
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </TransitionSection>
    </section>
  );
}
