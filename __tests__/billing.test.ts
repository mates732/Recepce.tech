import {
  calculateBillableMinutes,
  calculateUsage,
  getUsageStatus,
  formatCurrency,
} from '@/lib/billing/calculations';

describe('calculateBillableMinutes', () => {
  it('0 seconds -> 0 minutes', () => {
    expect(calculateBillableMinutes(0)).toBe(0);
  });

  it('1 second -> 1 minute', () => {
    expect(calculateBillableMinutes(1)).toBe(1);
  });

  it('59 seconds -> 1 minute', () => {
    expect(calculateBillableMinutes(59)).toBe(1);
  });

  it('60 seconds -> 1 minute', () => {
    expect(calculateBillableMinutes(60)).toBe(1);
  });

  it('61 seconds -> 2 minutes', () => {
    expect(calculateBillableMinutes(61)).toBe(2);
  });

  it('120 seconds -> 2 minutes', () => {
    expect(calculateBillableMinutes(120)).toBe(2);
  });

  it('121 seconds -> 3 minutes', () => {
    expect(calculateBillableMinutes(121)).toBe(3);
  });

  it('negative seconds -> 0 minutes', () => {
    expect(calculateBillableMinutes(-10)).toBe(0);
  });
});

describe('calculateUsage', () => {
  it('300 included, 0 used -> 0 overage', () => {
    const result = calculateUsage(300, 0, 2990, 6);
    expect(result.overageMinutes).toBe(0);
    expect(result.overageAmount).toBe(0);
    expect(result.estimatedTotal).toBe(2990);
    expect(result.usagePercentage).toBe(0);
    expect(result.minutesRemaining).toBe(300);
  });

  it('300 included, 300 used -> 0 overage', () => {
    const result = calculateUsage(300, 300, 2990, 6);
    expect(result.overageMinutes).toBe(0);
    expect(result.overageAmount).toBe(0);
    expect(result.estimatedTotal).toBe(2990);
    expect(result.usagePercentage).toBe(100);
    expect(result.minutesRemaining).toBe(0);
  });

  it('300 included, 301 used -> 1 overage', () => {
    const result = calculateUsage(300, 301, 2990, 6);
    expect(result.overageMinutes).toBe(1);
    expect(result.overageAmount).toBe(6);
    expect(result.estimatedTotal).toBe(2996);
    expect(result.usagePercentage).toBe(100);
    expect(result.minutesRemaining).toBe(0);
  });

  it('300 included, 327 used -> 27 overage', () => {
    const result = calculateUsage(300, 327, 2990, 6);
    expect(result.overageMinutes).toBe(27);
    expect(result.overageAmount).toBe(162);
    expect(result.estimatedTotal).toBe(3152);
    expect(result.usagePercentage).toBe(109);
    expect(result.minutesRemaining).toBe(0);
  });

  it('0 included, any usage -> all overage', () => {
    const result = calculateUsage(0, 50, 2990, 6);
    expect(result.overageMinutes).toBe(50);
    expect(result.overageAmount).toBe(300);
    expect(result.estimatedTotal).toBe(3290);
  });

  it('large usage correctly calculated', () => {
    const result = calculateUsage(300, 1000, 2990, 6);
    expect(result.overageMinutes).toBe(700);
    expect(result.overageAmount).toBe(4200);
    expect(result.estimatedTotal).toBe(7190);
  });
});

describe('getUsageStatus', () => {
  it('< 70% = normal', () => {
    expect(getUsageStatus(50)).toBe('normal');
    expect(getUsageStatus(69)).toBe('normal');
  });

  it('70-89% = warning', () => {
    expect(getUsageStatus(70)).toBe('warning');
    expect(getUsageStatus(89)).toBe('warning');
  });

  it('90-99% = near_limit', () => {
    expect(getUsageStatus(90)).toBe('near_limit');
    expect(getUsageStatus(99)).toBe('near_limit');
  });

  it('>= 100% = overage', () => {
    expect(getUsageStatus(100)).toBe('overage');
    expect(getUsageStatus(110)).toBe('overage');
    expect(getUsageStatus(200)).toBe('overage');
  });
});

describe('formatCurrency', () => {
  it('formats CZK correctly', () => {
    const result = formatCurrency(2990);
    expect(result).toContain('2 990');
    expect(result).toContain('Kč');
  });

  it('formats 0 correctly', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });
});