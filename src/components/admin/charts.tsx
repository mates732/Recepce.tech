'use client';

import { useMemo } from 'react';

export interface SeriesPoint {
  label: string;
  value: number;
}

/**
 * Lehký SVG sloupcový graf — bez externí knihovny, v duchu design systému
 * (restraint, žádné gradienty). Autoscale podle maxima, hover title
 * pro přesnou hodnotu.
 */
export function BarChart({
  data,
  height = 180,
  unit = '',
  ariaLabel,
}: {
  data: SeriesPoint[];
  height?: number;
  unit?: string;
  ariaLabel?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="w-full overflow-x-auto"
    >
      <div className="flex min-w-full items-end gap-[3px]" style={{ height }}>
        {data.map((d, i) => (
          <div
            key={`${d.label}-${i}`}
            className="group relative flex h-full min-w-[6px] flex-1 flex-col justify-end"
            title={`${d.label}: ${d.value}${unit ? ` ${unit}` : ''}`}
          >
            <div
              className="w-full rounded-t-[3px] bg-accent/85 transition-colors group-hover:bg-accent"
              style={{ height: `${Math.max(3, (d.value / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      {data.length > 0 && (
        <div className="mt-2 flex min-w-full justify-between text-[10px] text-muted tabular-nums">
          <span>{data[0].label}</span>
          <span>{data[data.length - 1].label}</span>
        </div>
      )}
    </div>
  );
}

/**
 * SVG čárový graf s plochou — pro týdenní trendy.
 */
export function AreaChart({
  data,
  height = 180,
  unit = '',
  ariaLabel,
}: {
  data: SeriesPoint[];
  height?: number;
  unit?: string;
  ariaLabel?: string;
}) {
  const width = 560;
  const pad = 6;
  const max = Math.max(1, ...data.map((d) => d.value));

  const points = useMemo(() => {
    if (data.length === 0) return [] as Array<[number, number]>;
    const stepX = (width - pad * 2) / Math.max(1, data.length - 1);
    return data.map((d, i) => [
      pad + i * stepX,
      height - pad - (d.value / max) * (height - pad * 2),
    ] as [number, number]);
  }, [data, height, max]);

  if (data.length === 0) {
    return <div className="text-sm text-muted">Žádná data.</div>;
  }

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1][0]},${height - pad} L${points[0][0]},${height - pad} Z`;
  const last = data[data.length - 1];

  return (
    <div role="img" aria-label={ariaLabel} className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        <path d={areaPath} fill="var(--color-surface-muted)" opacity={0.55} />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={points[points.length - 1][0]}
          cy={points[points.length - 1][1]}
          r={3.5}
          fill="var(--color-accent)"
        />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-muted tabular-nums">
        <span>{data[0].label}</span>
        <span>
          {last.label}: {last.value}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
    </div>
  );
}

/**
 * Prstencový graf pro rozpad výsledků hovorů.
 */
export function DonutChart({
  segments,
  size = 168,
  centerLabel,
  centerValue,
  ariaLabel,
}: {
  segments: Array<{ label: string; value: number; colorVar: string }>;
  size?: number;
  centerLabel?: string;
  centerValue?: string;
  ariaLabel?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;

  // Předpočítané ofsety oblouků — React Compiler odmítá reassign po renderu.
  const arcs = segments.reduce<Array<{ label: string; dash: number; offset: number }>>(
    (acc, seg) => {
      const prev = acc[acc.length - 1];
      const dash = (seg.value / total) * circumference;
      const offset = prev ? prev.offset + prev.dash : 0;
      acc.push({ label: seg.label, dash, offset });
      return acc;
    },
    []
  );

  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="relative" style={{ width: size, height: size }} role="img" aria-label={ariaLabel}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-surface-muted)"
            strokeWidth={16}
          />
          {segments.map((seg, i) => {
            const arc = arcs[i];
            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.colorVar}
                strokeWidth={16}
                strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
                strokeDashoffset={-arc.offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-ink tabular-nums">{centerValue}</span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted">{centerLabel}</span>
        </div>
      </div>
      <ul className="space-y-2">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2.5 text-sm">
            <span
              className="inline-block h-2.5 w-2.5 rounded-[3px]"
              style={{ background: seg.colorVar }}
            />
            <span className="text-ink">{seg.label}</span>
            <span className="text-muted tabular-nums">
              {seg.value} ({Math.round((seg.value / total) * 100)} %)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
