import { NextResponse } from "next/server";

import { ensureAssistantConversation } from "@/lib/assistant-conversation";
import { normalizeChatText } from "@/lib/chat";
import { getCurrentUser } from "@/lib/current-user";
import { persistAgentAction } from "@/lib/personal-agent-effects";
import { runPersonalAgent, type AgentAction } from "@/lib/personal-agent";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type MessagePayload = { text?: unknown; attachmentIds?: unknown };

function attachmentReply(contentTypes: string[]) {
  if (contentTypes.some((contentType) => contentType.startsWith("audio/"))) {
    return "Recebi seu áudio com segurança. A transcrição automática ainda não está configurada; envie também por texto o que deseja registrar.";
  }

  return "Recebi o anexo com segurança. Você pode me dizer por texto o que gostaria que eu analisasse ou registrasse.";
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para enviar uma mensagem." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as MessagePayload | null;
  const text = normalizeChatText(payload?.text);
  const attachmentIds = Array.isArray(payload?.attachmentIds)
    ? payload.attachmentIds.filter((id): id is string => typeof id === "string")
    : [];

  if ((!text && attachmentIds.length === 0) || attachmentIds.length > 10) {
    return NextResponse.json({ error: "Escreva uma mensagem ou selecione até 10 anexos." }, { status: 400 });
  }

  const conversation = await ensureAssistantConversation(user.id);
  const attachments = attachmentIds.length
    ? await prisma.assistantAttachment.findMany({
        where: { id: { in: attachmentIds }, conversationId: conversation.id, messageId: null },
        select: { id: true, contentType: true },
      })
    : [];

  if (attachments.length !== new Set(attachmentIds).size) {
    return NextResponse.json({ error: "Um ou mais anexos não estão disponíveis." }, { status: 400 });
  }

  const userMessage = await prisma.assistantMessage.create({
    data: {
      conversationId: conversation.id,
      role: "USER",
      text,
      attachments: { connect: attachments.map((attachment) => ({ id: attachment.id })) },
    },
    include: { attachments: true },
  });

  let reply = attachmentReply(attachments.map((attachment) => attachment.contentType));
  let action: AgentAction = { kind: "NONE" };

  if (text) {
    const result = await runPersonalAgent({ userId: user.id, text });
    reply = result.reply;
    action = result.action;

    try {
      const persistence = await persistAgentAction(user.id, action);
      if (persistence.confirmation) {
        reply = persistence.confirmation;
      }
      if (persistence.warning) {
        reply = `${reply}\n\n${persistence.warning}`;
      }
    } catch {
      action = { kind: "NONE" };
      reply = "Não consegui salvar essa ação com segurança. Tente novamente; nenhum lançamento foi criado.";
    }
  }

  const assistantMessage = await prisma.assistantMessage.create({
    data: { conversationId: conversation.id, role: "ASSISTANT", text: reply, action },
  });
  await prisma.assistantConversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });

  return NextResponse.json({ messages: [userMessage, assistantMessage] }, { status: 201 });
}
