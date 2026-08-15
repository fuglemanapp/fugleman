import { NextResponse } from "next/server";

import { ensureFamilyConversation } from "@/lib/chat";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para acessar as conversas." }, { status: 401 });

  const memberships = await prisma.teamMember.findMany({ where: { userId: user.id }, select: { teamId: true } });
  await Promise.all(memberships.map((membership) => ensureFamilyConversation(membership.teamId)));

  const conversations = await prisma.chatParticipant.findMany({
    where: { userId: user.id, conversation: { team: { members: { some: { userId: user.id } } } }, },
    include: {
      conversation: {
        include: {
          team: { select: { id: true, name: true } },
          participants: { include: { user: { select: { id: true, name: true, email: true, image: true } } } },
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
            include: { sender: { select: { id: true, name: true } } },
          },
        },
      },
    },
    orderBy: { conversation: { updatedAt: "desc" } },
  });

  const result = await Promise.all(conversations.map(async (participant) => {
    const conversation = participant.conversation;
    const otherParticipant = conversation.participants.find((item) => item.userId !== user.id)?.user;
    const unreadCount = await prisma.chatMessage.count({
      where: {
        conversationId: conversation.id,
        senderId: { not: user.id },
        ...(participant.lastReadAt ? { createdAt: { gt: participant.lastReadAt } } : {}),
      },
    });
    const lastMessage = conversation.messages[0];
    return {
      id: conversation.id,
      teamId: conversation.teamId,
      kind: conversation.kind,
      title: conversation.kind === "FAMILY" ? "Família" : otherParticipant?.name || otherParticipant?.email || "Conversa privada",
      teamName: conversation.team.name,
      updatedAt: conversation.updatedAt,
      unreadCount,
      lastMessage: lastMessage ? { text: lastMessage.text, createdAt: lastMessage.createdAt, senderName: lastMessage.sender.name } : null,
      participants: conversation.participants.map((item) => ({ id: item.user.id, name: item.user.name, email: item.user.email, image: item.user.image })),
    };
  }));

  return NextResponse.json({ conversations: result });
}
