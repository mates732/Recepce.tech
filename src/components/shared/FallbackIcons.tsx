import type { ReactNode } from 'react';

export const FALLBACK_PATHS: Record<string, ReactNode> = {
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
  bolt: <path d="m13 2 8 10-5 4-8-10 5-4Z" />,
};
