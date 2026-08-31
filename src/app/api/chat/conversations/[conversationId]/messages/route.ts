import { NextResponse } from "next/server";

import { normalizeChatText, requireChatParticipant } from "@/lib/chat";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/rate-limit";
import { reportSecurityEvent } from "@/lib/security-events";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ conversationId: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para acessar as mensagens." }, { status: 401 });
  const { conversationId } = await params;
  if (!await requireChatParticipant(user.id, conversationId)) return NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });

  const messages = await prisma.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      sender: { select: { id: true, name: true, email: true, image: true } },
      attachments: { select: { id: true, fileName: true, contentType: true, size: true, createdAt: true } },
    },
  });
  return NextResponse.json({ messages: messages.reverse() });
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para enviar mensagens." }, { status: 401 });
  const limit = await consumeRateLimit(`chat-message:${user.id}`, { limit: 30, windowMs: 60 * 1_000 });
  if (!limit.allowed) {
    reportSecurityEvent("rate_limit_reached", { route: "/api/chat/conversations/messages", scope: "chat_message" });
    return NextResponse.json(
      { error: "Muitas mensagens em pouco tempo. Aguarde um minuto e tente novamente." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }
  const { conversationId } = await params;
  if (!await requireChatParticipant(user.id, conversationId)) return NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });

  const payload = await request.json().catch(() => null) as { text?: unknown; attachmentIds?: unknown } | null;
  const text = normalizeChatText(payload?.text);
  const attachmentIds = Array.isArray(payload?.attachmentIds) ? payload.attachmentIds.filter((id): id is string => typeof id === "string") : [];
  if ((!text && attachmentIds.length === 0) || attachmentIds.length > 10) return NextResponse.json({ error: "Escreva uma mensagem ou selecione até 10 anexos." }, { status: 400 });

  const attachments = attachmentIds.length ? await prisma.chatAttachment.findMany({ where: { id: { in: attachmentIds }, ownerId: user.id, messageId: null }, select: { id: true } }) : [];
  if (attachments.length !== new Set(attachmentIds).size) return NextResponse.json({ error: "Um ou mais anexos não estão disponíveis." }, { status: 400 });

  const message = await prisma.$transaction(async (database) => {
    const created = await database.chatMessage.create({
      data: { conversationId, senderId: user.id, text, attachments: { connect: attachments.map((attachment) => ({ id: attachment.id })) } },
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
        attachments: { select: { id: true, fileName: true, contentType: true, size: true, createdAt: true } },
      },
    });
    await database.chatConversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
    return created;
  });
  return NextResponse.json({ message }, { status: 201 });
}
