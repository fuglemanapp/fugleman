import { NextResponse } from "next/server";

import { ensureAssistantConversation, processAssistantMessage } from "@/lib/assistant-conversation";
import { retryDatabaseOperation } from "@/lib/database-retry";
import type { AgentAction } from "@/lib/personal-agent";
import prisma from "@/lib/prisma";
import { publicWhatsAppOnboardingReply } from "@/lib/whatsapp-onboarding";
import { normalizePhone, parseZernioInboundMessage, sendZernioInboxMessage, verifyZernioSignature } from "@/lib/zernio";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function findUserByPhone(phone: string) {
  const users = await prisma.user.findMany({ where: { phone: { not: null } }, select: { id: true, phone: true } });
  return users.find((user) => normalizePhone(user.phone) === phone) || null;
}

async function createAssistantReply(userId: string, text: string, hasAttachments: boolean, idempotencyKey: string) {
  const conversation = await ensureAssistantConversation(userId);
  await prisma.assistantMessage.create({ data: { conversationId: conversation.id, role: "USER", text } });

  let reply = hasAttachments
    ? "Recebi seu anexo. Por enquanto, descreva em texto o que você quer registrar ou analisar para eu agir com segurança."
    : "Não consegui interpretar essa mensagem com segurança. Pode reformular?";
  let action: AgentAction = { kind: "NONE" };

  if (text) {
    const result = await processAssistantMessage({ userId, conversationId: conversation.id, idempotencyKey, text });
    reply = result.reply;
    action = result.action;
  }

  await prisma.assistantMessage.create({ data: { conversationId: conversation.id, role: "ASSISTANT", text: reply, action } });
  await prisma.assistantConversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
  return reply;
}

function isDatabaseUnavailable(error: unknown) {
  return error instanceof Error && error.name === "PrismaClientInitializationError";
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const zernioSignature = request.headers.get("x-zernio-signature");
  const legacySignature = request.headers.get("x-late-signature");
  const signatures = [zernioSignature, legacySignature].filter((signature): signature is string => Boolean(signature));

  if (!signatures.some((signature) => verifyZernioSignature(rawBody, signature, process.env.ZERNIO_WEBHOOK_SECRET))) {
    console.warn("Rejected Zernio webhook signature", {
      hasWebhookSecret: Boolean(process.env.ZERNIO_WEBHOOK_SECRET),
      signatureHeader: zernioSignature ? "x-zernio-signature" : legacySignature ? "x-late-signature" : "missing",
      eventId: request.headers.get("x-zernio-event-id") ?? request.headers.get("x-late-event-id") ?? null,
    });
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ error: "Webhook payload inválido." }, { status: 400 });
  }
  if (typeof body === "object" && body && (body as { event?: unknown }).event === "webhook.test") {
    return NextResponse.json({ status: "ok" });
  }

  const inbound = parseZernioInboundMessage(body);
  if (!inbound) return NextResponse.json({ status: "ignored" });

  const configuredAccountId = process.env.ZERNIO_WHATSAPP_ACCOUNT_ID;
  if (!process.env.ZERNIO_API_KEY) {
    return NextResponse.json({ error: "A chave da integração do WhatsApp ainda não foi configurada." }, { status: 503 });
  }

  if (
    !inbound.accountId ||
    (configuredAccountId && inbound.accountId !== configuredAccountId) ||
    !inbound.conversationId ||
    !inbound.senderPhone
  ) {
    return NextResponse.json({ status: "ignored" });
  }

  const accountId = inbound.accountId;
  const conversationId = inbound.conversationId;
  const senderPhone = inbound.senderPhone;

  try {
    return await retryDatabaseOperation(async () => {
      let event = await prisma.zernioWebhookEvent.findUnique({ where: { id: inbound.eventId } });
      if (!event) {
        try {
          event = await prisma.zernioWebhookEvent.create({
            data: { id: inbound.eventId, event: "message.received", accountId, conversationId },
          });
        } catch {
          event = await prisma.zernioWebhookEvent.findUnique({ where: { id: inbound.eventId } });
        }
      }

      if (!event) return NextResponse.json({ error: "Não foi possível processar esta mensagem." }, { status: 500 });

      if (!event.responseText) {
        const user = await findUserByPhone(senderPhone);
        if (!user) {
          event = await prisma.zernioWebhookEvent.update({
            where: { id: event.id },
            data: { responseText: publicWhatsAppOnboardingReply() },
          });
        } else {
          const reply = await createAssistantReply(user.id, inbound.text || "", inbound.hasAttachments, event.id);
          event = await prisma.zernioWebhookEvent.update({ where: { id: event.id }, data: { userId: user.id, responseText: reply } });
        }
      }

      if (!event.deliveredAt && event.responseText) {
        try {
          await sendZernioInboxMessage({
            accountId,
            conversationId,
            message: event.responseText,
            replyTo: inbound.platformMessageId,
            idempotencyKey: `whatspent:${event.id}:reply`,
          });
          await prisma.zernioWebhookEvent.update({ where: { id: event.id }, data: { deliveredAt: new Date() } });
        } catch (error) {
          console.error("Zernio reply failed", error);
          return NextResponse.json({ error: "Não foi possível responder agora." }, { status: 503 });
        }
      }

      return NextResponse.json({ status: "processed" });
    });
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error;

    console.error("WhatsApp webhook database temporarily unavailable", { eventId: inbound.eventId });
    try {
      await sendZernioInboxMessage({
        accountId,
        conversationId,
        message: "O WhatSpent está com uma instabilidade temporária e não salvou esta mensagem. Tente novamente em alguns instantes.",
        replyTo: inbound.platformMessageId,
        idempotencyKey: `whatspent:${inbound.eventId}:database-unavailable`,
      });
    } catch (replyError) {
      console.error("WhatsApp fallback reply failed", replyError);
    }

    return NextResponse.json({ error: "Banco temporariamente indisponível." }, { status: 503 });
  }
}
