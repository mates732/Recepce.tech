import { SectionHeading } from '@/components/shared/SectionHeading';
import { Icon, type IconName } from '@/components/shared/Icon';

interface PersonaWorld {
  name: string;
  role: string;
  environment: string;
  accent: string;
  icon: IconName;
  scene: string;
}

const WORLD_PRINTERS: PersonaWorld[] = [
  {
    name: 'Klára',
    role: 'Hair salon receptionist',
    environment: 'warm environment',
    accent: 'var(--color-accent)',
    icon: 'scissors',
    scene: 'Zvedá. Odpovídá. Rezervuje.',
  },
  {
    name: 'David',
    role: 'Barbershop receptionist',
    environment: 'dark energetic environment',
    accent: 'var(--color-accent)',
    icon: 'razor',
    scene: 'Short. Direct. Done.',
  },
  {
    name: 'Eliška',
    role: 'Dental clinic receptionist',
    environment: 'precise clean environment',
    accent: 'var(--color-muted)',
    icon: 'check-circle',
    scene: 'Calm. Precise. Correct.',
  },
  {
    name: 'Sára',
    role: 'Massage studio receptionist',
    environment: 'calm environment',
    accent: 'var(--color-accent)',
    icon: 'leaf',
    scene: 'Soft. Slow. Confirmed.',
  },
  {
    name: 'Tom',
    role: 'Fitness receptionist',
    environment: 'energetic environment',
    accent: 'var(--color-accent)',
    icon: 'dumbbell',
    scene: 'Quick. Clear. Booked.',
  },
  {
    name: 'Anna',
    role: 'Restaurant receptionist',
    environment: 'busy warm environment',
    accent: 'var(--color-accent)',
    icon: 'utensils',
    scene: 'A table. A time. Reserved.',
  },
];

export function SystemsWorlds() {
  return (
    <section id="klara" className="bg-[var(--color-ink)] text-ink">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Persona worlds"
          title="Different personalities. Same brand."
          description="Each receptionist feels like entering another world. Same company. Different personality."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WORLD_PRINTERS.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border border-border bg-surface-muted p-5 transition:transform 0.2s ease"
              style={{ '--persona-accent': p.accent } as React.CSSProperties}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-muted text-sm font-semibold">
                    {p.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-faint">{p.role}</p>
                  </div>
                </div>
                <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-muted">
                  {p.accent}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface-muted">
                  <Icon name={p.icon} className="h-4 w-4 text-ink-2" />
                </span>
                <p className="text-xs text-faint">{p.environment}</p>
              </div>
              <p className="mt-4 text-xs italic text-faint">{p.scene}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted">
            Same brand · Different personality
          </span>
        </div>
      </div>
    </section>
  );
}
