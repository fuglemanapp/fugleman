import prisma from "./prisma";
import type { PendingAction, PendingActionUpdate } from "./assistant-pending-action";

const MAX_AMOUNT = 1_000_000_000;
const SAO_PAULO_TIME_ZONE = "America/Sao_Paulo";
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";
const RETIRED_GROQ_MODELS = new Set(["llama-3.1-8b-instant", "llama-3.3-70b-versatile"]);

export type AgentAction =
  | { kind: "EXPENSE" | "INCOME"; amount: number; description: string; category: string; date: string }
  | { kind: "CARD_PURCHASE"; amount: number; description: string; category: string; date: string; cardReference: string; installments?: number }
  | { kind: "EVENT"; title: string; startTime: string; endTime: string; description: string | null }
  | { kind: "NONE" };

export type PendingActionDraft = PendingActionUpdate & { kind: PendingAction["kind"] };
type AgentRunResult = { reply: string; action: AgentAction; pendingAction?: PendingActionDraft | null };

type AgentResponse = { reply?: unknown; action?: unknown; pendingAction?: unknown };

type EventAction = Extract<AgentAction, { kind: "EVENT" }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseIsoDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : value;
}

function parseTimestamp(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizedText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();
  return text && text.length <= maxLength ? text : null;
}

function datePartsInSaoPaulo(value: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SAO_PAULO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return { year: values.year, month: values.month, day: values.day };
}

function dateInSaoPauloAfterDays(now: Date, days: number) {
  const { year, month, day } = datePartsInSaoPaulo(now);
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + days));
  return date.toISOString().slice(0, 10);
}

function dateInSaoPauloFromBrazilianDate(day: number, month: number, year: number | null, now: Date) {
  const today = datePartsInSaoPaulo(now);
  let targetYear = year || Number(today.year);

  if (!year && (month < Number(today.month) || (month === Number(today.month) && day < Number(today.day)))) {
    targetYear += 1;
  }

  const date = new Date(Date.UTC(targetYear, month - 1, day));
  if (date.getUTCFullYear() !== targetYear || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function eventTimeInSaoPaulo(date: string, hour: number, minute: number) {
  return new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-03:00`);
}

export function parseExplicitEventCommand(text: string, now: Date = new Date()): EventAction | null {
  const command = text.replace(/\b(?:para|pra)\s+mim\b/giu, " ").replace(/\s+/gu, " ").trim();
  const match = command.match(/^\s*(?:crie|cria|criar|agende|agendar|marque|marcar)(?:\s+(?:um|uma))?\s+(?:compromisso|evento)(?:\s+para)?\s+(?:(hoje|amanhã|amanha)|(?:(?:o\s+)?dia\s+)?(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?)\s+(?:às|as)\s+(\d{1,2})(?:h|:(\d{2}))?\s*[:\-]\s*(.+)\s*$/i);
  if (!match) return null;

  const relativeDay = match[1]?.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const hour = Number(match[5]);
  const minute = match[6] ? Number(match[6]) : 0;
  const title = match[7].trim().replace(/[.]+$/, "");

  if (!title || title.length > 120 || hour > 23 || minute > 59) return null;

  const date = relativeDay
    ? dateInSaoPauloAfterDays(now, relativeDay === "amanha" ? 1 : 0)
    : dateInSaoPauloFromBrazilianDate(Number(match[2]), Number(match[3]), match[4] ? Number(match[4]) : null, now);
  if (!date) return null;

  const startTime = eventTimeInSaoPaulo(date, hour, minute);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
  return { kind: "EVENT", title, description: null, startTime: startTime.toISOString(), endTime: endTime.toISOString() };
}

function isAppointmentMissingTime(text: string) {
  const command = text.replace(/\b(?:para|pra)\s+mim\b/giu, " ").replace(/\s+/gu, " ").trim();
  return /^\s*(?:crie|cria|criar|agende|agendar|marque|marcar)(?:\s+(?:um|uma))?\s+(?:compromisso|evento)(?:\s+para)?\s+(?:(?:hoje|amanhã|amanha)|(?:(?:o\s+)?dia\s+)?\d{1,2}\/\d{1,2}(?:\/\d{4})?)\s*[:\-]\s*.+\s*$/i.test(command);
}

function isActionRequest(text: string) {
  return /\b(crie|criar|agende|agendar|marque|marcar|registre|registrar|lance|lançar|adicione|adicionar)\b/i.test(text);
}

function claimsSuccess(reply: string) {
  return /\b(criad[oa]|registrad[oa]|salv[oa]|confirmad[oa]).{0,40}\b(sucesso|feito|concluíd[oa]|agendad[oa])|\b(sucesso|feito|concluíd[oa]|agendad[oa]).{0,40}\b(criad[oa]|registrad[oa]|salv[oa]|confirmad[oa])/i.test(reply);
}

export function replyAfterActionValidation(text: string, reply: string, action: AgentAction) {
  if (action.kind !== "NONE" || !isActionRequest(text) || !claimsSuccess(reply)) return reply;

  if (/\b(compromisso|evento|agenda)\b/i.test(text)) {
    return "Não consegui confirmar esse compromisso com segurança. Informe data, horário e título; nenhum compromisso foi criado.";
  }

  return "Não consegui confirmar essa ação com segurança. Reformule a mensagem com os dados completos; nenhum lançamento foi criado.";
}

export function actionConfirmation(action: AgentAction) {
  if (action.kind === "NONE") return null;

  if (action.kind === "EVENT") {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: SAO_PAULO_TIME_ZONE,
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(action.startTime));
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `Compromisso “${action.title}” criado para ${values.day}/${values.month} às ${values.hour}:${values.minute}.`;
  }

  const amount = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(action.amount);
  if (action.kind === "CARD_PURCHASE") {
    return `Compra de ${amount} no cartão ${action.cardReference} registrada com sucesso.`;
  }
  return action.kind === "EXPENSE" ? `Despesa de ${amount} registrada com sucesso.` : `Entrada de ${amount} registrada com sucesso.`;
}

export function parseAgentAction(value: unknown): AgentAction {
  if (!isRecord(value)) {
    return { kind: "NONE" };
  }

  if (value.kind === "EXPENSE" || value.kind === "INCOME") {
    const amount = typeof value.amount === "number" ? value.amount : Number(value.amount);
    const description = normalizedText(value.description, 140);
    const category = normalizedText(value.category, 80);
    const date = parseIsoDate(value.date);

    if (Number.isFinite(amount) && amount > 0 && amount <= MAX_AMOUNT && description && category && date) {
      return { kind: value.kind, amount, description, category, date };
    }
  }

  if (value.kind === "CARD_PURCHASE") {
    const amount = typeof value.amount === "number" ? value.amount : Number(value.amount);
    const description = normalizedText(value.description, 140);
    const category = normalizedText(value.category, 80);
    const date = parseIsoDate(value.date);
    const cardReference = normalizedText(value.cardReference, 120);
    const installments = value.installments === undefined ? undefined : Number(value.installments);

    if (
      Number.isFinite(amount) &&
      amount > 0 &&
      amount <= MAX_AMOUNT &&
      description &&
      category &&
      date &&
      cardReference &&
      (installments === undefined || (Number.isInteger(installments) && installments > 0 && installments <= 48))
    ) {
      return { kind: "CARD_PURCHASE", amount, description, category, date, cardReference, ...(installments ? { installments } : {}) };
    }
  }

  if (value.kind === "EVENT") {
    const title = normalizedText(value.title, 120);
    const description = typeof value.description === "string" ? value.description.trim().slice(0, 1000) || null : null;
    const startTime = parseTimestamp(value.startTime);
    const endTime = parseTimestamp(value.endTime);

    if (title && startTime && endTime && endTime > startTime) {
      return { kind: "EVENT", title, description, startTime: startTime.toISOString(), endTime: endTime.toISOString() };
    }
  }

  return { kind: "NONE" };
}

export function parseAgentPendingAction(value: unknown): PendingActionDraft | null {
  if (!isRecord(value) || !["EXPENSE", "INCOME", "CARD_PURCHASE", "EVENT"].includes(String(value.kind))) {
    return null;
  }

  const amount = typeof value.amount === "number" ? value.amount : Number(value.amount);
  const installments = value.installments === undefined ? undefined : Number(value.installments);
  const currentInstallment = value.currentInstallment === undefined ? undefined : Number(value.currentInstallment);
  const startTime = parseTimestamp(value.startTime);
  const endTime = parseTimestamp(value.endTime);
  const draft: PendingActionDraft = { kind: value.kind as PendingAction["kind"] };

  if (Number.isFinite(amount) && amount > 0 && amount <= MAX_AMOUNT) draft.amount = amount;
  if (normalizedText(value.description, 140)) draft.description = normalizedText(value.description, 140) || undefined;
  if (normalizedText(value.category, 80)) draft.category = normalizedText(value.category, 80) || undefined;
  if (parseIsoDate(value.date)) draft.date = parseIsoDate(value.date) || undefined;
  if (normalizedText(value.cardReference, 120)) draft.cardReference = normalizedText(value.cardReference, 120) || undefined;
  if (normalizedText(value.cardId, 120)) draft.cardId = normalizedText(value.cardId, 120) || undefined;
  if (typeof installments === "number" && Number.isInteger(installments) && installments > 0 && installments <= 48) draft.installments = installments;
  if (typeof currentInstallment === "number" && Number.isInteger(currentInstallment) && currentInstallment > 0 && currentInstallment <= 48) draft.currentInstallment = currentInstallment;
  if (normalizedText(value.title, 120)) draft.title = normalizedText(value.title, 120) || undefined;
  if (startTime) draft.startTime = startTime.toISOString();
  if (endTime) draft.endTime = endTime.toISOString();

  return Object.keys(draft).length > 1 ? draft : null;
}

function monthBounds(now: Date) {
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { from, to };
}

async function currentMonthSummary(userId: string, now: Date) {
  const { from, to } = monthBounds(now);
  const entries = await prisma.transaction.groupBy({
    by: ["type"],
    where: { userId, date: { gte: from, lt: to } },
    _sum: { amount: true },
  });
  const income = entries.find((entry) => entry.type === "INCOME")?._sum.amount || 0;
  const expense = entries.find((entry) => entry.type === "EXPENSE")?._sum.amount || 0;
  return { income, expense, balance: income - expense };
}

function noKeyResponse() {
  return {
    reply: "Ainda preciso da chave da IA para entender mensagens naturalmente. Configure GROQ_API_KEY na Vercel; nenhum lançamento foi criado.",
    action: { kind: "NONE" } as const,
  };
}

export function getGroqModel(configuredModel: string | undefined) {
  const model = configuredModel?.trim();
  return model && !RETIRED_GROQ_MODELS.has(model) ? model : DEFAULT_GROQ_MODEL;
}

function unavailableAssistantResponse() {
  return {
    reply: "Não consegui acessar o assistente agora. Tente novamente em alguns instantes; nenhum lançamento foi criado.",
    action: { kind: "NONE" } as const,
  };
}

export async function runPersonalAgent(input: { userId: string; text: string; now?: Date; pendingAction?: PendingAction | null }): Promise<AgentRunResult> {
  const now = input.now || new Date();
  const explicitEvent = parseExplicitEventCommand(input.text, now);
  if (explicitEvent) {
    return { reply: "Vou salvar esse compromisso agora.", action: explicitEvent };
  }

  if (isAppointmentMissingTime(input.text)) {
    return {
      reply: "Para criar esse compromisso, me informe o horário. Ex.: “Crie um compromisso dia 26/09/2026 às 12:00: Prova de Engenharia”.",
      action: { kind: "NONE" } as const,
    };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return noKeyResponse();
  }

  const summary = await currentMonthSummary(input.userId, now);
  const model = getGroqModel(process.env.GROQ_MODEL);
  let response: Response;

  try {
    response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: [
              "Você é WhatSpent, um assistente financeiro pessoal brasileiro. Responda sempre em português.",
              "Retorne exclusivamente JSON válido com as chaves reply, action e pendingAction.",
              "action deve ser EXPENSE, INCOME, CARD_PURCHASE, EVENT ou NONE. Para EXPENSE/INCOME use amount, description, category e date YYYY-MM-DD. Para CARD_PURCHASE use os mesmos campos e cardReference. Para EVENT use title, startTime ISO, endTime ISO e description.",
              "pendingAction deve conter um rascunho parcial com kind e somente os campos informados quando ainda faltar algo. Caso não haja pendência, use null.",
              "Nunca invente valores, datas ou confirmações. Quando faltar informação, use action NONE, pendingAction e peça somente o próximo dado necessário.",
              input.pendingAction ? `Pendência atual (não descarte os dados já confirmados): ${JSON.stringify(input.pendingAction)}.` : "Não há pendência atual.",
              `Data atual: ${now.toISOString()}. Resumo pessoal do mês: entradas R$ ${summary.income.toFixed(2)}, saídas R$ ${summary.expense.toFixed(2)}, saldo R$ ${summary.balance.toFixed(2)}.`,
            ].join("\n"),
          },
          { role: "user", content: input.text },
        ],
      }),
    });
  } catch (error) {
    console.error("Groq assistant request failed", {
      errorName: error instanceof Error ? error.name : "unknown",
      model,
    });
    return unavailableAssistantResponse();
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: { code?: unknown; type?: unknown } } | null;
    console.error("Groq assistant request rejected", {
      errorCode: typeof payload?.error?.code === "string" ? payload.error.code : null,
      errorType: typeof payload?.error?.type === "string" ? payload.error.type : null,
      model,
      status: response.status,
    });
    return unavailableAssistantResponse();
  }

  const payload = (await response.json().catch(() => null)) as { choices?: Array<{ message?: { content?: string } }> } | null;
  const content = payload?.choices?.[0]?.message?.content;

  if (!content) {
    return { reply: "Não consegui interpretar sua mensagem com segurança. Pode reformular?", action: { kind: "NONE" } as const };
  }

  try {
    const result = JSON.parse(content) as AgentResponse;
    const reply = normalizedText(result.reply, 2000) || "Não consegui interpretar sua mensagem com segurança. Pode reformular?";
    const action = parseAgentAction(result.action);
    const pendingAction = parseAgentPendingAction(result.pendingAction);
    return { reply: replyAfterActionValidation(input.text, reply, action), action, pendingAction };
  } catch {
    return { reply: "Não consegui interpretar sua mensagem com segurança. Pode reformular?", action: { kind: "NONE" } as const };
  }
}
