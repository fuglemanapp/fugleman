import { createGoogleCalendarEvent } from "./google-calendar";
import { buildPendingInstallments, calculatePurchaseTotal } from "./credit-cards";
import { matchCreditCards, type CreditCardReference } from "./credit-card-reference";
import { actionConfirmation, type AgentAction } from "./personal-agent";
import prisma from "./prisma";

type PersistAgentActionInput = {
  userId: string;
  action: AgentAction;
  assistantMessageId?: string;
};

export async function resolveCreditCardReference(userId: string, reference: string) {
  const cards = await prisma.creditCard.findMany({
    where: { userId, isActive: true },
    select: { id: true, name: true, issuer: true, lastFour: true, closingDay: true },
  });
  const matches = matchCreditCards(reference, cards);
  return matches.length === 1 ? matches[0] : null;
}

export async function persistAgentAction(input: PersistAgentActionInput) {
  const { userId, action, assistantMessageId } = input;

  if (assistantMessageId) {
    const persistedTransaction = await prisma.transaction.findUnique({ where: { assistantMessageId } });
    if (persistedTransaction) return { warning: null, confirmation: actionConfirmation(action), duplicate: true };

    const persistedEvent = await prisma.event.findUnique({ where: { assistantMessageId } });
    if (persistedEvent) return { warning: null, confirmation: actionConfirmation(action), duplicate: true };
  }

  if (action.kind === "EXPENSE" || action.kind === "INCOME") {
    await prisma.transaction.create({
      data: {
        userId,
        amount: action.amount,
        description: action.description,
        category: action.category,
        type: action.kind,
        date: new Date(`${action.date}T12:00:00.000Z`),
        source: "ASSISTANT",
        assistantMessageId,
      },
    });
    return { warning: null, confirmation: actionConfirmation(action), duplicate: false };
  }

  if (action.kind === "CARD_PURCHASE") {
    const card = await resolveCreditCardReference(userId, action.cardReference);
    if (!card) {
      return {
        warning: "Não consegui identificar com segurança qual cartão deve receber essa compra. Informe o nome ou os quatro últimos dígitos do cartão.",
        confirmation: null,
        duplicate: false,
      };
    }

    const installments = action.installments || 1;
    const purchaseDate = new Date(`${action.date}T12:00:00.000Z`);
    const totalAmount = calculatePurchaseTotal(action.amount, installments);
    const schedule = buildPendingInstallments({
      installmentAmount: action.amount,
      installments,
      currentInstallment: 1,
      purchaseDate,
      closingDay: card.closingDay,
    });

    await prisma.$transaction(async (database) => {
      const transaction = await database.transaction.create({
        data: {
          userId,
          amount: totalAmount,
          description: action.description,
          category: action.category,
          type: "EXPENSE",
          date: purchaseDate,
          source: "CREDIT_CARD",
          assistantMessageId,
        },
      });
      await database.cardPurchase.create({
        data: {
          cardId: card.id,
          transactionId: transaction.id,
          userId,
          description: action.description,
          category: action.category,
          totalAmount,
          purchaseDate,
          installments,
          installmentAmount: action.amount,
          currentInstallment: 1,
          installmentsList: { create: schedule },
        },
      });
    });
    return { warning: null, confirmation: actionConfirmation(action), duplicate: false };
  }

  if (action.kind === "EVENT") {
    const event = await prisma.event.create({
      data: {
        userId,
        title: action.title,
        description: action.description,
        startTime: new Date(action.startTime),
        endTime: new Date(action.endTime),
        assistantMessageId,
      },
    });
    const sync = await createGoogleCalendarEvent(userId, event);
    return { warning: sync.synced ? null : sync.error, confirmation: actionConfirmation(action), duplicate: false };
  }

  return { warning: null, confirmation: null, duplicate: false };
}
