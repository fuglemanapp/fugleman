import { NextResponse } from "next/server";

import { monthKey, dateFromMonthKey, statementDueDate } from "@/lib/credit-cards";
import { getCurrentUser } from "@/lib/current-user";
import { resolveFinancialContext } from "@/lib/financial-context";
import prisma from "@/lib/prisma";

function statementRange(start: Date, months: number) {
  return Array.from({ length: months }, (_, index) => new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + index, 1, 12)));
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para acessar faturas." }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const context = await resolveFinancialContext(user.id, params.get("context"));
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });
  const from = dateFromMonthKey(params.get("from") || new Date().toISOString().slice(0, 7));
  const months = Math.min(Math.max(Number(params.get("months") || 6), 1), 24);
  if (!from) return NextResponse.json({ error: "Período de fatura inválido." }, { status: 400 });
  const cardWhere = context.type === "FAMILY" ? { teamId: context.teamId } : { userId: user.id };
  const cards = await prisma.creditCard.findMany({ where: cardWhere, include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "asc" } });
  const monthsList = statementRange(from, months);
  const end = new Date(monthsList[monthsList.length - 1]); end.setUTCMonth(end.getUTCMonth() + 1);
  const installments = await prisma.cardInstallment.findMany({ where: { dueMonth: { gte: from, lt: end }, purchase: { cardId: { in: cards.map((card) => card.id) } } }, include: { purchase: { select: { cardId: true, description: true, category: true, installments: true, user: { select: { id: true, name: true, email: true } } } } } });
  const payments = await prisma.cardStatementPayment.findMany({ where: { cardId: { in: cards.map((card) => card.id) }, dueMonth: { gte: from, lt: end } } });
  const paymentByKey = new Map(payments.map((payment) => [`${payment.cardId}:${monthKey(payment.dueMonth)}`, payment]));
  const statements = cards.flatMap((card) => monthsList.map((dueMonth) => {
    const key = monthKey(dueMonth);
    const items = installments.filter((item) => item.purchase.cardId === card.id && monthKey(item.dueMonth) === key).map((item) => ({ id: item.id, number: item.number, amount: item.amount, description: item.purchase.description, category: item.purchase.category, installments: item.purchase.installments, user: item.purchase.user }));
    const payment = paymentByKey.get(`${card.id}:${key}`);
    return { card: { id: card.id, name: card.name, issuer: card.issuer, lastFour: card.lastFour, color: card.color, limit: card.limit, closingDay: card.closingDay, dueDay: card.dueDay, user: card.user }, dueMonth, dueDate: statementDueDate(dueMonth, card.dueDay), amount: items.reduce((total, item) => total + item.amount, 0), items, paidAt: payment?.paidAt || null, paidById: payment?.paidById || null };
  }));
  return NextResponse.json({ statements });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para marcar uma fatura." }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const context = await resolveFinancialContext(user.id, typeof body?.context === "string" ? body.context : null);
  const cardId = typeof body?.cardId === "string" ? body.cardId : "";
  const dueMonth = typeof body?.dueMonth === "string" ? dateFromMonthKey(body.dueMonth) : null;
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });
  if (!cardId || !dueMonth) return NextResponse.json({ error: "Fatura inválida." }, { status: 400 });
  const cardWhere = context.type === "FAMILY" ? { id: cardId, teamId: context.teamId } : { id: cardId, userId: user.id };
  const card = await prisma.creditCard.findFirst({ where: cardWhere, select: { id: true } });
  if (!card) return NextResponse.json({ error: "Fatura não encontrada nesse contexto." }, { status: 404 });
  const paid = body?.paid !== false;
  if (!paid) {
    await prisma.cardStatementPayment.deleteMany({ where: { cardId: card.id, dueMonth } });
    return NextResponse.json({ paidAt: null });
  }
  const payment = await prisma.cardStatementPayment.upsert({ where: { cardId_dueMonth: { cardId: card.id, dueMonth } }, create: { cardId: card.id, dueMonth, paidById: user.id }, update: { paidAt: new Date(), paidById: user.id } });
  return NextResponse.json({ payment });
}
