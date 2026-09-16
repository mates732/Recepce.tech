'use client';

import { motion } from 'framer-motion';
import { TransitionSection } from '@/components/home/Transitions';
import { Icon, type IconName } from '@/components/shared/Icon';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/shared/Button';

type Persona = {
  name: string;
  business: string;
  scene: string;
  accent: string;
  icon: IconName;
  environment: string;
  voice: string;
};

const PERSONAS: Persona[] = [
  {
    name: 'Klára',
    business: 'Kadeřnictví U Matěje',
    scene: 'Zvedá. Odpovídá. Rezervuje.',
    accent: 'var(--color-accent)',
    icon: 'scissors',
    environment: 'warm environment',
    voice: 'Klára is the hairdresser, the daughter, the receptionist. She never loses a call.',
  },
  {
    name: 'David',
    business: 'Barbershop Red Heart',
    scene: 'Short. Direct. Done.',
    accent: 'var(--color-accent)',
    icon: 'razor',
    environment: 'dark energetic environment',
    voice: 'David says yes, no, or later. He says it once.',
  },
  {
    name: 'Eliška',
    business: 'Zubní klinika Denta',
    scene: 'Calm. Precise. Correct.',
    accent: 'var(--color-muted)',
    icon: 'check-circle',
    environment: 'precise clean environment',
    voice: 'Eliška knows the schedule. She knows the answers. She knows when to call.',
  },
  {
    name: 'Sára',
    business: 'Masážní studio Relax',
    scene: 'Soft. Slow. Confirmed.',
    accent: 'var(--color-accent)',
    icon: 'leaf',
    environment: 'calm environment',
    voice: 'Sára does not rush you. She guides you. She closes the reservation.',
  },
  {
    name: 'Tom',
    business: 'Fitness centrum Move',
    scene: 'Quick. Clear. Booked.',
    accent: 'var(--color-accent)',
    icon: 'dumbbell',
    environment: 'energetic environment',
    voice: 'Tom is loud enough. He answers. He books.',
  },
  {
    name: 'Anna',
    business: 'Restaurace U Kozla',
    scene: 'A table. A time. Reserved.',
    accent: 'var(--color-accent)',
    icon: 'utensils',
    environment: 'busy warm environment',
    voice: 'Anna hears the call. She answers. She sets the table.',
  },
];

export function PersonWorlds() {
  return (
    <section style={{ color: 'var(--color-ink)' }}>
      <TransitionSection>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 20px' }}>
          <SectionHeading
            eyebrow="Persona worlds"
            title="Same brand. Different personality."
            description="Each receptionist feels like entering another world. Same company. Different personality."
            size="display"
          />
        </div>
      </TransitionSection>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        <ol style={{ listStyle: 'none', margin: '0', padding: '40px 0 60px' }}>
          {PERSONAS.map((p) => (
            <li
              key={p.name}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(120px, 1fr) 1fr minmax(120px, 1fr)',
                gap: '32px',
                alignItems: 'center',
                marginBottom: '72px',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '24px',
              }}
            >
              {/* left anchor */}
              <div
                aria-hidden="true"
                style={{
                  width: '2px',
                  height: '60px',
                  background: 'var(--color-border)',
                  marginLeft: 'calc(50% - 1px)',
                }}
              />

              {/* persona card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    padding: '24px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--color-accent-soft)',
                        display: 'grid',
                        placeContent: 'center',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: 'var(--color-accent)',
                      }}
                    >
                      {p.name.charAt(0)}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginLeft: '6px' }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          fontSize: '1rem',
                          color: 'var(--color-ink)',
                        }}
                      >
                        {p.name}
                      </p>
                      <p
                        style={{
                          margin: '2px 0 0',
                          color: 'var(--color-muted)',
                          fontSize: '0.85rem',
                        }}
                      >
                        {p.business}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '5px 10px',
                        border: '1px solid var(--color-border)',
                        fontWeight: 500,
                        fontSize: '11px',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--color-muted)',
                      }}
                    >
                      {p.environment}
                    </span>
                    <Icon
                      name={p.icon}
                      style={{ width: 20, height: 20, color: 'var(--color-accent)' }}
                    />
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                      lineHeight: 0.9,
                      letterSpacing: '-0.04em',
                      color: 'var(--color-ink)',
                    }}
                  >
                    {p.scene}
                  </p>
                  <p
                    style={{
                      margin: '0',
                      color: 'var(--color-muted)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      maxWidth: '34ch',
                    }}
                  >
                    {p.voice}
                  </p>
                </div>
              </motion.div>

              {/* right anchor */}
              <div
                aria-hidden="true"
                style={{
                  width: '2px',
                  height: '60px',
                  background: 'var(--color-border)',
                  marginLeft: 'calc(50% - 1px)',
                }}
              />
            </li>
          ))}
        </ol>
      </div>

      <TransitionSection className="max-w-[1000px] mx-auto px-5 pb-20">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
          <Button href="#klara" style={{ background: 'var(--color-accent)', color: '#fff' }}>
            Promluvit si s Klárou
            <Icon name="arrow-right" style={{ width: 16, height: 16 }} />
          </Button>
          <Button href="#david" variant="secondary" style={{ border: '1px solid var(--color-border)' }}>
            David
          </Button>
          <Button href="#eliska" variant="secondary" style={{ border: '1px solid var(--color-border)' }}>
            Eliška
          </Button>
          <Button href="#sara" variant="secondary" style={{ border: '1px solid var(--color-border)' }}>
            Sára
          </Button>
          <Button href="#tom" variant="secondary" style={{ border: '1px solid var(--color-border)' }}>
            Tom
          </Button>
          <Button href="#anna" variant="secondary" style={{ border: '1px solid var(--color-border)' }}>
            Anna
          </Button>
        </div>
      </TransitionSection>
    </section>
  );
}
