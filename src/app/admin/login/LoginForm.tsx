"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/utils";

interface LoginFormProps {
  locale: Locale;
}

type Status = "idle" | "loading" | "error";

export default function LoginForm({ locale }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = "/admin";
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full" noValidate>
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder={t(locale, "admin.password")}
        autoFocus
        disabled={status === "loading"}
        className="w-full text-sm outline-none transition-all duration-200"
        style={{
          background: "transparent",
          border: "none",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          color: "#F4F6F8",
          padding: "10px 0",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
      />

      {status === "error" && (
        <span className="font-body text-sm" style={{ color: "#EF4444" }}>
          {t(locale, "admin.invalidPassword")}
        </span>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="font-body text-sm font-medium tracking-[-0.01em] self-start px-6 py-2.5 rounded-full transition-all duration-300"
        style={{
          color: status === "loading" ? "rgba(255,255,255,0.3)" : "#0A0A0B",
          background: status === "loading" ? "rgba(255,255,255,0.06)" : "var(--color-accent)",
          cursor: status === "loading" ? "default" : "pointer",
        }}
      >
        {status === "loading" ? t(locale, "admin.signingIn") : t(locale, "admin.signIn")}
      </button>
    </form>
  );
}
