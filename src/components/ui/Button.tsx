"use client";

import { forwardRef, type ReactNode, type ButtonHTMLAttributes, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { typography, colors, radius } from "@/design/tokens";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", className, style, ...props }, ref) => {
    const [glow, setGlow] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btnRef.current.style.setProperty("--glow-x", `${x}px`);
      btnRef.current.style.setProperty("--glow-y", `${y}px`);
      setGlow(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setGlow(false);
    }, []);

    const variantStyles = {
      primary: {
        background: colors.accent,
        color: colors.bg,
        border: "none",
      },
      secondary: {
        background: "transparent",
        color: colors.secondary,
        border: `1px solid ${colors.border}`,
      },
      ghost: {
        background: "transparent",
        color: colors.muted,
        border: "none",
      },
    };

    const sizeStyles = {
      sm: {
        padding: "8px 16px",
        fontSize: typography.size.bodySm,
      },
      md: {
        padding: "12px 24px",
        fontSize: typography.size.body,
      },
      lg: {
        padding: "16px 32px",
        fontSize: typography.size.bodyLg,
      },
    };

    const baseStyle: React.CSSProperties = {
      fontFamily: typography.fontFamily.body,
      fontWeight: typography.weight.medium,
      letterSpacing: typography.letterSpacing.normal,
      borderRadius: radius.md,
      cursor: "pointer",
      transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
      position: "relative",
      overflow: "hidden",
      ...variantStyles[variant],
      ...sizeStyles[size],
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{ display: "inline-flex" }}
      >
        <button
          ref={(node) => {
            (btnRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          className={className}
          style={{
            ...baseStyle,
            ...style,
            "--glow-x": "50%",
            "--glow-y": "50%",
          } as React.CSSProperties}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          {variant === "primary" && (
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: glow ? 0.12 : 0,
                background: "radial-gradient(circle 80px at var(--glow-x) var(--glow-y), rgba(255,255,255,0.18), transparent)",
                transition: "opacity 200ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          )}
          {variant === "primary" && (
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
                backgroundSize: "200% 200%",
                animation: "shimmer 4s ease infinite",
              }}
            />
          )}
          <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
        </button>
      </motion.div>
    );
  }
);

Button.displayName = "Button";

export default Button;
