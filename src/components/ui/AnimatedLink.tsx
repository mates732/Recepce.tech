"use client";

import { forwardRef, type ReactNode } from "react";
import Link from "next/link";
import { typography, colors, duration, ease } from "@/design/tokens";

interface AnimatedLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  showArrow?: boolean;
}

const AnimatedLink = forwardRef<HTMLAnchorElement, AnimatedLinkProps>(
  ({ children, href, className, showArrow }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={`group inline-flex items-center gap-3 ${className ?? ""}`}
        style={{
          color: "rgba(160,160,160,0.6)",
          transition: `color ${duration.slow} ${ease.default}, text-shadow ${duration.slow} ${ease.default}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.primary;
          e.currentTarget.style.textShadow = "0 0 24px rgba(102,102,102,0.14)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(160,160,160,0.6)";
          e.currentTarget.style.textShadow = "none";
        }}
      >
        <span
          className="font-body"
          style={{
            fontSize: typography.size.body,
            fontWeight: typography.weight.medium,
            letterSpacing: typography.letterSpacing.normal,
          }}
        >
          {children}
        </span>
        {showArrow && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="transition-transform duration-500 ease-out will-change-transform group-hover:translate-x-1"
          >
            <path d="M3 7h8M7 3l4 4-4 4" />
          </svg>
        )}
      </Link>
    );
  }
);

AnimatedLink.displayName = "AnimatedLink";

export default AnimatedLink;
