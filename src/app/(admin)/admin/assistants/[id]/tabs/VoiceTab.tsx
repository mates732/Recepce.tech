'use client';

import { useState } from 'react';
import { Badge, Button, Field, inputClass } from '@/components/admin/ui';
import { Icon } from '@/components/shared/Icon';
import type { Assistant } from '@/data/ops';

const SENSITIVITY_LABELS: Record<string, string> = {
  low: 'Nízká',
  medium: 'Střední',
  high: 'Vysoká',
};

export default function VoiceTab({ assistant }: { assistant: Assistant }) {
  const [voice, setVoice] = useState(assistant.voice);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof typeof voice>(key: K, value: (typeof voice)[K]) {
    setVoice((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    // TODO(backend): uložit konfiguraci hlasu
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-semibold text-ink">Hlas a jazyk</h2>
        <p className="mt-0.5 text-sm text-muted">
          Jak asistent zní a jak rychle reaguje na vstup volajícího.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Poskytovatel hlasu">
          <select
            className={inputClass}
            value={voice.provider}
            onChange={(e) => update('provider', e.target.value)}
          >
            <option value="11labs">11labs</option>
            <option value="azure">Azure Speech</option>
            <option value="google">Google Cloud TTS</option>
            <option value="deepgram">Deepgram Aura</option>
          </select>
        </Field>

        <Field label="Hlas">
          <select
            className={inputClass}
            value={voice.voice}
            onChange={(e) => update('voice', e.target.value)}
          >
            <option value="Antonín (český mužský, přirozený)">Antonín — mužský, přirozený</option>
            <option value="Zdeňka (česká ženská, klidná)">Zdeňka — ženská, klidná</option>
            <option value="Josef (český mužský, formální)">Josef — mužský, formální</option>
          </select>
        </Field>

        <Field label="Jazyk">
          <select
            className={inputClass}
            value={voice.language}
            onChange={(e) => update('language', e.target.value)}
          >
            <option value="čeština (cs-CZ)">čeština (cs-CZ)</option>
            <option value="angličtina (en-US)">angličtina (en-US)</option>
            <option value="němčina (de-DE)">němčina (de-DE)</option>
          </select>
        </Field>

        <Field label="Mluvený styl" hint="Popis tempa a tónu — předává se do promptu.">
          <input
            className={inputClass}
            value={voice.speakingStyle}
            onChange={(e) => update('speakingStyle', e.target.value)}
          />
        </Field>
      </div>

      <Field label="Citlivost přerušení" hint="Jak snadno volající přerovná asistenta v řeči.">
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => update('interruptionSensitivity', level)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                voice.interruptionSensitivity === level
                  ? 'border-accent bg-accent text-accent-bright'
                  : 'border-border bg-surface text-ink hover:bg-surface-muted'
              }`}
            >
              {SENSITIVITY_LABELS[level]}
            </button>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <Button onClick={handleSave}>
          <Icon name="check" className="h-4 w-4" />
          Uložit hlas
        </Button>
        {saved && <Badge tone="positive">Uloženo</Badge>}
      </div>
    </div>
  );
}
