import "server-only";

export class TelegramConfigError extends Error {}
export class TelegramSendError extends Error {}

/**
 * Escapuje uživatelský obsah pro legacy Telegram Markdown.
 * Bez toho Telegram API vrací 400 "can't parse entities" na běžné znaky
 * v uživatelském vstupu (např. podtržítko v e-mailu, hvězdičky, závorky)
 * a zpráva se nedoručí.
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/[\\_*[\]`]/g, "\\$&");
}

/**
 * Transportní vrstva pro Telegram Bot API.
 * Volá se pouze ze serverového kódu.
 */
export async function sendTelegramMessage(text: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new TelegramConfigError("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
  }

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });

  if (!res.ok) {
    throw new TelegramSendError(`Telegram API error: ${res.status} ${res.statusText}`);
  }
}
