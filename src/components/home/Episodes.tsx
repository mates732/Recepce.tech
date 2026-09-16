'use client';

import { motion } from 'framer-motion';
import { TransitionSection } from '@/components/home/Transitions';
import { SectionHeading } from '@/components/shared/SectionHeading';

const EPISODES = [
  {
    tag: 'PŘÍCHOZÍ HOVOR',
    number: '01',
    eyebrow: 'Event',
    title: 'Zvedá Klára.',
    description:
      'Víte, co se stane, když telefon zazvoní ve chvíli, kdy ještě netrapíte? Nikdy to nepoznáte. Klára to pozná. A udělá to za vás.',
  },
  {
    tag: 'KLÁRA ODPOVÍDÁ',
    number: '02',
    eyebrow: 'Answer',
    title: 'Slyší to, co chcete říct.',
    description:
      'Nejen, že zodpoví. Čubbí vám na slovo. Chápe, co jste chtěli říct – i když jste to neřekli úplně dokonale.',
  },
  {
    tag: 'KLÁRA POROZUMÍ',
    number: '03',
    eyebrow: 'Understand',
    title: 'Pozná, co vás zajímá.',
    description:
      'Chce termín. Chce cenu. Chce jen odpověď. Klára vědí, která z těch věcí je pravá. A nepotřebuje vás k tomu nikam volat.',
  },
  {
    tag: 'KLÁRA URHÁŽÍ',
    number: '04',
    eyebrow: 'Action',
    title: 'Provede to za vás.',
    description:
      'Nečeká na vaše volání. Nečeká na vaši schůzku. Nečeká na vaši pozornost. Za vás provede to, co má za úkol.',
  },
  {
    tag: 'SLUCHOVÁ KARTA',
    number: '05',
    eyebrow: 'Record',
    title: 'Pojďte poslouchat.',
    description:
      'Některým hovorům nelze věřit. Jiným věřit nelze. Tady to vidíte – i když je to jen první příklad.',
  },
];

export function Episodes() {
  return (
    <section style={{ color: 'var(--color-ink)' }}>
      <TransitionSection>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 20px' }}>
          <SectionHeading
            eyebrow="Scénář"
            title="Jak se to dělá?
            <br />
            Klára to zná."
            description="Klára zvedne telefon. Zákazník říká. Klára to pozná. Klára to udělá."
            align="left"
            size="display"
          />
        </div>
      </TransitionSection>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        {/* thin editorial timeline line */}
        <div
          aria-hidden="true"
          style={{
            position: 'relative',
            margin: '0 auto',
            width: '2px',
            height: '200px',
            background: 'var(--color-border)',
            transform: 'translateX(-50%)',
            left: '50%',
          }}
        />

        <ol style={{ listStyle: 'none', margin: '0', padding: '40px 0' }}>
          {EPISODES.map((ep) => (
            <li
              key={ep.number}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(180px, 1fr) 1fr minmax(180px, 1fr)',
                gap: '32px',
                alignItems: 'center',
                marginBottom: '80px',
                paddingTop: '20px',
              }}
            >
              {/* left anchor */}
              <div
                aria-hidden="true"
                style={{
                  width: '2px',
                  height: '80px',
                  background: 'var(--color-border)',
                  marginLeft: 'calc(50% - 1px)',
                }}
              />

              {/* episode body */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    border: '1px solid var(--color-border)',
                    fontWeight: 500,
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted)',
                  }}
                >
                  {ep.eyebrow}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: 'clamp(2.4rem, 10vw, 6rem)',
                    lineHeight: 0.9,
                    letterSpacing: '-0.04em',
                    marginTop: '14px',
                  }}
                >
                  {ep.title}
                </span>
                <p
                  style={{
                    marginTop: '18px',
                    maxWidth: '32ch',
                    color: 'var(--color-muted)',
                    fontSize: '1.05rem',
                    lineHeight: 1.6,
                  }}
                >
                  {ep.description}
                </p>
              </motion.div>

              {/* right anchor */}
              <div
                aria-hidden="true"
                style={{
                  width: '2px',
                  height: '80px',
                  background: 'var(--color-border)',
                  marginLeft: 'calc(50% - 1px)',
                }}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
