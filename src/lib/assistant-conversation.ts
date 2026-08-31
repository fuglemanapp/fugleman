import prisma from "./prisma";
import { Prisma } from "@prisma/client";
import { activePendingAction, cancelPendingAction, mergePendingAction, missingPendingFields, type PendingAction } from "./assistant-pending-action";
import { persistAgentAction } from "./personal-agent-effects";
import { parseAgentAction, runPersonalAgent, type AgentAction, type PendingActionDraft } from "./personal-agent";

const PENDING_ACTION_WINDOW_MS = 30 * 60 * 1_000;

export function ensureAssistantConversation(userId: string) {
  return prisma.assistantConversation.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

function pendingActionFromDraft(draft: PendingActionDraft, now: Date): PendingAction {
  return {
    id: crypto.randomUUID(),
    ...draft,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + PENDING_ACTION_WINDOW_MS).toISOString(),
  };
}

function draftFromAction(action: AgentAction): PendingActionDraft | null {
  if (action.kind === "NONE") return null;

  if (action.kind === "EVENT") {
    return {
      kind: "EVENT",
      title: action.title,
      description: action.description || undefined,
      startTime: action.startTime,
      endTime: action.endTime,
    };
  }

  return {
    kind: action.kind,
    amount: action.amount,
    description: action.description,
    category: action.category,
    date: action.date,
    ...(action.kind === "CARD_PURCHASE" ? { cardReference: action.cardReference, installments: action.installments } : {}),
  };
}

function actionFromPending(action: PendingAction): AgentAction {
  if (missingPendingFields(action).length > 0) return { kind: "NONE" };

  if (action.kind === "EVENT") {
    return parseAgentAction({
      kind: "EVENT",
      title: action.title,
      description: action.description || null,
      startTime: action.startTime,
      endTime: action.endTime,
    });
  }

  return parseAgentAction({
    kind: action.kind,
    amount: action.amount,
    description: action.description,
    category: action.category,
    date: action.date,
    ...(action.kind === "CARD_PURCHASE" ? { cardReference: action.cardReference, installments: action.installments } : {}),
  });
}

type TurnResolution = { action: AgentAction; pendingAction: PendingAction | null };

export function resolveAssistantTurn(input: {
  currentPendingAction: PendingAction | null;
  action: AgentAction;
  pendingAction: PendingActionDraft | null;
  now: Date;
}): TurnResolution {
  const current = activePendingAction(input.currentPendingAction, input.now);

  if (!current) {
    if (input.action.kind !== "NONE") return { action: input.action, pendingAction: null };
    return input.pendingAction
      ? { action: { kind: "NONE" }, pendingAction: pendingActionFromDraft(input.pendingAction, input.now) }
      : { action: { kind: "NONE" }, pendingAction: null };
  }

  const actionDraft = draftFromAction(input.action);
  const incomingDraft = input.pendingAction || actionDraft;
  if (!incomingDraft || incomingDraft.kind !== current.kind) {
    return input.action.kind !== "NONE" && input.action.kind !== current.kind
      ? { action: input.action, pendingAction: null }
      : { action: { kind: "NONE" }, pendingAction: current };
  }

  const merged = mergePendingAction(current, incomingDraft);
  const action = actionFromPending(merged);
  return action.kind === "NONE" ? { action, pendingAction: merged } : { action, pendingAction: null };
}

function storedPendingAction(value: unknown): PendingAction | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Partial<PendingAction>;
  return typeof candidate.id === "string" && typeof candidate.kind === "string" && typeof candidate.expiresAt === "string" && typeof candidate.createdAt === "string"
    ? candidate as PendingAction
    : null;
}

export async function processAssistantMessage(input: {
  userId: string;
  conversationId: string;
  idempotencyKey: string;
  text: string;
  now?: Date;
}) {
  const now = input.now || new Date();
  const conversation = await prisma.assistantConversation.findUnique({
    where: { id: input.conversationId },
    select: { pendingAction: true, pendingActionExpiresAt: true },
  });
  const currentPendingAction = activePendingAction(storedPendingAction(conversation?.pendingAction), now);

  if (currentPendingAction && cancelPendingAction(input.text)) {
    await prisma.assistantConversation.update({
      where: { id: input.conversationId },
      data: { pendingAction: Prisma.JsonNull, pendingActionExpiresAt: null, pendingActionVersion: { increment: 1 } },
    });
    return { reply: "Cancelei o lançamento pendente. Nenhuma movimentação foi criada.", action: { kind: "NONE" } as AgentAction };
  }

  const result = await runPersonalAgent({ userId: input.userId, text: input.text, now, pendingAction: currentPendingAction });
  const resolution = resolveAssistantTurn({ currentPendingAction, action: result.action, pendingAction: result.pendingAction || null, now });
  let reply = result.reply;
  let nextPendingAction = resolution.pendingAction;

  if (resolution.action.kind !== "NONE") {
    try {
      const persistence = await persistAgentAction({
        userId: input.userId,
        action: resolution.action,
        assistantMessageId: input.idempotencyKey,
      });
      if (persistence.confirmation) reply = persistence.confirmation;
      if (persistence.warning) {
        reply = persistence.warning;
        const retryDraft = draftFromAction(resolution.action);
        nextPendingAction = retryDraft ? pendingActionFromDraft(retryDraft, now) : null;
      }
    } catch {
      reply = "Não consegui salvar essa ação com segurança. Tente novamente; nenhum lançamento foi criado.";
      const retryDraft = draftFromAction(resolution.action);
      nextPendingAction = retryDraft ? pendingActionFromDraft(retryDraft, now) : null;
    }
  }

  await prisma.assistantConversation.update({
    where: { id: input.conversationId },
    data: {
      pendingAction: nextPendingAction || Prisma.JsonNull,
      pendingActionExpiresAt: nextPendingAction ? new Date(nextPendingAction.expiresAt) : null,
      pendingActionVersion: { increment: 1 },
    },
  });

  return { reply, action: resolution.action };
}
