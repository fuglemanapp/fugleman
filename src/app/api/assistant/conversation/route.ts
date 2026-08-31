import { NextResponse } from "next/server";

import { ensureAssistantConversation } from "@/lib/assistant-conversation";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para conversar com o WhatSpent." }, { status: 401 });
  }

  const baseConversation = await ensureAssistantConversation(user.id);
  const conversation = await prisma.assistantConversation.findUniqueOrThrow({
    where: { id: baseConversation.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 100,
        include: { attachments: { orderBy: { createdAt: "asc" } } },
      },
    },
  });

  return NextResponse.json({ conversation });
}
