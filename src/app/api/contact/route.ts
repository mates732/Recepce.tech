import { NextRequest, NextResponse } from "next/server";

interface ContactBody {
  name: string;
  email: string;
  phone: string;
  message: string;
  _hp?: string;
}

interface RateLimitEntry {
  count: number;
  reset: number;
}

const rateLimit = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60_000;

function sanitize(input: string): string {
  return input.trim().replace(/<[^>]*>/g, "").replace(/[<>]/g, "");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const ip = getIp(request);
    const now = Date.now();

    const entry = rateLimit.get(ip);
    if (entry) {
      if (now > entry.reset) {
        rateLimit.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW });
      } else if (entry.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { success: false, error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      } else {
        entry.count++;
      }
    } else {
      rateLimit.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW });
    }

    const body: ContactBody = await request.json();

    if (body._hp) {
      return NextResponse.json({ success: true });
    }

    const name = sanitize(body.name ?? "");
    const email = sanitize(body.email ?? "");
    const phone = sanitize(body.phone ?? "");
    const message = sanitize(body.message ?? "");

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { success: false, error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const lines = [
      `🔥 *NOVÁ POPTÁVKA — RECEPCE.TECH*`,
      ``,
      `👤 *Jméno:*`,
      name,
      ``,
      `📧 *Email:*`,
      email,
      ``,
      `📱 *Telefon:*`,
      phone || "—",
      ``,
      `💬 *Zpráva:*`,
      message,
      ``,
      `🕒 *Čas:*`,
      new Date().toLocaleString("cs-CZ", { timeZone: "Europe/Prague" }),
      ``,
      `🌐 *Zdroj:*`,
      "Web contact form",
    ];

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramRes.ok) {
      const errorText = await telegramRes.text();
      console.error("Telegram API error:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to send message." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
