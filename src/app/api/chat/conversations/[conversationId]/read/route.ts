import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ conversationId: string }> };

export async function POST(_: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para atualizar a leitura." }, { status: 401 });
  const { conversationId } = await params;
  const participant = await prisma.chatParticipant.findFirst({ where: { conversationId, userId: user.id, conversation: { team: { members: { some: { userId: user.id } } } } }, select: { id: true } });
  if (!participant) return NextResponse.json({ error: "Conversa não encontrada." }, { status: 404 });
  await prisma.chatParticipant.update({ where: { id: participant.id }, data: { lastReadAt: new Date() } });
  return NextResponse.json({ ok: true });
}
