import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
  size?: 'default' | 'display';
  /** Legacy usage — renders raw content with the old styling. */
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  dark = false,
  className = '',
  size = 'default',
  children,
}: SectionHeadingProps) {
  // Legacy usage: children-only
  if (children !== undefined && title === undefined) {
    return (
      <div className={`text-lg font-light tracking-tight text-black ${className}`}>
        {children}
      </div>
    );
  }

  const displayClass =
    size === 'display' ? 'text-balance text-balance text-balance text-balance' : '';

  return (
    <div
      className={`${
        align === 'center' ? 'mx-auto text-center' : 'text-left'
      } max-w-3xl ${className}`}
    >
      {eyebrow && (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${
            dark ? 'text-accent-bright' : 'text-accent'
          }`}
        >
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          className={`mt-4 ${
            size === 'display'
              ? 'leading-[0.92] tracking-[-0.04em]'
              : 'leading-tight tracking-[-0.02em]'
          } text-3xl font-semibold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] ${
            dark ? 'text-ink' : 'text-ink'
          } ${displayClass}`}
          style={
            size === 'display'
              ? { fontSize: 'clamp(2.6rem, 10vw, 6.4rem)' }
              : undefined
          }
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className={`text-balance mt-5 text-base leading-relaxed sm:text-lg ${
            dark ? 'text-slate-400' : 'text-muted'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
