import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { requireTeamAdmin } from "@/lib/financial-context";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const teamId = new URL(request.url).searchParams.get("teamId");

  if (!user) {
    return NextResponse.json({ error: "Faça login para gerenciar convites." }, { status: 401 });
  }

  if (!teamId || !(await requireTeamAdmin(user.id, teamId))) {
    return NextResponse.json({ error: "Sem permissão para ver convites." }, { status: 403 });
  }

  const invitations = await prisma.financialInvite.findMany({
    where: { teamId },
    select: { id: true, expiresAt: true, acceptedAt: true, revokedAt: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ invitations });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para criar um convite." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { teamId?: unknown } | null;
  const teamId = typeof payload?.teamId === "string" ? payload.teamId : "";

  if (!teamId || !(await requireTeamAdmin(user.id, teamId))) {
    return NextResponse.json({ error: "Sem permissão para criar convites." }, { status: 403 });
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const invite = await prisma.financialInvite.create({
    data: { teamId, createdById: user.id, tokenHash: hashToken(token), expiresAt },
    select: { id: true, expiresAt: true },
  });

  return NextResponse.json(
    { invite: { ...invite, url: `${new URL(request.url).origin}/convite/${token}` } },
    { status: 201 },
  );
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para revogar um convite." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { inviteId?: unknown } | null;
  const inviteId = typeof payload?.inviteId === "string" ? payload.inviteId : "";
  const invite = inviteId ? await prisma.financialInvite.findUnique({ where: { id: inviteId } }) : null;

  if (!invite || !(await requireTeamAdmin(user.id, invite.teamId))) {
    return NextResponse.json({ error: "Convite não encontrado ou sem permissão." }, { status: 404 });
  }

  await prisma.financialInvite.update({ where: { id: invite.id }, data: { revokedAt: new Date() } });
  return new NextResponse(null, { status: 204 });
}
