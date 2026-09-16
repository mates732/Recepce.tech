'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TransitionSection } from '@/components/home/Transitions';
import { Button } from '@/components/shared/Button';
import { Icon, type IconName } from '@/components/shared/Icon';  const AREAS: { label: string; text: string; icon: IconName; active: boolean }[] = [
  {
    label: 'student',
    text: 'still learning, still close to the thing itself',
    icon: 'pencil',
    active: true,
  },
  {
    label: 'work',
    text: 'websites, software, assistants, systems',
    icon: 'scissors',
    active: false,
  },
  {
    label: 'video',
    text: 'making things visible, not just finished',
    icon: 'play',
    active: false,
  },
  {
    label: 'social',
    text: 'in conversation, not on display',
    icon: 'message-circle',
    active: false,
  },
  {
    label: 'ideas',
    text: 'imagining more than I can build at once',
    icon: 'zap',
    active: false,
  },
];

export function LobbyHome() {
  const [active, setActive] = useState(0);

  return (
    <div style={{ background: 'var(--color-surface)', color: 'var(--color-ink)' }}>
      {/* quiet entrance */}
      <section
        style={{
          minHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 24px 60px',
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.28em',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--color-muted)',
            }}
          >
            A working space. Still forming.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: '22px',
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: 'clamp(2.6rem, 10vw, 6.6rem)',
              lineHeight: 0.94,
              letterSpacing: '-0.04em',
              color: 'var(--color-ink)',
            }}
          >
            I am not trying to become
            <br />
            an ordinary version of
            <br />
            anything.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: '24px',
              maxWidth: '52ch',
              fontSize: '1.08rem',
              lineHeight: 1.65,
              color: 'var(--color-muted)',
            }}
          >
            I am a student, a builder, a maker of videos and systems and little
            intelligent things. Not one of those cleanly. Not all of those neatly.
            Just a person trying to make everything fit together with some care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginTop: '36px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            <Button
              variant="secondary"
              style={{ border: '1px solid var(--color-border)', color: 'var(--color-ink)' }}
            >
              What I am working on
            </Button>
            <Button
              href="#work"
              style={{ background: 'var(--color-accent)', color: '#fff' }}
            >
              See the work
              <Icon name="arrow-right" style={{ width: 16, height: 16 }} />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.38, ease: 'easeOut' }}
            style={{
              marginTop: '40px',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-faint)',
            }}
          >
            This is the lobby.
            <br />
            The other rooms lead from here.
          </motion.p>
        </div>
      </section>

      {/* the honest center */}
      <TransitionSection>
        <div
          style={{
            maxWidth: '980px',
            margin: '0 auto',
            padding: '72px 24px 64px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--color-muted)',
              }}
            >
              Not one thing. Several, at once.
            </p>
            <h2
              style={{
                marginTop: '18px',
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: 'clamp(1.8rem, 6vw, 3.4rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                color: 'var(--color-ink)',
              }}
            >
              A student with too much imagination.
              <br />
              A builder who still has to learn.
              <br />
              A human trying to make it all work.
            </h2>
          </motion.div>
        </div>
      </TransitionSection>

      {/* the active areas: conversational, not cards-for-cards’-sake */}
      <TransitionSection>
        <div
          style={{
            maxWidth: '980px',
            margin: '0 auto',
            padding: '0 24px 80px',
          }}
        >
          <ol
            style={{
              listStyle: 'none',
              margin: '0',
              padding: '0',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1px',
              background: 'var(--color-border)',
              border: '1px solid var(--color-border)',
            }}
          >
            {AREAS.map((area, index) => {
              const selected = active === index;
              return (
                <li
                  key={area.label}
                  onClick={() => setActive(index)}
                  style={{
                    background: 'var(--color-surface)',
                    padding: selected ? '24px 28px' : '20px 28px',
                    cursor: 'pointer',
                    borderBottom: index > 0 ? 'none' : 'none',
                    borderTop: index === 0 ? 'none' : '1px solid var(--color-border)',
                    transition: 'background 0.2s ease, padding 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background:
                          selected
                            ? 'var(--color-accent-soft)'
                            : 'var(--color-surface-muted)',
                        color:
                          selected
                            ? 'var(--color-accent)'
                            : 'var(--color-muted)',
                        fontWeight: 600,
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      <Icon
                        name={area.icon}
                        style={{ width: 20, height: 20 }}
                      />
                    </span>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: selected
                          ? 'var(--color-ink)'
                          : 'var(--color-ink)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {area.label}
                    </span>
                    <span
                      style={{
                        color: 'var(--color-muted)',
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {area.text}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </TransitionSection>

      {/* forward feeling */}
      <TransitionSection>
        <div
          style={{
            maxWidth: '980px',
            margin: '0 auto',
            padding: '64px 24px 96px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--color-muted)',
              }}
            >
              This place is not finished.
            </p>
            <p
              style={{
                marginTop: '16px',
                fontSize: '1rem',
                lineHeight: 1.65,
                color: 'var(--color-muted)',
              }}
            >
              Some parts are already alive. Some are only beginning. Some are still
              just an idea I keep returning to. That is normal here.
            </p>
            <p
              style={{
                marginTop: '28px',
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: '1rem',
                color: 'var(--color-ink)',
              }}
            >
              If you want to see what I am building, the other pages are waiting.
            </p>
            <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button
                href="/work"
                style={{ background: 'var(--color-accent)', color: '#fff' }}
              >
                Go to work
                <Icon name="arrow-right" style={{ width: 16, height: 16 }} />
              </Button>
              <Button
                variant="secondary"
                style={{ border: '1px solid var(--color-border)', color: 'var(--color-ink)' }}
              >
                Write to me
              </Button>
            </div>
          </motion.div>
        </div>
      </TransitionSection>
    </div>
  );
}
