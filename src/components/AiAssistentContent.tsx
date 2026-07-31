"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/types";

interface Props {
  locale: Locale;
}

interface Item {
  name: string;
  poster: string;
  href: string;
}

const items: Item[] = [
  {
    name: "Voice Assistant",
    poster: "/images/posters/poster.voice.jpg",
    href: "/projekty/ai-sistent/voice-assistant",
  },
  {
    name: "Chat Assistant",
    poster: "/images/posters/poster.chat.jpg",
    href: "/projekty/ai-sistent/chat-assistant",
  },
];

export default function AiAssistentContent({ locale }: Props) {
  return (
    <main
      className="relative flex flex-col items-center justify-center"
      style={{
        minHeight: "100dvh",
        padding: "clamp(80px, 12vh, 100px) clamp(48px, 8vw, 100px)",
        background: "#F7F8FA",
      }}
    >
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] font-mono font-semibold tracking-[0.15em] uppercase mb-8 sm:mb-10"
          style={{ color: "#9CA3AF" }}
        >
          {locale === "cs" ? "AI ASISTENTI" : "AI ASSISTANTS"}
        </motion.span>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full justify-center">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.04 * i,
                duration: 0.6,
                ease: [0.22, 0.8, 0.2, 1],
              }}
              className="w-full sm:w-1/2 max-w-[320px]"
            >
              <Link
                href={`/${locale}${item.href}`}
                className="group block no-underline"
              >
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-500"
                  style={{
                    border: "1px solid rgba(17,17,17,0.06)",
                    boxShadow: "0 2px 12px rgba(17,17,17,0.04)",
                  }}
                >
                  <div className="overflow-hidden">
                    <Image
                      src={item.poster}
                      alt={item.name}
                      width={1640}
                      height={2360}
                      className="w-full h-auto transition-all duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div
                    className="px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between"
                    style={{ background: "#FFFFFF", borderTop: "1px solid rgba(17,17,17,0.04)" }}
                  >
                    <span className="font-heading text-sm" style={{ color: "#111111", letterSpacing: "-0.01em" }}>
                      {item.name}
                    </span>
                    <span
                      className="inline-block transition-transform duration-300 group-hover:translate-x-[3px]"
                      style={{ fontSize: "clamp(14px, 1.5vw, 20px)", color: "rgba(17,17,17,0.20)" }}
                    >
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.04 * items.length + 0.2,
            duration: 0.4,
            ease: [0.22, 0.8, 0.2, 1],
          }}
          className="mt-12 sm:mt-14"
        >
          <Link
            href={`/${locale}/projekty`}
            className="inline-block transition-all duration-200 hover:opacity-60"
            style={{
              fontSize: "clamp(14px, 1.5vw, 20px)",
              color: "rgba(17,17,17,0.25)",
              fontWeight: 350,
            }}
          >
            &larr; {locale === "cs" ? "Zp\u011bt" : "Back"}
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
