"use client";

import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";
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
      if (!res.ok) throw new Error(data.error ?? (isCs ? "Něco se pokazilo. Zkuste to prosím znovu." : "Something went wrong. Please try again."));
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

  const isLoading = status === "loading";
  const isDisabled = isLoading || status === "success";

  return (
    <section
      className="relative min-h-screen"
      style={{
        padding: "clamp(120px, 15vw, 200px) clamp(24px, 5vw, 80px)",
        background: "#F7F8FA",
      }}
    >
      <div className="mx-auto relative z-10" style={{ maxWidth: "960px" }}>
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(17,17,17,0.06)",
              color: "#5F6368",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#111111",
                animation: "pulse-dot 2.8s ease-in-out infinite",
              }}
            />
            <span className="font-body text-[10px] tracking-[0.08em]">{t(locale, "contact.badge")}</span>
          </div>

          <h1
            className="font-heading font-bold leading-tight"
            style={{
              fontSize: "clamp(36px, 6vw, 80px)",
              letterSpacing: "-0.03em",
              color: "#111111",
            }}
            dangerouslySetInnerHTML={{ __html: t(locale, "contact.title") }}
          />

          <p
            className="font-body mt-6 leading-relaxed max-w-[48ch] mx-auto"
            style={{
              fontSize: "clamp(15px, 1.2vw, 17px)",
              color: "#5F6368",
            }}
          >
            {t(locale, "contact.subtitle")}
          </p>
        </div>

        <div
          className="grid gap-10 items-start"
          style={{ gridTemplateColumns: "1fr 1.3fr" }}
        >
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="font-heading font-semibold mb-3"
              style={{
                fontSize: "clamp(20px, 2.5vw, 28px)",
                color: "#111111",
              }}
            >
              {t(locale, "contact.formTitle")}
            </h2>
            <p
              className="font-body text-sm leading-relaxed mb-8"
              style={{ color: "#5F6368" }}
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
                  className="group flex items-center gap-4 py-2"
                  style={{
                    color: "#5F6368",
                    borderBottom: "1px solid rgba(17,17,17,0.06)",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#111111"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#5F6368"; }}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-body text-[10px] tracking-[0.08em] uppercase"
                      style={{ color: "rgba(17,17,17,0.35)" }}
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
                  style={{ color: "#5F6368" }}
                >
                  <div
                    className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(17,17,17,0.04)",
                      border: "1px solid rgba(17,17,17,0.08)",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.4 }}>
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
              background: "#FFFFFF",
              border: "1px solid rgba(17,17,17,0.06)",
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
                    className="font-body text-xs tracking-[0.06em]"
                    style={{ color: "#5F6368" }}
                  >
                    {t(locale, `contact.form${field.charAt(0).toUpperCase() + field.slice(1)}` as any)}
                  </label>
                  <input
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
                      borderBottom: "1px solid rgba(17,17,17,0.1)",
                      color: "#111111",
                      padding: "8px 0",
                      opacity: isLoading ? 0.4 : 1,
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#111111"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(17,17,17,0.1)"; }}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label
                  className="font-body text-xs tracking-[0.06em]"
                  style={{ color: "#5F6368" }}
                >
                  {t(locale, "contact.formMessage")}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); if (status === "error") setStatus("idle"); }}
                  disabled={isLoading}
                  rows={4}
                  className="w-full text-sm outline-none transition-all duration-200 resize-vertical rounded-xl px-3.5 py-3"
                  style={{
                    background: "rgba(17,17,17,0.02)",
                    border: "1px solid rgba(17,17,17,0.08)",
                    color: "#111111",
                    lineHeight: "1.5",
                    opacity: isLoading ? 0.4 : 1,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(17,17,17,0.2)";
                    e.currentTarget.style.background = "rgba(17,17,17,0.03)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(17,17,17,0.08)";
                    e.currentTarget.style.background = "rgba(17,17,17,0.02)";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isDisabled}
                className="font-body text-sm font-medium tracking-[-0.01em] mt-2 self-start px-6 py-3 rounded-full transition-all duration-300"
                style={{
                  color: isDisabled ? "rgba(17,17,17,0.3)" : "#FFFFFF",
                  background: isDisabled ? "rgba(17,17,17,0.06)" : "#111111",
                  cursor: isDisabled ? "default" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isDisabled) {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(17,17,17,0.1)";
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
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-body text-sm" style={{ color: "#5F6368" }}>
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
                  >
                    <span className="font-body text-sm" style={{ color: "#EF4444" }}>
                      {errorMsg}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="font-body text-xs text-center mt-1" style={{ color: "rgba(17,17,17,0.3)" }}>
                {t(locale, "contact.note")}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
