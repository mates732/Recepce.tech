/**
 * Sdílené formátovací pomůcky pro provozní dashboard.
 * Čeština jako výchozí locale, vše bez závislostí.
 */

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return '—';
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m === 0) return `${s} s`;
  return `${m}:${String(s).padStart(2, '0')} min`;
}

export function formatMinutesShort(minutes: number): string {
  return new Intl.NumberFormat('cs-CZ').format(minutes);
}

/** Středa 20. 8. 2025 · 10:24 */
export function formatDateTimeCz(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('cs-CZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/** 20. 8. 2025, 10:24 */
export function formatShortDateTimeCz(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/** dnes · 10:24 / včera · 16:02 / 18. 8. · 09:15 */
export function formatRelativeCz(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(now) - startOfDay(d)) / 86_400_000);

  const time = new Intl.DateTimeFormat('cs-CZ', { hour: '2-digit', minute: '2-digit' }).format(d);
  if (dayDiff === 0) return `dnes · ${time}`;
  if (dayDiff === 1) return `včera · ${time}`;
  if (dayDiff < 7) {
    const weekday = new Intl.DateTimeFormat('cs-CZ', { weekday: 'short' }).format(d);
    return `${weekday} · ${time}`;
  }
  const dayMonth = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric' }).format(d);
  return `${dayMonth} · ${time}`;
}

export function formatPhoneCz(phone: string): string {
  const digits = phone.replace(/\s/g, '');
  if (/^\+420\d{9}$/.test(digits)) {
    return `+420 ${digits.slice(4, 7)} ${digits.slice(7, 10)} ${digits.slice(10)}`;
  }
  return phone;
}

export function formatPercent(value: number, digits = 0): string {
  return `${new Intl.NumberFormat('cs-CZ', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)} %`;
}
