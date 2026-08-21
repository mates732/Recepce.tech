import "server-only";
import { sendTelegramMessage, escapeMarkdown, TelegramConfigError, TelegramSendError } from "./telegram";

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export type ContactResult =
  | { ok: true }
  | { ok: false; status: 400 | 500; error: string };

function sanitize(input: string): string {
  return input.trim().replace(/<[^>]*>/g, "").replace(/[<>]/g, "");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Sanitizuje a validuje vstup. Vrací vyčištěná data nebo chybu. */
export function normalizeContactSubmission(
  input: ContactSubmission
): { ok: true; data: ContactSubmission } | { ok: false; error: string } {
  const data: ContactSubmission = {
    name: sanitize(input.name ?? ""),
    email: sanitize(input.email ?? ""),
    phone: sanitize(input.phone ?? ""),
    message: sanitize(input.message ?? ""),
  };

  if (!data.name || !data.email || !data.message) {
    return { ok: false, error: "Name, email, and message are required." };
  }

  if (!isValidEmail(data.email)) {
    return { ok: false, error: "Invalid email address." };
  }

  if (data.message.length < 10) {
    return { ok: false, error: "Message must be at least 10 characters." };
  }

  return { ok: true, data };
}

function formatContactMessage(submission: ContactSubmission, now = new Date()): string {
  const e = escapeMarkdown;
  const lines = [
    `🔥 *NOVÁ POPTÁVKA — RECEPCE.TECH*`,
    ``,
    `👤 *Jméno:*`,
    e(submission.name),
    ``,
    `📧 *Email:*`,
    e(submission.email),
    ``,
    `📱 *Telefon:*`,
    e(submission.phone) || "—",
    ``,
    `💬 *Zpráva:*`,
    e(submission.message),
    ``,
    `🕒 *Čas:*`,
    now.toLocaleString("cs-CZ", { timeZone: "Europe/Prague" }),
    ``,
    `🌐 *Zdroj:*`,
    "Web contact form",
  ];
  return lines.join("\n");
}

/** Doménová logika kontaktního formuláře: validace + odeslání přes Telegram. */
export async function submitContactMessage(
  submission: ContactSubmission
): Promise<ContactResult> {
  const normalized = normalizeContactSubmission(submission);
  if (!normalized.ok) {
    return { ok: false, status: 400, error: normalized.error };
  }

  try {
    await sendTelegramMessage(formatContactMessage(normalized.data));
    return { ok: true };
  } catch (error) {
    if (error instanceof TelegramConfigError) {
      return { ok: false, status: 500, error: "Server configuration error." };
    }
    if (error instanceof TelegramSendError) {
      return { ok: false, status: 500, error: "Failed to send message." };
    }
    throw error;
  }
}
