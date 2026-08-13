import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { resolveFinancialContext } from "@/lib/financial-context";
import prisma from "@/lib/prisma";

function validText(value: unknown, maximum: number) {
  return typeof value === "string" && value.trim() && value.trim().length <= maximum ? value.trim() : null;
}

function validDay(value: unknown) {
  const day = Number(value);
  return Number.isInteger(day) && day >= 1 && day <= 28 ? day : null;
}

function validLimit(value: unknown) {
  const limit = Number(value);
  return Number.isFinite(limit) && limit >= 0 && limit <= 1_000_000_000 ? limit : null;
}

function validColor(value: unknown) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : null;
}

function validLastFour(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  return typeof value === "string" && /^\d{4}$/.test(value) ? value : undefined;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para acessar seus cartões." }, { status: 401 });
  const context = await resolveFinancialContext(user.id, new URL(request.url).searchParams.get("context"));
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });
  const where = context.type === "FAMILY" ? { teamId: context.teamId } : { userId: user.id };
  const cards = await prisma.creditCard.findMany({ where, include: { user: { select: { id: true, name: true, email: true } } }, orderBy: [{ isActive: "desc" }, { createdAt: "asc" }] });
  return NextResponse.json({ context: { key: context.key, type: context.type }, cards, canCreate: true });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para criar um cartão." }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const context = await resolveFinancialContext(user.id, typeof body?.context === "string" ? body.context : null);
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });
  const name = validText(body?.name, 80);
  const issuer = body?.issuer === undefined || body.issuer === "" ? null : validText(body.issuer, 80);
  const lastFour = validLastFour(body?.lastFour);
  const color = validColor(body?.color) || "#0B9D4E";
  const limit = validLimit(body?.limit);
  const closingDay = validDay(body?.closingDay);
  const dueDay = validDay(body?.dueDay);
  if (!name || lastFour === undefined || limit === null || closingDay === null || dueDay === null || (body?.issuer !== undefined && body.issuer !== "" && !issuer)) return NextResponse.json({ error: "Confira os dados do cartão." }, { status: 400 });
  const card = await prisma.creditCard.create({ data: { userId: user.id, teamId: context.type === "FAMILY" ? context.teamId : null, name, issuer, lastFour, color, limit, closingDay, dueDay } , include: { user: { select: { id: true, name: true, email: true } } } });
  return NextResponse.json({ card }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para alterar um cartão." }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const id = typeof body?.id === "string" ? body.id : "";
  const card = await prisma.creditCard.findFirst({ where: { id, userId: user.id } });
  if (!card) return NextResponse.json({ error: "Cartão não encontrado ou sem permissão para alterar." }, { status: 404 });
  const name = body?.name === undefined ? card.name : validText(body.name, 80);
  const issuer = body?.issuer === undefined ? card.issuer : body.issuer === "" ? null : validText(body.issuer, 80);
  const lastFour = body?.lastFour === undefined ? card.lastFour : validLastFour(body.lastFour);
  const color = body?.color === undefined ? card.color : validColor(body.color);
  const limit = body?.limit === undefined ? card.limit : validLimit(body.limit);
  const closingDay = body?.closingDay === undefined ? card.closingDay : validDay(body.closingDay);
  const dueDay = body?.dueDay === undefined ? card.dueDay : validDay(body.dueDay);
  if (!name || !issuer && body?.issuer !== "" && body?.issuer !== undefined || lastFour === undefined || !color || limit === null || closingDay === null || dueDay === null) return NextResponse.json({ error: "Confira os dados do cartão." }, { status: 400 });
  const updated = await prisma.creditCard.update({ where: { id: card.id }, data: { name, issuer, lastFour, color, limit, closingDay, dueDay, isActive: typeof body?.isActive === "boolean" ? body.isActive : card.isActive }, include: { user: { select: { id: true, name: true, email: true } } } });
  return NextResponse.json({ card: updated });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para remover um cartão." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") || "";
  const card = await prisma.creditCard.findFirst({ where: { id, userId: user.id }, select: { id: true } });
  if (!card) return NextResponse.json({ error: "Cartão não encontrado ou sem permissão para remover." }, { status: 404 });
  await prisma.creditCard.update({ where: { id: card.id }, data: { isActive: false } });
  return new NextResponse(null, { status: 204 });
}
