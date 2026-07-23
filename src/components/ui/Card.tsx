"use client";

import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { colors, radius } from "@/design/tokens";
import { fadeInUp, transitions, viewportConfig } from "@/design/animations";
import { useCardTilt } from "@/hooks/useCardTilt";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hover = true }, ref) => {
    const {
      ref: tiltRef,
      style: tiltStyle,
      glareStyle,
      handleMouseMove,
      handleMouseLeave,
    } = useCardTilt({ perspective: 1200, maxRotateX: 2, maxRotateY: 2.5, translateZ: 6 });

    return (
      <motion.div
        ref={(node) => {
          (tiltRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={`relative ${className ?? ""}`}
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radius.lg,
          padding: "clamp(24px, 3vw, 32px)",
          ...tiltStyle,
          transition: "border-color 280ms cubic-bezier(0.22,1,0.36,1), background 280ms cubic-bezier(0.22,1,0.36,1)",
          willChange: "transform",
        }}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeInUp}
        transition={transitions.slow}
        onMouseMove={handleMouseMove}
        onMouseLeave={(e) => {
          handleMouseLeave();
          if (hover) {
            e.currentTarget.style.borderColor = colors.border;
            e.currentTarget.style.background = colors.surface;
          }
        }}
        onMouseEnter={(e) => {
          if (hover) {
            e.currentTarget.style.borderColor = colors.borderHi;
            e.currentTarget.style.background = colors.surfaceHi;
          }
        }}
      >
        <div style={glareStyle} />
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export default Card;
