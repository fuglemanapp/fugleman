import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent, updateGoogleCalendarEvent } from "@/lib/google-calendar";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseDate(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para acessar sua agenda." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = parseDate(searchParams.get("from"));
  const to = parseDate(searchParams.get("to"));
  const view = searchParams.get("view") || "personal";
  const teamId = searchParams.get("teamId");

  if (!from || !to || to <= from) {
    return NextResponse.json({ error: "Período da agenda inválido." }, { status: 400 });
  }

  let userIds = [user.id];
  if (view === "family") {
    if (!teamId) return NextResponse.json({ error: "Selecione uma família para visualizar a agenda." }, { status: 400 });
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: user.id } },
      include: { team: { select: { members: { select: { userId: true } } } } },
    });
    if (!membership) return NextResponse.json({ error: "Você não faz parte desta família." }, { status: 403 });
    userIds = membership.team.members.map((member) => member.userId);
  } else if (view !== "personal") {
    return NextResponse.json({ error: "Visualização da agenda inválida." }, { status: 400 });
  }

  const events = await prisma.event.findMany({
    where: { userId: { in: userIds }, startTime: { gte: from, lt: to } },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json({ events: events.map((event) => ({ ...event, isOwner: event.userId === user.id, owner: event.user })) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para criar um compromisso." }, { status: 401 });
  }

  let payload: { title?: unknown; description?: unknown; startTime?: unknown; endTime?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados do compromisso inválidos." }, { status: 400 });
  }

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const description = typeof payload.description === "string" ? payload.description.trim() : "";
  const startTime = parseDate(payload.startTime);
  const endTime = parseDate(payload.endTime);

  if (!title || title.length > 120) {
    return NextResponse.json({ error: "Informe um título de até 120 caracteres." }, { status: 400 });
  }

  if (description.length > 1000) {
    return NextResponse.json({ error: "A descrição pode ter no máximo 1000 caracteres." }, { status: 400 });
  }

  if (!startTime || !endTime || endTime <= startTime) {
    return NextResponse.json({ error: "Escolha um horário de término posterior ao início." }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title,
      description: description || null,
      startTime,
      endTime,
      userId: user.id,
    },
  });

  const sync = await createGoogleCalendarEvent(user.id, event);
  return NextResponse.json({ event, syncWarning: sync.synced ? null : sync.error }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para excluir um compromisso." }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Compromisso inválido." }, { status: 400 });
  }

  const event = await prisma.event.findFirst({ where: { id, userId: user.id }, select: { id: true, googleEventId: true } });

  if (!event) {
    return NextResponse.json({ error: "Compromisso não encontrado." }, { status: 404 });
  }

  const sync = event.googleEventId ? await deleteGoogleCalendarEvent(user.id, event.googleEventId) : { synced: true as const };
  await prisma.event.delete({ where: { id: event.id } });
  return NextResponse.json({ deleted: true, syncWarning: sync.synced ? null : sync.error });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para editar um compromisso." }, { status: 401 });

  let payload: { id?: unknown; title?: unknown; description?: unknown; startTime?: unknown; endTime?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados do compromisso inválidos." }, { status: 400 });
  }
  const id = typeof payload.id === "string" ? payload.id : "";
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const description = typeof payload.description === "string" ? payload.description.trim() : "";
  const startTime = parseDate(payload.startTime);
  const endTime = parseDate(payload.endTime);
  if (!id || !title || title.length > 120 || description.length > 1000 || !startTime || !endTime || endTime <= startTime) {
    return NextResponse.json({ error: "Verifique título, descrição e horários do compromisso." }, { status: 400 });
  }

  const existing = await prisma.event.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Você só pode editar os seus próprios compromissos." }, { status: 403 });
  const event = await prisma.event.update({
    where: { id },
    data: { title, description: description || null, startTime, endTime },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  const sync = await updateGoogleCalendarEvent(user.id, event);
  return NextResponse.json({ event: { ...event, isOwner: true, owner: event.user }, syncWarning: sync.synced ? null : sync.error });
}
