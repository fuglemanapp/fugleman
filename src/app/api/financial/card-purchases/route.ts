import { NextResponse } from "next/server";

import { normalizeCardPurchaseInput } from "@/lib/card-purchase-input";
import { buildPendingInstallments, calculatePurchaseTotal } from "@/lib/credit-cards";
import { getCurrentUser } from "@/lib/current-user";
import { resolveFinancialContext } from "@/lib/financial-context";
import { validDate } from "@/lib/financial-input";
import prisma from "@/lib/prisma";
import { applyTransactionRule } from "@/lib/transaction-rules";

function validText(value: unknown, maximum: number) {
  return typeof value === "string" && value.trim() && value.trim().length <= maximum ? value.trim() : null;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para acessar compras no cartão." }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const context = await resolveFinancialContext(user.id, params.get("context"));
  const cardId = params.get("cardId") || "";
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });
  const cardWhere = context.type === "FAMILY" ? { id: cardId, teamId: context.teamId } : { id: cardId, userId: user.id, teamId: null };
  const card = await prisma.creditCard.findFirst({ where: cardWhere, select: { id: true } });
  if (!card) return NextResponse.json({ error: "Cartão não encontrado nesse contexto." }, { status: 404 });
  const purchases = await prisma.cardPurchase.findMany({ where: { cardId }, include: { installmentsList: { orderBy: { number: "asc" } }, user: { select: { id: true, name: true, email: true } } }, orderBy: { purchaseDate: "desc" } });
  return NextResponse.json({ purchases });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para registrar uma compra." }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const context = await resolveFinancialContext(user.id, typeof body?.context === "string" ? body.context : null);
  const cardId = typeof body?.cardId === "string" ? body.cardId : "";
  const description = validText(body?.description, 140);
  const category = validText(body?.category, 80);
  const purchaseDate = validDate(body?.purchaseDate);
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });
  if (!cardId || !description || !category || !purchaseDate) return NextResponse.json({ error: "Informe cartão, descrição, categoria e data válidos." }, { status: 400 });
  const normalized = normalizeCardPurchaseInput(body || {});
  if ("error" in normalized) return NextResponse.json({ error: normalized.error }, { status: 400 });
  const cardWhere = context.type === "FAMILY" ? { id: cardId, teamId: context.teamId, userId: user.id, isActive: true } : { id: cardId, userId: user.id, teamId: null, isActive: true };
  const card = await prisma.creditCard.findFirst({ where: cardWhere });
  if (!card) return NextResponse.json({ error: "Escolha um cartão ativo que pertença a você nesse contexto." }, { status: 403 });
  const suggestion = await applyTransactionRule(user.id, description, { category, type: "EXPENSE" });
  const finalCategory = suggestion.category;
  const totalAmount = calculatePurchaseTotal(normalized.value.amountPerInstallment, normalized.value.installments);
  const schedule = buildPendingInstallments({
    installmentAmount: normalized.value.amountPerInstallment,
    installments: normalized.value.installments,
    currentInstallment: normalized.value.currentInstallment,
    purchaseDate,
    closingDay: card.closingDay,
  });
  const purchase = await prisma.$transaction(async (database) => {
    const transaction = await database.transaction.create({ data: { userId: user.id, teamId: context.type === "FAMILY" ? context.teamId : null, description, category: finalCategory, type: "EXPENSE", amount: totalAmount, date: purchaseDate, source: "CREDIT_CARD" } });
    return database.cardPurchase.create({ data: { cardId: card.id, transactionId: transaction.id, userId: user.id, description, category: finalCategory, totalAmount, purchaseDate, installments: normalized.value.installments, installmentAmount: normalized.value.amountPerInstallment, currentInstallment: normalized.value.currentInstallment, installmentsList: { create: schedule } }, include: { installmentsList: { orderBy: { number: "asc" } }, transaction: true } });
  });
  return NextResponse.json({ purchase, suggestion: suggestion.matchedBy ? { matchedBy: suggestion.matchedBy } : null }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para alterar uma compra." }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const context = await resolveFinancialContext(user.id, typeof body?.context === "string" ? body.context : null);
  const id = typeof body?.id === "string" ? body.id : "";
  const description = validText(body?.description, 140);
  const category = validText(body?.category, 80);
  const purchaseDate = validDate(body?.purchaseDate);
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });
  if (!id || !description || !category || !purchaseDate) return NextResponse.json({ error: "Informe compra, descrição, categoria e data válidos." }, { status: 400 });
  const normalized = normalizeCardPurchaseInput(body || {});
  if ("error" in normalized) return NextResponse.json({ error: normalized.error }, { status: 400 });
  const cardWhere = context.type === "FAMILY" ? { teamId: context.teamId, userId: user.id, isActive: true } : { teamId: null, userId: user.id, isActive: true };
  const purchase = await prisma.cardPurchase.findFirst({ where: { id, userId: user.id, card: cardWhere }, select: { id: true, transactionId: true, card: { select: { closingDay: true } } } });
  if (!purchase) return NextResponse.json({ error: "Compra não encontrada ou sem permissão para alterar." }, { status: 404 });
  const suggestion = await applyTransactionRule(user.id, description, { category, type: "EXPENSE" });
  const finalCategory = suggestion.category;
  const totalAmount = calculatePurchaseTotal(normalized.value.amountPerInstallment, normalized.value.installments);
  const schedule = buildPendingInstallments({
    installmentAmount: normalized.value.amountPerInstallment,
    installments: normalized.value.installments,
    currentInstallment: normalized.value.currentInstallment,
    purchaseDate,
    closingDay: purchase.card.closingDay,
  });
  const updatedPurchase = await prisma.$transaction(async (database) => {
    await database.transaction.update({ where: { id: purchase.transactionId }, data: { description, category: finalCategory, date: purchaseDate, amount: totalAmount } });
    await database.cardInstallment.deleteMany({ where: { purchaseId: purchase.id } });
    return database.cardPurchase.update({
      where: { id: purchase.id },
      data: {
        description,
        category: finalCategory,
        totalAmount,
        purchaseDate,
        installments: normalized.value.installments,
        installmentAmount: normalized.value.amountPerInstallment,
        currentInstallment: normalized.value.currentInstallment,
        installmentsList: { create: schedule },
      },
      include: { installmentsList: { orderBy: { number: "asc" } }, transaction: true },
    });
  });
  return NextResponse.json({ purchase: updatedPurchase });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para remover uma compra." }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const context = await resolveFinancialContext(user.id, params.get("context"));
  const id = params.get("id") || "";
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });
  const cardWhere = context.type === "FAMILY" ? { teamId: context.teamId, userId: user.id, isActive: true } : { teamId: null, userId: user.id, isActive: true };
  const purchase = await prisma.cardPurchase.findFirst({ where: { id, userId: user.id, card: cardWhere }, select: { id: true, transactionId: true } });
  if (!purchase) return NextResponse.json({ error: "Compra não encontrada ou sem permissão para remover." }, { status: 404 });
  await prisma.$transaction([prisma.cardPurchase.delete({ where: { id: purchase.id } }), prisma.transaction.delete({ where: { id: purchase.transactionId } })]);
  return NextResponse.json({ success: true, purchaseId: purchase.id });
}
