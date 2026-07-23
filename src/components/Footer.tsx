"use client";

import Link from "next/link";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  return (
    <footer
      className="relative z-10 border-t"
      role="contentinfo"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        padding: "64px clamp(24px,5vw,64px) 40px",
        paddingBottom: "max(40px, calc(40px + env(safe-area-inset-bottom)))",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <div
          className="footer-grid grid mb-10"
          style={{
            gridTemplateColumns: "1fr auto auto",
            gap: "48px",
            alignItems: "start",
          }}
        >
          <div>
            <div className="flex items-center gap-1.5 text-[15px] tracking-[-0.02em]">
              <span className="font-bold">recepce</span>
              <span style={{ color: "rgba(160,160,160,0.7)", fontWeight: 400 }}>.tech</span>
            </div>
            <p
              className="mt-2.5 text-sm leading-relaxed"
              style={{ color: "#A0A0A0", maxWidth: "30ch" }}
            >
              {t(locale, "footer.tagline")}
            </p>
          </div>

          <div>
            <h4
              className="text-[11px] font-semibold tracking-[0.08em] uppercase mb-3.5"
              style={{ color: "#A0A0A0" }}
            >
              {t(locale, "footer.pages")}
            </h4>
            <ul className="flex flex-col gap-2.5 list-none">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-sm transition-colors duration-200 hover:text-[#FAFAFA]"
                  style={{ color: "#A0A0A0" }}
                >
                  {t(locale, "nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#work`}
                  className="text-sm transition-colors duration-200 hover:text-[#FAFAFA]"
                  style={{ color: "#A0A0A0" }}
                >
                  {t(locale, "nav.projects")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/ai-receptionist`}
                  className="text-sm transition-colors duration-200 hover:text-[#FAFAFA]"
                  style={{ color: "#A0A0A0" }}
                >
                  {t(locale, "nav.aiReceptionist")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#about`}
                  className="text-sm transition-colors duration-200 hover:text-[#FAFAFA]"
                  style={{ color: "#A0A0A0" }}
                >
                  {t(locale, "nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm transition-colors duration-200 hover:text-[#FAFAFA]"
                  style={{ color: "#A0A0A0" }}
                >
                  {t(locale, "nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4
              className="text-[11px] font-semibold tracking-[0.08em] uppercase mb-3.5"
              style={{ color: "#A0A0A0" }}
            >
              {t(locale, "footer.legal")}
            </h4>
            <ul className="flex flex-col gap-2.5 list-none">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm transition-colors duration-200 hover:text-[#FAFAFA]"
                  style={{ color: "#A0A0A0" }}
                >
                  {t(locale, "footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-sm transition-colors duration-200 hover:text-[#FAFAFA]"
                  style={{ color: "#A0A0A0" }}
                >
                  {t(locale, "footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-2 pt-6 border-t text-xs font-mono tracking-[0.02em]"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            color: "rgba(160,160,160,0.6)",
          }}
        >
          <span>{t(locale, "footer.copyright")}</span>
          <span>{t(locale, "footer.madeIn")}</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}
