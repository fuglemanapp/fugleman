import { createHmac, timingSafeEqual } from "node:crypto";

const ZERNIO_API_BASE = "https://zernio.com/api/v1";

type ZernioRecord = Record<string, unknown>;

export type ZernioInboundMessage = {
  eventId: string;
  accountId: string | null;
  conversationId: string | null;
  platformMessageId: string | null;
  senderPhone: string | null;
  text: string | null;
  hasAttachments: boolean;
};

function record(value: unknown): ZernioRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as ZernioRecord : null;
}

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const candidate = text(value);
    if (candidate) return candidate;
  }

  return null;
}

export function normalizePhone(value: string | null | undefined) {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 20 ? `+${digits}` : null;
}

export function verifyZernioSignature(rawBody: string, signature: string | null, secret: string | undefined) {
  if (!signature || !secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return received.length === expectedBuffer.length && timingSafeEqual(received, expectedBuffer);
}

export function parseZernioInboundMessage(value: unknown): ZernioInboundMessage | null {
  const body = record(value);
  if (!body || body.event !== "message.received") return null;

  const message = record(body.message);
  if (!message) return null;

  const account = record(body.account);
  const sender = record(message.sender);
  const conversation = record(message.conversation);
  const attachments = Array.isArray(message.attachments) ? message.attachments : [];
  const eventId = text(body.id);

  if (!eventId) return null;

  return {
    eventId,
    accountId: firstText(account?.id, account?.accountId, account?._id, message.accountId),
    conversationId: firstText(message.conversationId, conversation?.id, body.conversationId),
    platformMessageId: firstText(message.platformMessageId, message.id),
    senderPhone: normalizePhone(firstText(sender?.phoneNumber, sender?.id, message.senderPhone)),
    text: text(message.text),
    hasAttachments: attachments.length > 0,
  };
}

export async function sendZernioInboxMessage(input: {
  accountId: string;
  conversationId: string;
  message: string;
  replyTo?: string | null;
  idempotencyKey: string;
}) {
  const apiKey = process.env.ZERNIO_API_KEY;
  if (!apiKey) throw new Error("ZERNIO_API_KEY não configurada.");

  const response = await fetch(`${ZERNIO_API_BASE}/inbox/conversations/${encodeURIComponent(input.conversationId)}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.idempotencyKey,
    },
    body: JSON.stringify({
      accountId: input.accountId,
      message: input.message,
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`A Zernio recusou a resposta (${response.status}).`);
  }
}
