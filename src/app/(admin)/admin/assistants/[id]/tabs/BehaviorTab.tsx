'use client';

import { useState } from 'react';
import { Badge, Button, Field, inputClass } from '@/components/admin/ui';
import { Icon } from '@/components/shared/Icon';
import type { Assistant } from '@/data/ops';

export default function BehaviorTab({ assistant }: { assistant: Assistant }) {
  const [behavior, setBehavior] = useState(assistant.behavior);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof typeof behavior>(key: K, value: (typeof behavior)[K]) {
    setBehavior((b) => ({ ...b, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    // TODO(backend): uložit konfiguraci chování
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-semibold text-ink">Chování hovoru</h2>
        <p className="mt-0.5 text-sm text-muted">
          Co asistent říká a kdy hovor ukončí nebo předá člověku.
        </p>
      </div>

      <Field label="Uvítání" hint="První věta, kterou volající uslyší.">
        <textarea
          className={`${inputClass} min-h-[72px] resize-y`}
          value={behavior.greeting}
          onChange={(e) => update('greeting', e.target.value)}
        />
      </Field>

      <Field label="Chování při nejistotě" hint="Odpověď, když asistent nezná odpověď.">
        <textarea
          className={`${inputClass} min-h-[72px] resize-y`}
          value={behavior.fallback}
          onChange={(e) => update('fallback', e.target.value)}
        />
      </Field>

      <Field label="Předání člověku" hint="Co asistent říká těsně před přepojením.">
        <textarea
          className={`${inputClass} min-h-[72px] resize-y`}
          value={behavior.humanHandoff}
          onChange={(e) => update('humanHandoff', e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Maximální délka konverzace (s)" hint="Hovor se ukončí po uplynutí limitu.">
          <input
            type="number"
            min={60}
            max={3600}
            step={30}
            className={inputClass}
            value={behavior.maxConversationLengthSec}
            onChange={(e) => update('maxConversationLengthSec', Number(e.target.value))}
          />
        </Field>

        <Field label="Tichový timeout (s)" hint="Po této pauze se asistent ozve.">
          <input
            type="number"
            min={5}
            max={60}
            step={1}
            className={inputClass}
            value={behavior.silenceTimeoutSec}
            onChange={(e) => update('silenceTimeoutSec', Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button onClick={handleSave}>
          <Icon name="check" className="h-4 w-4" />
          Uložit chování
        </Button>
        {saved && <Badge tone="positive">Uloženo</Badge>}
      </div>
    </div>
  );
}
