"use client";

import { motion } from "framer-motion";
import { reveal, stagger } from "@/lib/motion";

interface SectionHeaderProps {
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

/** Jednotná hlavička sekce — reveal + rozostření, konzistentní rytmus. */
export default function SectionHeader({
  eyebrow,
  eyebrowColor,
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const center = align === "center";

  return (
    <motion.div
      className={`mb-10 sm:mb-16 ${center ? "text-center" : ""} ${className}`}
      style={center ? { maxWidth: "720px", marginLeft: "auto", marginRight: "auto" } : { maxWidth: "640px" }}
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.p
        variants={reveal}
        className="font-mono mb-4"
        style={{ fontSize: "var(--text-label-fluid)", letterSpacing: "0.22em", textTransform: "uppercase", color: eyebrowColor }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={reveal}
        className="font-heading"
        style={{ fontSize: "var(--text-h1)", letterSpacing: "-0.03em", color: "#F4F6F8" }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={reveal}
          className={`font-body mt-3 ${center ? "mx-auto" : ""}`}
          style={{ fontSize: "var(--text-lead)", color: "#9AA1AB", maxWidth: "52ch" }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
