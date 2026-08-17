import { createGoogleCalendarEvent } from "./google-calendar";
import { actionConfirmation, type AgentAction } from "./personal-agent";
import prisma from "./prisma";

export async function persistAgentAction(userId: string, action: AgentAction) {
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
      },
    });
    return { warning: null, confirmation: actionConfirmation(action) };
  }

  if (action.kind === "EVENT") {
    const event = await prisma.event.create({
      data: {
        userId,
        title: action.title,
        description: action.description,
        startTime: new Date(action.startTime),
        endTime: new Date(action.endTime),
      },
    });
    const sync = await createGoogleCalendarEvent(userId, event);
    return { warning: sync.synced ? null : sync.error, confirmation: actionConfirmation(action) };
  }

  return { warning: null, confirmation: null };
}
