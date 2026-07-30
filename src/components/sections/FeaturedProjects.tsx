"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/types";
import Link from "next/link";

interface FeaturedProjectsProps {
  locale: Locale;
}

function getProjects(locale: Locale) {
  return [
    {
      name: locale === "cs" ? "Cortex" : "Cortex",
      desc: locale === "cs"
        ? "AI prodejní systém. Najde klienta. Vyhodnotí. Osloví. Automaticky."
        : "AI sales system. Finds leads. Evaluates. Reaches out. Fully automated.",
      tags: ["AI", "Sales", "Automation"],
      url: `/${locale}/cortex`,
      bg: "#1a1a1a",
    },
    {
      name: locale === "cs" ? "Chat Asistent" : "Chat Assistant",
      desc: locale === "cs"
        ? "Chat AI asistent pro firmy. Odpovídá na dotazy. Rezervuje. Automatizuje komunikaci."
        : "Chat AI assistant for businesses. Answers questions. Books. Automates communication.",
      tags: ["Voice AI", "Python", "Next.js"],
      url: `/${locale}/ai-receptionist`,
      bg: "#2a2a2a",
    },
    {
      name: "Zlatý Hřeben",
      desc: locale === "cs"
        ? "Prémiový barbershop. Digitální prezentace, která odpovídá úrovni salonu."
        : "Premium barbershop. A digital presence that matches the salon's standard.",
      tags: ["Web", "Design", "Brand"],
      url: "https://zlatyhreben.cz",
      bg: "#3a3a3a",
    },
    {
      name: "Poníci.cz",
      desc: locale === "cs"
        ? "Dětský jezdecký ranč. Web, kde si rodiče rezervují lekci za 2 minuty."
        : "Kids riding ranch. A website where parents book a lesson in 2 minutes.",
      tags: ["Web", "Booking", "Mobile"],
      url: "https://ponici.cz",
      bg: "#4a4a4a",
    },
  ];
}

export default function FeaturedProjects({ locale }: FeaturedProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const data = getProjects(locale);
  const title = locale === "cs" ? "Vybrané projekty" : "Featured projects";
  const subtitle = locale === "cs"
    ? "Produkty a digitální zážitky, které jsem postavil."
    : "Products and digital experiences I've built.";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="projekty"
      ref={sectionRef}
      className="relative"
      style={{
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 5vw, 80px)",
        background: "#F7F8FA",
      }}
    >
      <motion.div style={{ y: shouldReduceMotion ? 0 : y, maxWidth: "1200px" }} className="relative z-10 mx-auto">
        <div className="mb-16 sm:mb-20">
          <h2
            className="font-heading"
            style={{
              fontSize: "clamp(32px, 5vw, 64px)",
              letterSpacing: "-0.03em",
              color: "#111111",
            }}
          >
            {title}
          </h2>
          <p
            className="mt-3 font-body"
            style={{
              fontSize: "clamp(14px, 1.2vw, 18px)",
              color: "#5F6368",
              maxWidth: "40ch",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-8 sm:gap-12">
          {data.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              locale={locale}
              shouldReduceMotion={!!shouldReduceMotion}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  locale,
  shouldReduceMotion,
}: {
  project: { name: string; desc: string; tags: string[]; url: string; bg: string };
  index: number;
  locale: Locale;
  shouldReduceMotion: boolean;
}) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={project.url}
        target={project.url.startsWith("http") ? "_blank" : undefined}
        rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="group block"
        onClick={(e) => {
          if (project.url.startsWith("#")) e.preventDefault();
        }}
      >
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(17,17,17,0.06)",
            transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(17,17,17,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div
            className={`flex flex-col ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"} items-stretch`}
          >
            {/* Visual side */}
            <div
              className="relative min-h-[200px] sm:min-h-[300px] sm:w-1/2 flex items-center justify-center overflow-hidden"
              style={{ background: project.bg }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)",
                }}
              />
              <span
                className="relative z-10 font-heading text-white/20 select-none"
                style={{
                  fontSize: "clamp(48px, 8vw, 96px)",
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                }}
              >
                {project.name.charAt(0)}
              </span>
            </div>

            {/* Content side */}
            <div className="p-6 sm:p-10 sm:w-1/2 flex flex-col justify-center">
              <h3
                className="font-heading mb-3"
                style={{
                  fontSize: "clamp(22px, 2.5vw, 32px)",
                  color: "#111111",
                }}
              >
                {project.name}
              </h3>
              <p
                className="font-body text-sm leading-relaxed mb-5"
                style={{ color: "#5F6368" }}
              >
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-[10px] font-mono tracking-wider px-3 py-1.5 rounded-full uppercase"
                    style={{
                      background: "rgba(17,17,17,0.04)",
                      color: "#5F6368",
                      border: "1px solid rgba(17,17,17,0.06)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
