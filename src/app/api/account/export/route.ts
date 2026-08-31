import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Faça login para exportar seus dados." }, { status: 401 });

  const userId = currentUser.id;
  const [user, transactions, cards, cardPurchases, events, projects, notes, recurringTransactions, budgets, goals, preferences, assistantConversation] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, phone: true, createdAt: true, updatedAt: true },
    }),
    prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.creditCard.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.cardPurchase.findMany({
      where: { userId },
      include: { installmentsList: { orderBy: { number: "asc" } } },
      orderBy: { purchaseDate: "asc" },
    }),
    prisma.event.findMany({ where: { userId }, orderBy: { startTime: "asc" } }),
    prisma.project.findMany({ where: { userId }, include: { tasks: { orderBy: { createdAt: "asc" } } }, orderBy: { createdAt: "asc" } }),
    prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.recurringTransaction.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.budget.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.financialGoal.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    prisma.financialPreferences.findUnique({ where: { userId } }),
    prisma.assistantConversation.findUnique({
      where: { userId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    }),
  ]);

  return NextResponse.json(
    {
      exportedAt: new Date().toISOString(),
      user,
      phoneStatus: { linked: Boolean(currentUser.phone) },
      transactions,
      cards,
      cardPurchases,
      events,
      projects,
      notes,
      recurringTransactions,
      budgets,
      goals,
      preferences,
      assistantConversation,
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": 'attachment; filename="whatspent-dados.json"',
      },
    },
  );
}
