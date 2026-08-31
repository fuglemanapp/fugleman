import { head } from "@vercel/blob";
import { NextResponse } from "next/server";

import { isBlobConfigured, isExpectedChatUploadPath, requireChatParticipant, validateChatFile, validateChatFileName } from "@/lib/chat";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para anexar arquivos." }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json({ error: "Os anexos ainda não foram configurados." }, { status: 503 });
  const payload = await request.json().catch(() => null) as { conversationId?: unknown; pathname?: unknown; fileName?: unknown } | null;
  const conversationId = typeof payload?.conversationId === "string" ? payload.conversationId : "";
  const pathname = typeof payload?.pathname === "string" ? payload.pathname : "";
  const fileName = typeof payload?.fileName === "string" ? payload.fileName.trim() : "";
  if (!conversationId || !isExpectedChatUploadPath(pathname, `chat/${conversationId}/`) || !fileName) return NextResponse.json({ error: "Anexo inválido." }, { status: 400 });
  if (!await requireChatParticipant(user.id, conversationId)) return NextResponse.json({ error: "Você não pode anexar arquivos nesta conversa." }, { status: 403 });

  const fileNameError = validateChatFileName(fileName);
  if (fileNameError) return NextResponse.json({ error: fileNameError }, { status: 400 });

  try {
    const blob = await head(pathname);
    const validationError = validateChatFile({ name: fileName, size: blob.size, type: blob.contentType });
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const existing = await prisma.chatAttachment.findUnique({ where: { pathname } });
    if (existing) {
      if (existing.ownerId !== user.id) return NextResponse.json({ error: "Anexo inválido." }, { status: 403 });
      return NextResponse.json({ attachment: existing });
    }
    const attachment = await prisma.chatAttachment.create({ data: { ownerId: user.id, pathname, fileName, contentType: blob.contentType, size: blob.size } });
    return NextResponse.json({ attachment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível confirmar o anexo enviado." }, { status: 400 });
  }
}
