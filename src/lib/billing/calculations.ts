export function calculateBillableMinutes(durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  return Math.ceil(durationSeconds / 60);
}

export interface UsageCalculation {
  includedMinutes: number;
  usedMinutes: number;
  overageMinutes: number;
  overageAmount: number;
  estimatedTotal: number;
  usagePercentage: number;
  minutesRemaining: number;
}

export function calculateUsage(
  includedMinutes: number,
  usedMinutes: number,
  monthlyPrice: number,
  overagePricePerMinute: number
): UsageCalculation {
  const overageMinutes = Math.max(0, usedMinutes - includedMinutes);
  const overageAmount = overageMinutes * overagePricePerMinute;
  const estimatedTotal = monthlyPrice + overageAmount;
  const usagePercentage = includedMinutes > 0 ? Math.round((usedMinutes / includedMinutes) * 100) : 0;
  const minutesRemaining = Math.max(0, includedMinutes - usedMinutes);

  return {
    includedMinutes,
    usedMinutes,
    overageMinutes,
    overageAmount,
    estimatedTotal,
    usagePercentage,
    minutesRemaining,
  };
}

export function getUsageStatus(usagePercentage: number): 'normal' | 'warning' | 'near_limit' | 'overage' {
  if (usagePercentage >= 100) return 'overage';
  if (usagePercentage >= 90) return 'near_limit';
  if (usagePercentage >= 70) return 'warning';
  return 'normal';
}

export function formatCurrency(amount: number, currency = 'CZK'): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMinutes(minutes: number): string {
  return new Intl.NumberFormat('cs-CZ').format(minutes);
}