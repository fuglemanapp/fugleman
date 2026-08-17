import { head } from "@vercel/blob";
import { NextResponse } from "next/server";

import { ensureAssistantConversation } from "@/lib/assistant-conversation";
import { isBlobConfigured, validateChatFile } from "@/lib/chat";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type UploadCompletePayload = { conversationId?: unknown; pathname?: unknown; fileName?: unknown };

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para anexar arquivos." }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json({ error: "Os anexos ainda não foram configurados." }, { status: 503 });

  const payload = (await request.json().catch(() => null)) as UploadCompletePayload | null;
  const conversation = await ensureAssistantConversation(user.id);
  const conversationId = typeof payload?.conversationId === "string" ? payload.conversationId : "";
  const pathname = typeof payload?.pathname === "string" ? payload.pathname : "";
  const fileName = typeof payload?.fileName === "string" ? payload.fileName.trim() : "";

  if (conversationId !== conversation.id || !pathname.startsWith(`assistant/${conversation.id}/`) || !fileName) {
    return NextResponse.json({ error: "Anexo inválido." }, { status: 400 });
  }

  try {
    const blob = await head(pathname);
    const validationError = validateChatFile({ name: fileName, size: blob.size, type: blob.contentType });
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const existing = await prisma.assistantAttachment.findUnique({ where: { pathname } });
    if (existing) return NextResponse.json({ attachment: existing });
    const attachment = await prisma.assistantAttachment.create({
      data: { conversationId: conversation.id, pathname, fileName, contentType: blob.contentType, size: blob.size },
    });
    return NextResponse.json({ attachment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível confirmar o anexo enviado." }, { status: 400 });
  }
}
