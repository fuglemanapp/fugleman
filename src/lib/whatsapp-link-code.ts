import { randomInt } from "node:crypto";

// WhatsApp business number that users message (digits only, for wa.me links).
export const WHATSAPP_BUSINESS_NUMBER = "13218448741";

// Non-ambiguous alphabet (no 0/O/1/I) for codes that people read/type.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;
// Trigger word that precedes the code in the pre-filled message.
const TRIGGER = "CONECTAR";

export function generateLinkCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

/** The message the user sends to link their number (button pre-fills this). */
export function whatsappLinkMessage(code: string): string {
  return `${TRIGGER} ${code}`;
}

/** wa.me deep link that opens WhatsApp with the linking message pre-filled. */
export function buildWhatsappLinkUrl(code: string): string {
  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(whatsappLinkMessage(code))}`;
}

/**
 * Extracts a link code from an inbound message, or null if none is present.
 * Accepts "CONECTAR ABC123" or the bare code pasted on its own. The returned
 * code is only a candidate — the caller validates it against issued codes.
 */
export function extractWhatsappLinkCode(text: string | null | undefined): string | null {
  if (!text) return null;
  const upper = text.toUpperCase();
  const token = `[${CODE_ALPHABET}]{${CODE_LENGTH}}`;

  const withTrigger = upper.match(new RegExp(`${TRIGGER}\\s*[:\\-]?\\s*(${token})`));
  if (withTrigger) return withTrigger[1];

  // Bare, standalone code (e.g. the user copied and pasted just the code).
  const bare = upper.match(new RegExp(`(?:^|\\s)(${token})(?:\\s|$)`));
  return bare ? bare[1] : null;
}
