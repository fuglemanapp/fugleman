import { NextResponse } from "next/server";

import { availableFinancialContexts } from "@/lib/financial-context";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para ver seus espaços." }, { status: 401 });
  }

  const [workspaces, memberships] = await Promise.all([
    availableFinancialContexts(user.id),
    prisma.teamMember.findMany({
      where: { userId: user.id },
      include: {
        team: {
          include: {
            members: {
              include: { user: { select: { id: true, name: true, email: true } } },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return NextResponse.json({
    workspaces,
    families: memberships.map((membership) => ({
      id: membership.teamId,
      name: membership.team.name,
      role: membership.role,
      members: membership.team.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        role: member.role,
        name: member.user.name,
        email: member.user.email,
      })),
    })),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para criar uma família." }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as { name?: unknown } | null;
  const name = typeof payload?.name === "string" ? payload.name.trim() : "";

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Informe um nome de 2 a 80 caracteres." }, { status: 400 });
  }

  const team = await prisma.team.create({
    data: { name, members: { create: { userId: user.id, role: "ADMIN" } } },
    select: { id: true, name: true },
  });

  return NextResponse.json(
    { workspace: { key: `team:${team.id}`, label: team.name, type: "FAMILY", role: "ADMIN" } },
    { status: 201 },
  );
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para gerenciar membros." }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const teamId = params.get("teamId");
  const memberId = params.get("memberId");

  if (!teamId || !memberId) {
    return NextResponse.json({ error: "Membro inválido." }, { status: 400 });
  }

  const [admin, member] = await Promise.all([
    prisma.teamMember.findUnique({ where: { teamId_userId: { teamId, userId: user.id } } }),
    prisma.teamMember.findFirst({ where: { id: memberId, teamId } }),
  ]);

  if (!admin || admin.role !== "ADMIN" || !member) {
    return NextResponse.json({ error: "Sem permissão para remover este membro." }, { status: 403 });
  }

  if (member.userId === user.id || member.role === "ADMIN") {
    return NextResponse.json({ error: "O administrador não pode ser removido deste espaço." }, { status: 400 });
  }

  await prisma.teamMember.delete({ where: { id: member.id } });
  return new NextResponse(null, { status: 204 });
}
