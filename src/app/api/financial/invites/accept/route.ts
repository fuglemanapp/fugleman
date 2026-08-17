import { createHash } from "crypto";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Entre ou crie sua conta antes de aceitar o convite." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { token?: unknown } | null;
  const token = typeof payload?.token === "string" ? payload.token : "";

  if (!token) {
    return NextResponse.json({ error: "Convite inválido." }, { status: 400 });
  }

  const invite = await prisma.financialInvite.findUnique({ where: { tokenHash: hashToken(token) } });

  if (!invite || invite.revokedAt || invite.acceptedAt || invite.expiresAt <= new Date()) {
    return NextResponse.json({ error: "Este convite expirou, foi usado ou foi revogado." }, { status: 410 });
  }

  await prisma.$transaction([
    prisma.teamMember.upsert({
      where: { teamId_userId: { teamId: invite.teamId, userId: user.id } },
      create: { teamId: invite.teamId, userId: user.id, role: "MEMBER" },
      update: {},
    }),
    prisma.financialInvite.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date(), acceptedById: user.id },
    }),
  ]);

  return NextResponse.json({ ok: true, teamId: invite.teamId });
}
