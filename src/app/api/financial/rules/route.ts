import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

function optionalType(value: unknown) {
  return value === "INCOME" || value === "EXPENSE" ? value : null;
}

function validText(value: unknown, maximum: number) {
  return typeof value === "string" && value.trim() && value.trim().length <= maximum ? value.trim() : null;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para acessar suas regras." }, { status: 401 });
  const rules = await prisma.transactionRule.findMany({ where: { userId: user.id }, orderBy: [{ isActive: "desc" }, { createdAt: "asc" }] });
  return NextResponse.json({ rules });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para criar uma regra." }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const matchText = validText(body?.matchText, 100);
  const category = validText(body?.category, 80);
  if (!matchText || !category) return NextResponse.json({ error: "Informe o texto da regra e a categoria." }, { status: 400 });
  const rule = await prisma.transactionRule.create({ data: { userId: user.id, matchText, category, type: optionalType(body?.type), isActive: body?.isActive !== false } });
  return NextResponse.json({ rule }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para alterar uma regra." }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Regra inválida." }, { status: 400 });
  const current = await prisma.transactionRule.findFirst({ where: { id, userId: user.id } });
  if (!current) return NextResponse.json({ error: "Regra não encontrada." }, { status: 404 });
  const matchText = body?.matchText === undefined ? current.matchText : validText(body.matchText, 100);
  const category = body?.category === undefined ? current.category : validText(body.category, 80);
  if (!matchText || !category) return NextResponse.json({ error: "Informe o texto da regra e a categoria." }, { status: 400 });
  const type = body?.type === undefined ? current.type : optionalType(body.type);
  const isActive = typeof body?.isActive === "boolean" ? body.isActive : current.isActive;
  const rule = await prisma.transactionRule.update({ where: { id: current.id }, data: { matchText, category, type, isActive } });
  return NextResponse.json({ rule });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para remover uma regra." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") || "";
  const rule = await prisma.transactionRule.findFirst({ where: { id, userId: user.id }, select: { id: true } });
  if (!rule) return NextResponse.json({ error: "Regra não encontrada." }, { status: 404 });
  await prisma.transactionRule.delete({ where: { id: rule.id } });
  return new NextResponse(null, { status: 204 });
}
