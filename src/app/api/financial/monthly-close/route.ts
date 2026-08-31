import { NextResponse } from "next/server";

import { dateFromMonthKey, monthKey, statementDueDate } from "@/lib/credit-cards";
import { getCurrentUser } from "@/lib/current-user";
import { resolveFinancialContext, transactionContextWhere } from "@/lib/financial-context";
import { contextOwner, monthStart } from "@/lib/financial-input";
import { buildMonthlyActivities } from "@/lib/monthly-activities";
import prisma from "@/lib/prisma";

function percentageChange(current: number, previous: number) {
  if (!previous) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para acessar o fechamento mensal." }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const context = await resolveFinancialContext(user.id, params.get("context"));
  const month = monthStart(params.get("month") || new Date().toISOString().slice(0, 7));
  if (!context || !month) return NextResponse.json({ error: "Contexto ou mês inválido." }, { status: 400 });
  const monthEnd = new Date(month); monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1);
  const previousStart = new Date(month); previousStart.setUTCMonth(previousStart.getUTCMonth() - 1);
  const today = new Date();
  const nextThirtyDays = new Date(today); nextThirtyDays.setUTCDate(nextThirtyDays.getUTCDate() + 30);
  const cardWhere = context.type === "FAMILY"
    ? { teamId: context.teamId, isActive: true }
    : { userId: user.id, teamId: null, isActive: true };
  const [transactions, budgets, cards, recurrences] = await Promise.all([
    prisma.transaction.findMany({ where: { ...transactionContextWhere(context), date: { gte: previousStart, lt: monthEnd } }, include: { user: { select: { id: true, name: true, email: true } } } }),
    prisma.budget.findMany({ where: { ...contextOwner(context), month } }),
    prisma.creditCard.findMany({ where: cardWhere, include: { user: { select: { id: true, name: true, email: true } } } }),
    prisma.recurringTransaction.findMany({ where: context.type === "FAMILY" ? { teamId: context.teamId, isActive: true, nextDate: { gte: monthEnd, lt: nextThirtyDays } } : { userId: user.id, isActive: true, nextDate: { gte: monthEnd, lt: nextThirtyDays } }, orderBy: { nextDate: "asc" } }),
  ]);
  const cardIds = cards.map((card) => card.id);
  const [installments, payments] = await Promise.all([
    prisma.cardInstallment.findMany({ where: { purchase: { cardId: { in: cardIds } }, dueMonth: { gte: previousStart, lt: nextThirtyDays } }, include: { purchase: { select: { cardId: true, description: true, category: true, installments: true, user: { select: { id: true, name: true, email: true } }, card: { select: { id: true, name: true, lastFour: true, isActive: true } } } } } }),
    prisma.cardStatementPayment.findMany({ where: { cardId: { in: cardIds }, dueMonth: { gte: month, lt: nextThirtyDays } } }),
  ]);
  const totals = new Map<string, { income: number; expense: number }>();
  const spending = new Map<string, number>();
  const contributors = new Map<string, { name: string; income: number; expense: number }>();
  const activities = buildMonthlyActivities({ transactions, installments });
  for (const activity of activities) {
    const key = monthKey(activity.date);
    if (key !== monthKey(month) && key !== monthKey(previousStart)) continue;
    const total = totals.get(key) || { income: 0, expense: 0 };
    if (activity.type === "INCOME") total.income += activity.amount;
    else total.expense += activity.amount;
    totals.set(key, total);
    if (key === monthKey(month) && activity.type === "EXPENSE") spending.set(activity.category, (spending.get(activity.category) || 0) + activity.amount);
  }
  for (const transaction of transactions.filter((item) => item.source !== "CREDIT_CARD")) {
    const person = contributors.get(transaction.userId) || { name: transaction.user.name || transaction.user.email || "Membro", income: 0, expense: 0 };
    if (transaction.type === "INCOME") person.income += transaction.amount; else person.expense += transaction.amount;
    contributors.set(transaction.userId, person);
  }
  const current = totals.get(monthKey(month)) || { income: 0, expense: 0 };
  const previous = totals.get(monthKey(previousStart)) || { income: 0, expense: 0 };
  const paidKeys = new Set(payments.map((payment) => `${payment.cardId}:${monthKey(payment.dueMonth)}`));
  const statements = cards.flatMap((card) => {
    const grouped = new Map<string, typeof installments>();
    installments.filter((item) => item.purchase.cardId === card.id).forEach((item) => {
      const key = monthKey(item.dueMonth); const group = grouped.get(key) || []; group.push(item); grouped.set(key, group);
    });
    return [...grouped.entries()].map(([key, items]) => ({ cardId: card.id, cardName: card.name, cardColor: card.color, user: card.user, dueMonth: key, dueDate: statementDueDate(dateFromMonthKey(key)!, card.dueDay), amount: items.reduce((total, item) => total + item.amount, 0), paid: paidKeys.has(`${card.id}:${key}`), count: items.length }));
  }).sort((first, second) => first.dueDate.getTime() - second.dueDate.getTime());
  const actions: { type: "BUDGET" | "STATEMENT" | "RECURRENCE" | "EMPTY"; title: string; detail: string }[] = [];
  budgets.filter((budget) => (spending.get(budget.category) || 0) >= budget.limit).forEach((budget) => actions.push({ type: "BUDGET", title: `Orçamento de ${budget.category} atingido`, detail: `${(spending.get(budget.category) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} de ${budget.limit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}` }));
  statements.filter((statement) => !statement.paid && statement.dueDate >= today && statement.dueDate <= nextThirtyDays).slice(0, 2).forEach((statement) => actions.push({ type: "STATEMENT", title: `Fatura ${statement.cardName} vence em breve`, detail: `${statement.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} · vencimento ${statement.dueDate.toLocaleDateString("pt-BR")}` }));
  recurrences.slice(0, 2).forEach((recurrence) => actions.push({ type: "RECURRENCE", title: recurrence.description, detail: `${recurrence.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} em ${recurrence.nextDate.toLocaleDateString("pt-BR")}` }));
  if (!current.income && !current.expense) actions.push({ type: "EMPTY", title: "Seu mês ainda não tem lançamentos", detail: "Registre uma movimentação ou importe seu extrato para começar o acompanhamento." });
  return NextResponse.json({ context: { key: context.key, name: context.name, type: context.type }, month: monthKey(month), totals: { income: current.income, expense: current.expense, balance: current.income - current.expense, incomeChange: percentageChange(current.income, previous.income), expenseChange: percentageChange(current.expense, previous.expense) }, budgets: budgets.map((budget) => ({ id: budget.id, category: budget.category, limit: budget.limit, spent: spending.get(budget.category) || 0 })), statements, recurrences: recurrences.map((recurrence) => ({ id: recurrence.id, description: recurrence.description, amount: recurrence.amount, type: recurrence.type, nextDate: recurrence.nextDate })), contributors: [...contributors.values()], actions: actions.slice(0, 5) });
}
