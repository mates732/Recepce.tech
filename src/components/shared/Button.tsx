import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark';
type Size = 'md' | 'lg';

interface ButtonProps {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  onClick?: () => void;
  'aria-label'?: string;
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 select-none whitespace-nowrap';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-bright hover:bg-accent-hover shadow-sm',
  secondary:
    'bg-surface text-ink border border-border-strong hover:border-ink/40 hover:bg-surface-muted',
  ghost: 'text-accent hover:bg-accent-soft',
  onDark: 'text-ink border border-border/20 hover:bg-surface-soft',
};

const SIZES: Record<Size, string> = {
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-[15px]',
};

export function Button({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  style,
  children,
  onClick,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const styleAttr = style ?? undefined;

  if (!href) {
    return (
      <button type="button" onClick={onClick} className={classes} aria-label={ariaLabel} style={styleAttr}>
        {children}
      </button>
    );
  }

  const isExternal = href.startsWith('http') || href.startsWith('mailto');

  if (isExternal) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel} style={styleAttr}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel} style={styleAttr}>
      {children}
    </Link>
  );
}