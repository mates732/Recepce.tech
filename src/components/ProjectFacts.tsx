"use client";

import Link from "next/link";
import type { Locale } from "@/lib/types";

export interface ProjectFact {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

interface ProjectFactsProps {
  locale: Locale;
  facts: ProjectFact[];
}

export default function ProjectFacts({ locale, facts }: ProjectFactsProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#121316", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "rgba(255,255,255,0.08)" }}>
        {facts.map((fact) => (
          <div key={fact.label} className="p-4 sm:p-5" style={{ background: "#121316" }}>
            <p
              className="text-label-sm sm:text-label font-mono font-semibold tracking-[0.15em] uppercase mb-2"
              style={{ color: "#6E7683" }}
            >
              {fact.label}
            </p>
            {fact.href ? (
              <Link
                href={fact.external ? fact.href : `/${locale}${fact.href}`}
                target={fact.external ? "_blank" : undefined}
                rel={fact.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 font-heading text-sm leading-snug transition-opacity duration-200 hover:opacity-60"
                style={{ color: "#F4F6F8", letterSpacing: "-0.01em" }}
              >
                {fact.value}
                {fact.external && (
                  <span className="text-label" style={{ color: "#6E7683" }} aria-hidden="true">
                    &#8599;
                  </span>
                )}
              </Link>
            ) : (
              <p
                className="font-heading text-sm leading-snug"
                style={{ color: "#F4F6F8", letterSpacing: "-0.01em" }}
              >
                {fact.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
