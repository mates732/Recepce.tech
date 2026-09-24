'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Přihlášení selhalo');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Chyba připojení k serveru');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-surface">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Recepce.tech Admin</h1>
          <h2 className="mt-3 text-3xl font-semibold leading-[1.1] text-ink">Přihlášení</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">
              Heslo
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-border bg-surface text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Zadejte admin heslo"
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Přihlašování…' : 'Přihlásit se'}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-muted">
          Pouze pro interní použití Recepce.tech
        </p>
      </div>
    </main>
  );
}