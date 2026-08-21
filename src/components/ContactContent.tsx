"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import { SOCIALS } from "@/config/socials";
import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  locale: Locale;
}

type FormStatus = "idle" | "loading" | "success" | "error";

const phone = SOCIALS.phone;
const email = SOCIALS.email;
const whatsapp = SOCIALS.phone;

export default function ContactContent({ locale }: Props) {
  const isCs = locale === "cs";
  const hpRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const promises = [
    t(locale, "contact.promise1"),
    t(locale, "contact.promise2"),
    t(locale, "contact.promise3"),
    t(locale, "contact.promise4"),
  ];

  const contacts = [
    { label: t(locale, "contact.callUs"), value: phone, href: `tel:${phone.replace(/\s/g, "")}`, icon: "phone" },
    { label: t(locale, "contact.email"), value: email, href: `mailto:${email}`, icon: "mail" },
    { label: "WhatsApp", value: whatsapp, href: `https://wa.me/${whatsapp.replace(/\s/g, "").replace("+", "")}`, icon: "chat" },
  ];

  function getButtonText() {
    if (status === "loading") return t(locale, "contact.formSending");
    if (status === "success") return t(locale, "contact.formSuccess");
    return t(locale, "contact.formSend");
  }

  function validate(): string | null {
    const trimmed = {
      name: name.trim(),
      email: emailVal.trim(),
      message: message.trim(),
    };
    if (!trimmed.name || !trimmed.email || !trimmed.message) {
      return t(locale, "contact.formRequired");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      return t(locale, "contact.formInvalidEmail");
    }
    if (trimmed.message.length < 10) {
      return t(locale, "contact.formTooShort");
    }
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const error = validate();
    if (error) {
      setStatus("error");
      setErrorMsg(error);
      return;
    }

    const hp = hpRef.current?.value ?? "";
    if (hp) {
      setStatus("success");
      resetForm();
      setTimeout(() => setStatus("idle"), 5000);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: emailVal.trim(),
          phone: phoneVal.trim(),
          message: message.trim(),
          _hp: hp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t(locale, "contact.formError"));
      setStatus("success");
      resetForm();
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t(locale, "contact.formErrorGeneric"));
    }
  }

  function resetForm() {
    setName("");
    setEmailVal("");
    setPhoneVal("");
    setMessage("");
  }

  const isLoading = status === "loading";
  const isDisabled = isLoading || status === "success";

  return (
    <section
      className="relative min-h-screen"
      style={{
        padding: "clamp(120px, 15vw, 200px) clamp(24px, 5vw, 80px)",
      }}
    >
      <div className="mx-auto relative z-10" style={{ maxWidth: "960px" }}>
        <div className="text-center mb-10 md:mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8"
            style={{
              background: "#121316",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#9AA1AB",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#F4F6F8",
                animation: "pulse-dot 2.8s ease-in-out infinite",
              }}
            />
            <span className="font-body text-label tracking-[0.08em]">{t(locale, "contact.badge")}</span>
          </div>

          <h1
            className="font-heading font-medium leading-tight"
            style={{
              fontSize: "var(--text-h1-lg)",
              letterSpacing: "-0.03em",
              color: "#F4F6F8",
            }}
          >
            {t(locale, "contact.title")}
          </h1>

          <p
            className="font-body mt-6 leading-relaxed max-w-[48ch] mx-auto"
            style={{
              fontSize: "var(--text-body)",
              color: "#9AA1AB",
            }}
          >
            {t(locale, "contact.subtitle")}
          </p>
        </div>

        <div
          className="grid gap-8 md:gap-10 items-start md:[grid-template-columns:1fr_1.3fr]"
        >
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="font-heading font-medium mb-3"
              style={{
                fontSize: "var(--text-h2)",
                color: "#F4F6F8",
              }}
            >
              {t(locale, "contact.formTitle")}
            </h2>
            <p
              className="font-body text-sm leading-relaxed mb-8"
              style={{ color: "#9AA1AB" }}
            >
              {t(locale, "contact.formSub")}
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {contacts.map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener" : undefined}
                  className="group flex items-center gap-4 py-2.5 md:py-2"
                  style={{
                    color: "#9AA1AB",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#F4F6F8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#9AA1AB"; }}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-body text-label tracking-[0.08em] uppercase"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {c.label}
                    </div>
                    <div className="font-body text-[15px] font-medium truncate">{c.value}</div>
                  </div>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    className="transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0"
                  >
                    <path d="M3 7h8M7 3l4 4-4 4" />
                  </svg>
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              {promises.map((promise, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 font-body text-sm transition-all duration-300"
                  style={{ color: "#9AA1AB" }}
                >
                  <div
                    className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#F4F6F8" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.4 }}>
                      <path d="M2 5l2.5 2.5 3.5-4" />
                    </svg>
                  </div>
                  <span>{promise}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column — form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: "#121316",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <input
                ref={hpRef}
                type="text"
                name="_hp"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
                aria-hidden="true"
              />

              {(["name", "email", "phone"] as const).map((field) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`contact-${field}`}
                    className="font-body text-xs tracking-[0.06em]"
                    style={{ color: "#9AA1AB" }}
                  >
                    {t(locale, `contact.form${field.charAt(0).toUpperCase() + field.slice(1)}` as any)}
                  </label>
                  <input
                    id={`contact-${field}`}
                    value={field === "name" ? name : field === "email" ? emailVal : phoneVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (field === "name") setName(val);
                      else if (field === "email") setEmailVal(val);
                      else setPhoneVal(val);
                      if (status === "error") setStatus("idle");
                    }}
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    disabled={isLoading}
                    required={field !== "phone"}
                    className="w-full text-sm outline-none transition-all duration-200"
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      color: "#F4F6F8",
                      padding: "8px 0",
                      opacity: isLoading ? 0.4 : 1,
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="font-body text-xs tracking-[0.06em]"
                  style={{ color: "#9AA1AB" }}
                >
                  {t(locale, "contact.formMessage")}
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); if (status === "error") setStatus("idle"); }}
                  disabled={isLoading}
                  rows={4}
                  className="w-full text-sm outline-none transition-all duration-200 resize-vertical rounded-xl px-3.5 py-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#F4F6F8",
                    lineHeight: "var(--leading-body)",
                    opacity: isLoading ? 0.4 : 1,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isDisabled}
                className="font-body text-sm font-medium tracking-[-0.01em] mt-2 self-start w-full md:w-auto px-6 py-3 rounded-full transition-all duration-300"
                style={{
                  color: isDisabled ? "rgba(244,246,248,0.3)" : "#0A0A0B",
                  background: isDisabled ? "rgba(255,255,255,0.06)" : "var(--color-accent)",
                  cursor: isDisabled ? "default" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 16px var(--color-accent-glow)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={status}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getButtonText()}
                  </motion.span>
                </AnimatePresence>
              </button>

              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div
                    key="success"
                    role="status"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-body text-sm" style={{ color: "#9AA1AB" }}>
                      {t(locale, "contact.formSuccessMessage")}
                    </span>
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    key="error"
                    role="alert"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-body text-sm" style={{ color: "var(--color-danger)" }}>
                      {errorMsg}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="font-body text-xs text-center mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                {t(locale, "contact.note")}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
