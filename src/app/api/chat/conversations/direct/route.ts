import { NextResponse } from "next/server";

import { createOrFindDirectConversation } from "@/lib/chat";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para iniciar uma conversa." }, { status: 401 });
  const payload = await request.json().catch(() => null) as { teamId?: unknown; recipientId?: unknown } | null;
  const teamId = typeof payload?.teamId === "string" ? payload.teamId : "";
  const recipientId = typeof payload?.recipientId === "string" ? payload.recipientId : "";
  if (!teamId || !recipientId || recipientId === user.id) return NextResponse.json({ error: "Escolha outro membro da família." }, { status: 400 });

  const membership = await prisma.teamMember.findUnique({ where: { teamId_userId: { teamId, userId: user.id } }, select: { id: true } });
  if (!membership) return NextResponse.json({ error: "Você não tem acesso a esse espaço familiar." }, { status: 403 });
  const conversation = await createOrFindDirectConversation(teamId, user.id, recipientId);
  if (!conversation) return NextResponse.json({ error: "O membro escolhido não pertence a esta família." }, { status: 403 });
  return NextResponse.json({ conversation }, { status: 201 });
}
