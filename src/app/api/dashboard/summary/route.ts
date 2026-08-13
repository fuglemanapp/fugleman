import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
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

  const [totals, recentTransactions, upcomingEvents, expenseCategories, activeProjects, pendingTasks, notesCount, transactionCount, allTransactionCount, eventCount, importedTransactionCount, cards] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["type"],
      where: { ...transactionContextWhere(context), date: { gte: monthStart, lt: monthEnd } },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({ where: transactionContextWhere(context), include: { user: { select: { name: true, email: true } } }, orderBy: [{ date: "desc" }, { createdAt: "desc" }], take: 5 }),
    prisma.event.findMany({ where: { userId: user.id, startTime: { gte: now, lt: nextWeek } }, orderBy: { startTime: "asc" }, take: 4 }),
    prisma.transaction.groupBy({
      by: ["category"],
      where: { ...transactionContextWhere(context), type: "EXPENSE", date: { gte: monthStart, lt: monthEnd } },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 4,
    }),
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
    prisma.transaction.count({ where: { ...transactionContextWhere(context), date: { gte: monthStart, lt: monthEnd } } }),
    prisma.transaction.count({ where: transactionContextWhere(context) }),
    prisma.event.count({ where: { userId: user.id } }),
    prisma.transaction.count({ where: { ...transactionContextWhere(context), source: "FILE_IMPORT" } }),
    prisma.creditCard.findMany({ where: context.type === "FAMILY" ? { teamId: context.teamId, isActive: true } : { userId: user.id, isActive: true } }),
  ]);

  const income = totals.find((total) => total.type === "INCOME")?._sum.amount || 0;
  const expense = totals.find((total) => total.type === "EXPENSE")?._sum.amount || 0;

  const cardIds = cards.map((card) => card.id);
  const installments = await prisma.cardInstallment.findMany({ where: { purchase: { cardId: { in: cardIds } }, dueMonth: { gte: monthStart, lt: monthEnd } }, include: { purchase: { select: { cardId: true } } } });
  const upcomingStatement = cards.map((card) => ({ card, amount: installments.filter((installment) => installment.purchase.cardId === card.id).reduce((total, installment) => total + installment.amount, 0), dueDate: statementDueDate(monthStart, card.dueDay) })).filter((statement) => statement.amount > 0).sort((first, second) => first.dueDate.getTime() - second.dueDate.getTime())[0];
  return NextResponse.json({
    user,
    context: { key: context.key, name: context.name, type: context.type },
    month: { income, expense, balance: income - expense, transactionCount },
    recentTransactions,
    upcomingEvents,
    expenseCategories: expenseCategories.map((category) => ({ category: category.category, amount: category._sum.amount || 0 })),
    activeProjects: activeProjects.map((project) => ({ ...project, doneTasks: project.tasks.length, totalTasks: project._count.tasks })),
    pendingTasks,
    notesCount,
    setup: { transactionCount: allTransactionCount, eventCount, importedTransactionCount },
    upcomingStatement: upcomingStatement ? { cardName: upcomingStatement.card.name, amount: upcomingStatement.amount, dueDate: upcomingStatement.dueDate } : null,
  });
}
