import { Button } from '@/components/shared/Button';
import { Icon } from '@/components/shared/Icon';
import { SectionHeading } from '@/components/shared/SectionHeading';

const DEMO_URL = 'https://www.recepce.tech/cs/demo';

export function Systems() {
  return (
    <section id="systems" className="bg-surface py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Systems"
          title="A practice. A pattern. A working surface."
          description="This is a placeholder built from modular content. Real systems belong here."
        />

        <div className="mt-10 flex flex-col items-center justify-center gap-6">
          <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-surface-muted px-4 py-3 text-sm text-ink">
            <Icon name="pencil" className="h-4 w-4 text-muted" />
            Placeholder system
          </div>
          <Button href={DEMO_URL} size="lg">Vyzkoušet demo</Button>
        </div>
      </div>
    </section>
  );
}
