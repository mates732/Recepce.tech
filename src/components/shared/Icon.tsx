import type { ReactNode, SVGProps } from 'react';

export type IconName =
  | 'phone'
  | 'phone-call'
  | 'phone-off'
  | 'clock'
  | 'calendar'
  | 'calendar-check'
  | 'check'
  | 'check-circle'
  | 'user'
  | 'user-check'
  | 'zap'
  | 'trending-up'
  | 'message-circle'
  | 'arrow-right'
  | 'play'
  | 'mail'
  | 'menu'
  | 'x'
  | 'pencil'
  | 'building'
  | 'scissors'
  | 'smile'
  | 'utensils'
  | 'leaf'
  | 'dumbbell'
  | 'razor'
  | 'globe'
  | 'code'
  | 'smartphone'
  | 'search'
  | 'wrench'
  | 'lock'
  | 'bolt'
  | 'camera';

const PATHS: Record<IconName, ReactNode> = {
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  'phone-call': (
    <>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      <path d="M15.05 5A5 5 0 0 1 19 8.95" />
      <path d="M13.03 7.96A3 3 0 0 1 16.04 11" />
    </>
  ),
  'phone-off': (
    <>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      <path d="M3 3l18 18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
      <path d="M8 2.5v4" />
      <path d="M16 2.5v4" />
      <path d="M3 10h18" />
    </>
  ),
  'calendar-check': (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" />
      <path d="M8 2.5v4" />
      <path d="M16 2.5v4" />
      <path d="M3 10h18" />
      <path d="M9.5 16l2 2 3.5-3.5" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="7.5" r="4" />
      <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
    </>
  ),
  'user-check': (
    <>
      <circle cx="12" cy="7.5" r="4" />
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <path d="M16 11l2 2 4-4" />
    </>
  ),
  zap: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  'trending-up': (
    <>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </>
  ),
  'message-circle': <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />,
  'arrow-right': (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  play: <path d="M6 3.5v17l14-8.5z" />,
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6.5h16" />
      <path d="M4 12h16" />
      <path d="M4 17.5h16" />
    </>
  ),
  x: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  pencil: <path d="M16.5 3.5a2.8 2.8 0 1 1 4 4L7 21l-5 1 1-5z" />,
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9.5 21v-3.5h5V21" />
      <path d="M8.5 7.5h2" />
      <path d="M13.5 7.5h2" />
      <path d="M8.5 11.5h2" />
      <path d="M13.5 11.5h2" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.12 15.88" />
      <path d="M14.47 14.48L20 20" />
      <path d="M8.12 8.12L12 12" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14.5s1.5 2.5 4 2.5 4-2.5 4-2.5" />
      <path d="M9 9.5h.01" />
      <path d="M15 9.5h.01" />
    </>
  ),
  utensils: (
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  dumbbell: (
    <>
      <rect x="2.5" y="8" width="3.5" height="8" rx="1.2" />
      <rect x="18" y="8" width="3.5" height="8" rx="1.2" />
      <path d="M6.5 12h11" />
    </>
  ),
  razor: (
    <>
      <path d="M12 3l9 9-9 9-9-9z" />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  code: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
  smartphone: <rect x="5" y="2" width="14" height="20" rx="2" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </>
  ),
  wrench: (
    <>
      <path d="m14.7 2.3 7 10.2a1 1 0 0 1-1.4 1.4L12 14.6l-2.3 2.3a1 1 0 0 1-1.4-1.4l7-10.2a1 1 0 0 1 1.4 0z" />
      <path d="M12 12 18 6" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  bolt: (
    <>
      <path d="m13 2 8 10-5 4-8-10 5-4Z" />
    </>
  ),
  camera: (
    <>
      <path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5l-2 -3z" />
      <circle cx="12" cy="13" r="3" />
    </>
  ),
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name?: IconName;
  icon?: ReactNode;
}

export function Icon({ name, icon, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {icon ? icon : name ? PATHS[name] : null}
    </svg>
  );
}
