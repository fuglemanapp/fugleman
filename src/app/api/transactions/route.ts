import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { resolveFinancialContext, transactionContextWhere } from "@/lib/financial-context";
import { buildMonthlyActivities } from "@/lib/monthly-activities";
import prisma from "@/lib/prisma";
import { applyTransactionRule } from "@/lib/transaction-rules";

export const dynamic = "force-dynamic";

function parseDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para acessar suas transações." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const context = await resolveFinancialContext(user.id, searchParams.get("context"));
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });
  const from = parseDate(searchParams.get("from"));
  const to = parseDate(searchParams.get("to"));

  if ((searchParams.has("from") && !from) || (searchParams.has("to") && !to) || (from && to && from >= to)) {
    return NextResponse.json({ error: "Período financeiro inválido." }, { status: 400 });
  }

  const range = from || to
    ? { dueMonth: { ...(from ? { gte: from } : {}), ...(to ? { lt: to } : {}) } }
    : {};
  const transactionRange = from || to
    ? { date: { ...(from ? { gte: from } : {}), ...(to ? { lt: to } : {}) } }
    : {};
  const cardWhere = context.type === "FAMILY"
    ? { teamId: context.teamId, isActive: true }
    : { userId: user.id, teamId: null, isActive: true };

  const [transactions, installments] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        AND: [
          transactionContextWhere(context),
          { OR: [{ source: null }, { source: { not: "CREDIT_CARD" } }] },
          transactionRange,
        ],
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    }),
    prisma.cardInstallment.findMany({
      where: { ...range, purchase: { card: cardWhere } },
      include: {
        purchase: {
          select: {
            description: true,
            category: true,
            installments: true,
            card: { select: { id: true, name: true, lastFour: true, isActive: true } },
          },
        },
      },
    }),
  ]);

  const activities = buildMonthlyActivities({ transactions, installments });

  return NextResponse.json(
    { transactions: activities },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para registrar uma transação." }, { status: 401 });

  let payload: { description?: unknown; category?: unknown; type?: unknown; amount?: unknown; date?: unknown; context?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados financeiros inválidos." }, { status: 400 });
  }

  const description = typeof payload.description === "string" ? payload.description.trim() : "";
  const category = typeof payload.category === "string" ? payload.category.trim() : "";
  const type = payload.type === "INCOME" || payload.type === "EXPENSE" ? payload.type : null;
  const amount = typeof payload.amount === "number" ? payload.amount : Number(payload.amount);
  const date = typeof payload.date === "string" ? parseDate(payload.date) : null;
  const context = await resolveFinancialContext(user.id, typeof payload.context === "string" ? payload.context : null);
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });

  if (!description || description.length > 140 || !category || category.length > 80 || !type) {
    return NextResponse.json({ error: "Informe descrição, categoria e tipo da transação." }, { status: 400 });
  }

  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000) {
    return NextResponse.json({ error: "Informe um valor válido maior que zero." }, { status: 400 });
  }

  if (!date) return NextResponse.json({ error: "Informe uma data válida." }, { status: 400 });

  const suggestion = await applyTransactionRule(user.id, description, { category, type });
  const transaction = await prisma.transaction.create({ data: { description, category: suggestion.category, type: suggestion.type || type, amount, date, userId: user.id, teamId: context.teamId }, include: { user: { select: { id: true, name: true, email: true } } } });
  return NextResponse.json({ transaction, suggestion: suggestion.matchedBy ? { matchedBy: suggestion.matchedBy } : null }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para excluir uma transação." }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  const context = await resolveFinancialContext(user.id, new URL(request.url).searchParams.get("context"));
  if (!context) return NextResponse.json({ error: "Espaço financeiro inválido ou sem acesso." }, { status: 403 });
  if (!id) return NextResponse.json({ error: "Transação inválida." }, { status: 400 });

  const transaction = await prisma.transaction.findFirst({ where: { id, ...transactionContextWhere(context) }, select: { id: true, source: true } });
  if (!transaction) return NextResponse.json({ error: "Transação não encontrada." }, { status: 404 });
  if (transaction.source === "CREDIT_CARD") {
    return NextResponse.json(
      { error: "Compras no cartão devem ser alteradas na área de cartões." },
      { status: 409 },
    );
  }

  await prisma.transaction.delete({ where: { id: transaction.id } });
  return new NextResponse(null, { status: 204 });
}
