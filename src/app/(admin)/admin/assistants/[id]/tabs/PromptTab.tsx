'use client';

import { useState } from 'react';
import { Button } from '@/components/admin/ui';
import { Icon } from '@/components/shared/Icon';
import type { Assistant } from '@/data/ops';

export default function PromptTab({ assistant }: { assistant: Assistant }) {
  const [prompt, setPrompt] = useState(assistant.systemPrompt);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    // TODO(backend): uložit přes PATCH /api/admin/assistants/[id]
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink">Systémový prompt</h2>
          <p className="mt-0.5 text-sm text-muted">
            Definuje roli, styl a hranice asistenta. Ukládá se jako verze, aktivní je poslední.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs tabular-nums text-muted">
            {prompt.length.toLocaleString('cs-CZ')} znaků
          </span>
          <Button onClick={handleSave} disabled={saving}>
            <Icon name="check" className="h-4 w-4" />
            {saving ? 'Ukládám…' : saved ? 'Uloženo' : 'Uložit prompt'}
          </Button>
        </div>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          setSaved(false);
        }}
        spellCheck={false}
        rows={22}
        className="w-full resize-y rounded-xl border border-border bg-surface-muted/50 p-5 font-mono text-[13px] leading-relaxed text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
        aria-label="Systémový prompt asistenta"
      />

      <p className="text-xs text-muted">
        Prompt se předává do Vapi při dalším nasazení asistentu. Změny v chování
        nejdřív otestujte v panelu <strong>Test</strong>.
      </p>
    </div>
  );
}
