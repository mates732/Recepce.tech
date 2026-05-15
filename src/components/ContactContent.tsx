"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  locale: Locale;
}

type FormStatus = "idle" | "loading" | "success" | "error";

const phone = "+420 732 839 892";
const email = "vojanmatyas@gmail.com";
const whatsapp = "+420 732 839 892";

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

  function getButtonColor() {
    if (status === "success") return "rgba(52,211,153,0.8)";
    if (status === "loading") return "rgba(255,255,255,0.3)";
    return "rgba(0,194,255,0.6)";
  }

  function validate(): string | null {
    const trimmed = {
      name: name.trim(),
      email: emailVal.trim(),
      message: message.trim(),
    };
    if (!trimmed.name || !trimmed.email || !trimmed.message) {
      return isCs ? "Prosím vyplňte všechna povinná pole." : "Please fill in all required fields.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      return isCs ? "Zadejte prosím platný e-mail." : "Please enter a valid email address.";
    }
    if (trimmed.message.length < 10) {
      return isCs ? "Zpráva musí mít alespoň 10 znaků." : "Message must be at least 10 characters.";
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

      if (!res.ok) {
        throw new Error(data.error ?? (isCs ? "Něco se pokazilo. Zkuste to prosím znovu." : "Something went wrong. Please try again."));
      }

      setStatus("success");
      resetForm();
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : (isCs ? "Něco se pokazilo." : "Something went wrong."));
    }
  }

  function resetForm() {
    setName("");
    setEmailVal("");
    setPhoneVal("");
    setMessage("");
  }

  function handleInputFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "rgba(0,194,255,0.3)";
    if (!e.currentTarget.closest("textarea")) {
      (e.currentTarget as HTMLInputElement).style.background = "rgba(8,8,10,0.6)";
    }
  }

  function handleInputBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
    if (!e.currentTarget.closest("textarea")) {
      (e.currentTarget as HTMLInputElement).style.background = "rgba(8,8,10,0.4)";
    }
  }

  const isLoading = status === "loading";
  const isDisabled = isLoading || status === "success";

  return (
    <PageTransition>
      <section className="relative w-full pt-[clamp(140px,20vh,200px)] pb-24 px-[clamp(24px,5vw,64px)] min-h-screen">
        <div className="mx-auto relative z-10" style={{ maxWidth: "960px" }}>
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8"
              style={{
                background: "rgba(0,194,255,0.06)",
                border: "1px solid rgba(0,194,255,0.1)",
                color: "rgba(0,194,255,0.5)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#00C2FF",
                  animation: "pulse-dot 2.8s ease-in-out infinite",
                  boxShadow: "0 0 0 3px rgba(0,194,255,0.12)",
                }}
              />
              <span className="font-body text-[10px] tracking-[0.08em]">{t(locale, "contact.badge")}</span>
            </div>

            <h1
              className="font-heading mb-6"
              style={{
                fontSize: "clamp(36px, 6vw, 80px)",
                lineHeight: 1.05,
                fontWeight: 500,
              }}
              dangerouslySetInnerHTML={{ __html: t(locale, "contact.title") }}
            />

            <p
              className="font-body text-[clamp(15px,1.2vw,17px)] leading-relaxed max-w-[48ch] mx-auto"
              style={{ color: "#B7BCC7" }}
            >
              {t(locale, "contact.subtitle")}
            </p>
          </div>

          <div
            className="grid gap-10 items-start responsive-grid-2"
            style={{ gridTemplateColumns: "1fr 1.3fr" }}
          >
            <div>
              <h2 className="font-heading text-[clamp(20px,2.5vw,28px)] font-medium mb-3">
                {t(locale, "contact.formTitle")}
              </h2>
              <p className="font-body text-[14px] leading-relaxed mb-8" style={{ color: "#B7BCC7" }}>
                {t(locale, "contact.formSub")}
              </p>

              <div className="flex flex-col gap-3 mb-8">
                {contacts.map((c, i) => (
                  <a
                    key={i}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener" : undefined}
                    className="group flex items-center gap-4"
                    style={{ color: "rgba(183,188,199,0.6)", transition: "color 0.5s ease-out" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#F3F4F6"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(183,188,199,0.6)"; }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-body text-[10px] tracking-[0.08em] uppercase" style={{ color: "rgba(0,194,255,0.35)" }}>
                        {c.label}
                      </div>
                      <div className="font-body text-[15px] font-medium truncate">{c.value}</div>
                    </div>
                    <svg
                      width="14" height="14" viewBox="0 0 14 14" fill="none"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      className="transition-transform duration-500 ease-out will-change-transform group-hover:translate-x-1 flex-shrink-0"
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
                    className="flex items-center gap-2.5 font-body text-[13px] transition-all duration-300"
                    style={{ color: "#B7BCC7" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#F3F4F6";
                      const svg = e.currentTarget.querySelector("svg");
                      if (svg) svg.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#B7BCC7";
                      const svg = e.currentTarget.querySelector("svg");
                      if (svg) svg.style.opacity = "0.6";
                    }}
                  >
                    <div
                      className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{ background: "rgba(0,194,255,0.06)", border: "1px solid rgba(0,194,255,0.1)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(0,194,255,0.25)";
                        e.currentTarget.style.background = "rgba(0,194,255,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(0,194,255,0.1)";
                        e.currentTarget.style.background = "rgba(0,194,255,0.06)";
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#00C2FF" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.6, transition: "opacity 0.3s ease" }}>
                        <path d="M2 5l2.5 2.5 3.5-4" />
                      </svg>
                    </div>
                    <span>{promise}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <input
                  ref={hpRef}
                  type="text"
                  name="_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
                  aria-hidden="true"
                />

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[11px] tracking-[0.06em]" style={{ color: "#B7BCC7" }}>
                    {t(locale, "contact.formName")}
                  </label>
                  <input
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (status === "error") setStatus("idle"); }}
                    disabled={isLoading}
                    required
                    className="w-full text-[14px] outline-none"
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      color: "#F3F4F6",
                      padding: "8px 0",
                      transition: "border-color 0.3s ease-out, opacity 0.3s ease",
                      opacity: isLoading ? 0.4 : 1,
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.3)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[11px] tracking-[0.06em]" style={{ color: "#B7BCC7" }}>
                    {t(locale, "contact.formEmail")}
                  </label>
                  <input
                    type="email"
                    value={emailVal}
                    onChange={(e) => { setEmailVal(e.target.value); if (status === "error") setStatus("idle"); }}
                    disabled={isLoading}
                    required
                    className="w-full text-[14px] outline-none"
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      color: "#F3F4F6",
                      padding: "8px 0",
                      transition: "border-color 0.3s ease-out, opacity 0.3s ease",
                      opacity: isLoading ? 0.4 : 1,
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,194,255,0.3)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[11px] tracking-[0.06em]" style={{ color: "#B7BCC7" }}>
                    {t(locale, "contact.formPhone")}
                  </label>
                  <input
                    type="tel"
                    value={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3.5 py-3 rounded-xl text-[14px] outline-none transition-all duration-200"
                    style={{
                      background: isLoading ? "rgba(8,8,10,0.2)" : "rgba(8,8,10,0.4)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#F3F4F6",
                      opacity: isLoading ? 0.4 : 1,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,194,255,0.15)";
                      e.currentTarget.style.background = "rgba(8,8,10,0.6)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background = isLoading ? "rgba(8,8,10,0.2)" : "rgba(8,8,10,0.4)";
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-[11px] tracking-[0.06em]" style={{ color: "#B7BCC7" }}>
                    {t(locale, "contact.formMessage")}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); if (status === "error") setStatus("idle"); }}
                    disabled={isLoading}
                    rows={4}
                    className="w-full px-3.5 py-3 rounded-xl text-[14px] outline-none transition-all duration-200 resize-vertical"
                    style={{
                      background: isLoading ? "rgba(8,8,10,0.2)" : "rgba(8,8,10,0.4)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#F3F4F6",
                      lineHeight: "1.5",
                      opacity: isLoading ? 0.4 : 1,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,194,255,0.15)";
                      e.currentTarget.style.background = "rgba(8,8,10,0.6)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background = isLoading ? "rgba(8,8,10,0.2)" : "rgba(8,8,10,0.4)";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isDisabled}
                  className="font-body text-[14px] font-medium tracking-[-0.01em] mt-6"
                  style={{
                    color: getButtonColor(),
                    transition: "color 0.4s ease-out, text-shadow 0.4s ease-out",
                    cursor: isDisabled ? "default" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.color = "rgba(0,194,255,0.9)";
                      e.currentTarget.style.textShadow = "0 0 24px rgba(0,194,255,0.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = getButtonColor();
                    e.currentTarget.style.textShadow = "none";
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
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <span className="font-body text-[13px]" style={{ color: "rgba(52,211,153,0.8)" }}>
                        {isCs ? "Děkujeme! Vaše zpráva byla odeslána." : "Thank you! Your message has been sent."}
                      </span>
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <span className="font-body text-[13px]" style={{ color: "rgba(248,113,113,0.8)" }}>
                        {errorMsg}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="font-body text-[11px] text-center mt-1" style={{ color: "rgba(126,132,146,0.8)" }}>
                  {t(locale, "contact.note")}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
