'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';

interface FormData {
  name: string;
  slug: string;
  contactName: string;
  contactEmail: string;
  monthlyPrice: string;
  includedMinutes: string;
  overagePricePerMinute: string;
  vapiAssistantId: string;
  phoneNumberId: string;
}

export default function NewClientPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: '',
    slug: '',
    contactName: '',
    contactEmail: '',
    monthlyPrice: '2990',
    includedMinutes: '300',
    overagePricePerMinute: '6',
    vapiAssistantId: '',
    phoneNumberId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'stripe' | 'done'>('form');
  const [stripeResult, setStripeResult] = useState<string>('');

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Vytvoření selhalo');
        return;
      }

      if (data.stripeCustomerId) {
        setStep('stripe');
        setStripeResult(data.stripeMessage ?? 'Stripe zákazník a předplatné vytvořeno.');
      } else {
        setStep('done');
      }
    } catch {
      setError('Chyba připojení k serveru');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">Vytvořit klienta</h1>
        <p className="mt-1 text-muted">Nový klient s Vapi asistentem a Stripe předplatným</p>
      </div>

      {step === 'done' ? (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6">
          <h2 className="text-lg font-semibold text-emerald-700">Klient vytvořen</h2>
          <p className="mt-2 text-emerald-600">{form.name} byl úspěšně vytvořen.</p>
          <Button href="/admin/billing/clients" variant="primary" className="mt-4">
            Zobrazit klienty
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <fieldset disabled={step === 'stripe' || loading} className="space-y-6">
            <legend className="sr-only">Základní informace</legend>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">Název klienta *</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-surface text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Např. Textil Ludmila"
                />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-ink mb-2">Slug *</label>
                <input
                  id="slug"
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-surface text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="napr-tytul"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-ink mb-2">Kontaktní osoba</label>
                <input
                  id="contactName"
                  type="text"
                  value={form.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-surface text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-ink mb-2">E-mail kontaktu</label>
                <input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-surface text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="monthlyPrice" className="block text-sm font-medium text-ink mb-2">Měsíční cena (Kč)</label>
                <input
                  id="monthlyPrice"
                  type="number"
                  min="0"
                  required
                  value={form.monthlyPrice}
                  onChange={(e) => handleChange('monthlyPrice', e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-surface text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="includedMinutes" className="block text-sm font-medium text-ink mb-2">Zahrnuto minut</label>
                <input
                  id="includedMinutes"
                  type="number"
                  min="0"
                  required
                  value={form.includedMinutes}
                  onChange={(e) => handleChange('includedMinutes', e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-surface text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="overagePricePerMinute" className="block text-sm font-medium text-ink mb-2">Nadlimit (Kč/min)</label>
                <input
                  id="overagePricePerMinute"
                  type="number"
                  min="0"
                  required
                  value={form.overagePricePerMinute}
                  onChange={(e) => handleChange('overagePricePerMinute', e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-surface text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="vapiAssistantId" className="block text-sm font-medium text-ink mb-2">Vapi Assistant ID *</label>
                <input
                  id="vapiAssistantId"
                  type="text"
                  required
                  value={form.vapiAssistantId}
                  onChange={(e) => handleChange('vapiAssistantId', e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-surface text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="UUID"
                />
                <p className="mt-1 text-xs text-muted">Vapi asistent ID propojený s tímto klientem</p>
              </div>
              <div>
                <label htmlFor="phoneNumberId" className="block text-sm font-medium text-ink mb-2">Vapi Phone Number ID</label>
                <input
                  id="phoneNumberId"
                  type="text"
                  value={form.phoneNumberId}
                  onChange={(e) => handleChange('phoneNumberId', e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-border bg-surface text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Volitelné"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Vytvářím…' : step === 'stripe' ? 'Vytvářím Stripe…' : 'Vytvořit klienta'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push('/admin/billing/clients')}>
              Zrušit
            </Button>
          </div>

          {step === 'stripe' && stripeResult && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6">
              <h2 className="text-lg font-semibold text-emerald-700">Stripe vytvořeno</h2>
              <p className="mt-2 text-emerald-600">{stripeResult}</p>
              <Button href="/admin/billing/clients" variant="primary" className="mt-4">
                Zobrazit klienty
              </Button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}