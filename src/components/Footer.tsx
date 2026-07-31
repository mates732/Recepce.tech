import Link from "next/link";
import type { Locale } from "@/lib/types";
import { SOCIALS } from "@/config/socials";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  return (
    <footer
      className="relative z-10 border-t"
      style={{
        borderColor: "rgba(17,17,17,0.06)",
        padding: "64px clamp(24px,5vw,80px) 40px",
        paddingBottom: "max(40px, calc(40px + env(safe-area-inset-bottom)))",
        background: "#FFFFFF",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>
        <div
          className="footer-grid grid mb-12 md:[grid-template-columns:1fr_auto_auto] gap-10 md:gap-16"
          style={{
            alignItems: "start",
          }}
        >
          <div>
            <div className="flex items-center gap-1.5 text-[15px] tracking-[-0.02em]" style={{ color: "#111111" }}>
              <span className="font-semibold">recepce</span>
              <span style={{ color: "#5F6368", fontWeight: 400 }}>.tech</span>
            </div>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "#5F6368", maxWidth: "28ch" }}
            >
              {locale === "cs"
                ? "Stavím inteligentní systémy. AI, software, automatizace."
                : "I build intelligent systems. AI, software, automation."}
            </p>
          </div>

          <div>
            <h4
              className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-4"
              style={{ color: "#9CA3AF" }}
            >
              {locale === "cs" ? "Navigace" : "Navigate"}
            </h4>
            <ul className="flex flex-col gap-2.5 list-none">
              {[
                { label: locale === "cs" ? "Domů" : "Home", href: `/${locale}` },
                { label: locale === "cs" ? "Chat Asistent" : "Chat Assistant", href: `/${locale}/ai-receptionist` },
                { label: locale === "cs" ? "Kontakt" : "Contact", href: `/${locale}/contact` },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-[#111111]"
                    style={{ color: "#5F6368" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-[10px] font-semibold tracking-[0.1em] uppercase mb-4"
              style={{ color: "#9CA3AF" }}
            >
              {locale === "cs" ? "Spojení" : "Connect"}
            </h4>
            <ul className="flex flex-col gap-2.5 list-none">
              <li>
                <a
                  href={`mailto:${SOCIALS.email}`}
                  className="text-sm transition-colors duration-200 hover:text-[#111111]"
                  style={{ color: "#5F6368" }}
                >
                  {SOCIALS.email}
                </a>
              </li>
              {SOCIALS.youtube && (
                <li>
                  <a
                    href={SOCIALS.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200 hover:text-[#111111]"
                    style={{ color: "#5F6368" }}
                  >
                    YouTube
                  </a>
                </li>
              )}
              {SOCIALS.github && (
                <li>
                  <a
                    href={SOCIALS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200 hover:text-[#111111]"
                    style={{ color: "#5F6368" }}
                  >
                    GitHub
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-2 pt-6 border-t text-xs"
          style={{
            borderColor: "rgba(17,17,17,0.06)",
            color: "#9CA3AF",
          }}
        >
          <span>&copy; {new Date().getFullYear()} recepce.tech</span>
          <span>{locale === "cs" ? "Vytvořeno v České republice" : "Made in the Czech Republic"}</span>
        </div>
      </div>
    </footer>
  );
}
