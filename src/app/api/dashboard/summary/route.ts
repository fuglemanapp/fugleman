import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { summarizeDashboardExpenses } from "@/lib/dashboard-expenses";
import { resolveFinancialContext, transactionContextWhere } from "@/lib/financial-context";
import { statementDueDate } from "@/lib/credit-cards";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para acessar seu painel." }, { status: 401 });
  const context = await resolveFinancialContext(user.id, new URL(request.url).searchParams.get("context"));
  if (!context) return NextResponse.json({ error: "Contexto financeiro inválido." }, { status: 403 });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  const cardWhere = context.type === "FAMILY"
    ? { teamId: context.teamId, isActive: true }
    : { userId: user.id, teamId: null, isActive: true };

  const [monthTransactions, recentTransactions, upcomingEvents, activeProjects, pendingTasks, notesCount, allTransactionCount, eventCount, importedTransactionCount, cards, installments] = await Promise.all([
    prisma.transaction.findMany({
      where: { ...transactionContextWhere(context), date: { gte: monthStart, lt: monthEnd } },
      select: { amount: true, category: true, type: true, source: true },
    }),
    prisma.transaction.findMany({
      where: {
        ...transactionContextWhere(context),
        OR: [
          { source: { not: "CREDIT_CARD" } },
          { cardPurchase: { card: { isActive: true } } },
        ],
      },
      include: { user: { select: { name: true, email: true } } },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
    prisma.event.findMany({ where: { userId: user.id, startTime: { gte: now, lt: nextWeek } }, orderBy: { startTime: "asc" }, take: 4 }),
    prisma.project.findMany({
      where: { userId: user.id, status: "ACTIVE" },
      select: { id: true, name: true, description: true, _count: { select: { tasks: true } }, tasks: { where: { status: "DONE" }, select: { id: true } } },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
    prisma.task.findMany({
      where: { project: { userId: user.id }, status: { not: "DONE" } },
      select: { id: true, title: true, priority: true, status: true, project: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.note.count({ where: { userId: user.id } }),
    prisma.transaction.count({ where: transactionContextWhere(context) }),
    prisma.event.count({ where: { userId: user.id } }),
    prisma.transaction.count({ where: { ...transactionContextWhere(context), source: "FILE_IMPORT" } }),
    prisma.creditCard.findMany({ where: cardWhere }),
    prisma.cardInstallment.findMany({
      where: {
        dueMonth: { gte: monthStart, lt: monthEnd },
        purchase: { card: cardWhere },
      },
      include: {
        purchase: {
          select: {
            cardId: true,
            category: true,
            card: { select: { isActive: true } },
          },
        },
      },
    }),
  ]);

  const month = summarizeDashboardExpenses({
    transactions: monthTransactions,
    installments,
  });
  const upcomingStatement = cards.map((card) => ({ card, amount: installments.filter((installment) => installment.purchase.cardId === card.id).reduce((total, installment) => total + installment.amount, 0), dueDate: statementDueDate(monthStart, card.dueDay) })).filter((statement) => statement.amount > 0).sort((first, second) => first.dueDate.getTime() - second.dueDate.getTime())[0];
  return NextResponse.json({
    user,
    context: { key: context.key, name: context.name, type: context.type },
    month: { income: month.income, expense: month.expense, balance: month.income - month.expense, transactionCount: month.transactionCount },
    recentTransactions,
    upcomingEvents,
    expenseCategories: month.expenseCategories.slice(0, 4),
    activeProjects: activeProjects.map((project) => ({ ...project, doneTasks: project.tasks.length, totalTasks: project._count.tasks })),
    pendingTasks,
    notesCount,
    setup: { transactionCount: allTransactionCount, eventCount, importedTransactionCount },
    upcomingStatement: upcomingStatement ? { cardName: upcomingStatement.card.name, amount: upcomingStatement.amount, dueDate: upcomingStatement.dueDate } : null,
  });
}
