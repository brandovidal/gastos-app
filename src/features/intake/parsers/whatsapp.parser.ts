import type { IntakeItem } from "../intake.validator";

const AMOUNT_REGEX = /(?:S\/\s*|s\/\s*|\$\s*)?(\d+(?:[.,]\d{1,2})?)/;
const CURRENCY_REGEX = /\$|USD|usd|dolar|dolares/i;
const DATE_REGEX = /(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/;

const ACCOUNT_ALIASES: Record<string, string> = {
  bcp: "BCP",
  interbank: "Interbank",
  yape: "Yape",
  plin: "Plin",
  cmr: "CMR",
  falabella: "CMR",
  ohpay: "OhPay",
  oh: "OhPay",
  io: "IO",
  amex: "IO",
};

function parseAmount(text: string): { amount: number; currency: "PEN" | "USD" } | null {
  const match = text.match(AMOUNT_REGEX);
  if (!match) return null;
  const raw = match[1].replace(",", ".");
  const amount = parseFloat(raw);
  if (isNaN(amount) || amount <= 0) return null;

  const currency = CURRENCY_REGEX.test(text) ? "USD" as const : "PEN" as const;
  return { amount, currency };
}

function parseAccount(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [alias, account] of Object.entries(ACCOUNT_ALIASES)) {
    if (lower.includes(alias)) return account;
  }
  return null;
}

function parseDate(text: string): string | null {
  const lower = text.toLowerCase();
  const today = new Date();

  if (lower.includes("hoy")) {
    return today.toISOString().split("T")[0];
  }
  if (lower.includes("ayer")) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }

  const match = text.match(DATE_REGEX);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = match[3]
      ? parseInt(match[3], 10) < 100
        ? 2000 + parseInt(match[3], 10)
        : parseInt(match[3], 10)
      : today.getFullYear();
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return today.toISOString().split("T")[0];
}

function extractDescription(text: string): string {
  let desc = text
    .replace(AMOUNT_REGEX, "")
    .replace(DATE_REGEX, "")
    .replace(/S\/|s\/|\$/g, "")
    .replace(/\b(hoy|ayer)\b/gi, "");

  // Remove account aliases
  for (const alias of Object.keys(ACCOUNT_ALIASES)) {
    desc = desc.replace(new RegExp(`\\b${alias}\\b`, "gi"), "");
  }

  desc = desc.replace(/\s+/g, " ").trim();
  return desc || "Gasto sin descripcion";
}

export function parseWhatsAppMessage(text: string): Partial<IntakeItem> {
  const parsed = parseAmount(text);
  const account = parseAccount(text);
  const date = parseDate(text);
  const description = extractDescription(text);

  return {
    source: "whatsapp",
    sourceDocumentType: "whatsapp_text",
    rawText: text,
    description,
    amount: parsed?.amount ?? 0,
    currency: parsed?.currency ?? "PEN",
    date,
    account,
    status: "pending",
  };
}
