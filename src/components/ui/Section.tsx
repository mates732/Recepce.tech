"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, type MotionProps } from "framer-motion";
import { spacing } from "@/design/tokens";
import { fadeInUp, transitions, viewportConfig } from "@/design/animations";

interface SectionProps extends MotionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  narrow?: boolean;
}

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ children, id, className, containerClassName, narrow, ...motionProps }, ref) => {
    return (
      <motion.section
        ref={ref}
        id={id}
        className={`relative w-full ${className ?? ""}`}
        style={{ padding: `${spacing.section.py} ${spacing.section.px}` }}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeInUp}
        transition={transitions.slow}
        {...motionProps}
      >
        <div
          className={`mx-auto w-full ${containerClassName ?? ""}`}
          style={{ maxWidth: narrow ? spacing.container.narrow : spacing.container.maxWidth }}
        >
          {children}
        </div>
      </motion.section>
    );
  }
);

Section.displayName = "Section";

export default Section;
