import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { withUserDb } from "@/lib/db-context";

export const dynamic = "force-dynamic";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Faça login para exportar seus dados." }, { status: 401 });

  return withUserDb(currentUser.id, async (database) => {
    const userId = currentUser.id;
    const [user, transactions, cards, cardPurchases, events, projects, notes, recurringTransactions, budgets, goals, preferences, assistantConversation] = await Promise.all([
    database.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, phone: true, createdAt: true, updatedAt: true },
    }),
    database.transaction.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    database.creditCard.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    database.cardPurchase.findMany({
      where: { userId },
      include: { installmentsList: { orderBy: { number: "asc" } } },
      orderBy: { purchaseDate: "asc" },
    }),
    database.event.findMany({ where: { userId }, orderBy: { startTime: "asc" } }),
    database.project.findMany({ where: { userId }, include: { tasks: { orderBy: { createdAt: "asc" } } }, orderBy: { createdAt: "asc" } }),
    database.note.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    database.recurringTransaction.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    database.budget.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    database.financialGoal.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    database.financialPreferences.findUnique({ where: { userId } }),
    database.assistantConversation.findUnique({
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
  });
}
