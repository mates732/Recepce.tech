'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TransitionSection } from '@/components/home/Transitions';
import { Icon } from '@/components/shared/Icon';
import { SectionHeading } from '@/components/shared/SectionHeading';

export default function BusinessContinues() {
  const [called, setCalled] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCalled(true), 900);
    const t2 = setTimeout(() => setBookingDone(true), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section style={{ color: 'var(--color-ink)', background: 'var(--color-surface)' }}>
      <TransitionSection>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 20px' }}>
          <SectionHeading
            eyebrow="Real world story"
            title="Friseurka stříhá."
            description="Telefon zazvoní. Někdo zvedne. Friseurka stále stříhá."
            size="display"
            align="left"
          />
        </div>
      </TransitionSection>

      <TransitionSection className="max-w-[1000px] mx-auto px-5 pb-20">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '40px',
            alignItems: 'center',
          }}
        >
          {/* left: business environment */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 8px 24px -12px rgba(0, 0, 0, 0.2)',
            }}
          >
            {!called ? (
              <>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--color-ink)',
                  }}
                >
                  Friseurka stříhá.
                </p>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--color-muted)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                  }}
                >
                  Stříhá. Volá zákazník. Možná čtyři naraz. A ona stále stříhá.
                </p>
                <div
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    height: '48px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                  }}
                >
                  <Icon name="scissors" style={{ width: 24, height: 24, color: 'var(--color-muted)' }} />
                </div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p
                    style={{
                      margin: '0 0 6px',
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: 'var(--color-ink)',
                    }}
                  >
                    Telefon zazvonil.
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: 'var(--color-muted)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                    }}
                  >
                    Klára zvedla. Zákazka zůstala. Friseurka stále stříhá.
                  </p>
                </motion.div>
                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-muted)',
                    borderRadius: '8px',
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--color-accent-soft)',
                      display: 'grid',
                      placeContent: 'center',
                      fontWeight: 600,
                      fontSize: '12px',
                      color: 'var(--color-accent)',
                    }}
                  >
                    KV
                  </span>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-ink)' }}>
                      Klára
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                      Příchozí hovor přijat
                    </p>
                  </div>
                </div>
                {bookingDone && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    style={{
                      marginTop: '12px',
                      padding: '10px 14px',
                      border: '1px solid var(--color-accent-soft)',
                      background: 'var(--color-accent-soft)',
                      borderRadius: '8px',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-sans)",
                        fontSize: '0.95rem',
                        color: 'var(--color-ink)',
                        fontWeight: 500,
                      }}
                    >
                      Termín rezervován
                    </p>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: '0.8rem',
                        color: 'var(--color-muted)',
                      }}
                    >
                      Úterý 14. 5. · 16:00 · střih a barvení
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* right: call transcript */}
          <div
            style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 8px 24px -12px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-ink)' }}>
                Klára
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                Příchozí hovor
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {called ? (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  style={{
                    padding: '10px 14px',
                    background: 'var(--color-surface-muted)',
                    borderRadius: '8px',
                    fontFamily: "var(--font-sans)",
                    color: 'var(--color-ink)',
                    fontSize: '0.95rem',
                  }}
                >
                  Dobrý den, tady Klára. Jak vám mohu pomoci?
                </motion.p>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    padding: '10px 14px',
                    background: 'var(--color-surface-muted)',
                    borderRadius: '8px',
                    fontFamily: "var(--font-sans)",
                    color: 'var(--color-muted)',
                    fontSize: '0.95rem',
                  }}
                >
                  Telefon zazvoní…
                </motion.div>
              )}
              {called && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  style={{
                    padding: '10px 14px',
                    border: '1px solid var(--color-accent-soft)',
                    background: 'var(--color-accent-soft)',
                    borderRadius: '8px',
                    fontFamily: "var(--font-sans)",
                    color: 'var(--color-ink)',
                    fontSize: '0.95rem',
                  }}
                >
                  Chtěla bych se objednat na střih a barvení.
                </motion.p>
              )}
              {bookingDone && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                  style={{
                    padding: '10px 14px',
                    border: '1px solid var(--color-accent-soft)',
                    background: 'var(--color-accent-soft)',
                    borderRadius: '8px',
                    fontFamily: "var(--font-sans)",
                    color: 'var(--color-ink)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                  }}
                >
                  Skvěle. Termín jsem rezervovala.
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </TransitionSection>
    </section>
  );
}
