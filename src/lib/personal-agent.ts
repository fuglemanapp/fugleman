import prisma from "./prisma";

const MAX_AMOUNT = 1_000_000_000;
const SAO_PAULO_TIME_ZONE = "America/Sao_Paulo";

export type AgentAction =
  | { kind: "EXPENSE" | "INCOME"; amount: number; description: string; category: string; date: string }
  | { kind: "EVENT"; title: string; startTime: string; endTime: string; description: string | null }
  | { kind: "NONE" };

type AgentResponse = { reply?: unknown; action?: unknown };

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

function eventTimeInSaoPaulo(date: string, hour: number, minute: number) {
  return new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-03:00`);
}

export function parseExplicitEventCommand(text: string, now: Date = new Date()): EventAction | null {
  const match = text.match(/^\s*(?:crie|criar|agende|agendar|marque|marcar)(?:\s+(?:um|uma))?\s+(?:compromisso|evento)(?:\s+para)?\s+(hoje|amanhã|amanha)\s+(?:às|as)\s+(\d{1,2})(?:h|:(\d{2}))?\s*[:\-]\s*(.+)\s*$/i);
  if (!match) return null;

  const relativeDay = match[1].normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const hour = Number(match[2]);
  const minute = match[3] ? Number(match[3]) : 0;
  const title = match[4].trim().replace(/[.]+$/, "");

  if (!title || title.length > 120 || hour > 23 || minute > 59) return null;

  const date = dateInSaoPauloAfterDays(now, relativeDay === "amanha" ? 1 : 0);
  const startTime = eventTimeInSaoPaulo(date, hour, minute);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
  return { kind: "EVENT", title, description: null, startTime: startTime.toISOString(), endTime: endTime.toISOString() };
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

export async function runPersonalAgent(input: { userId: string; text: string; now?: Date }) {
  const now = input.now || new Date();
  const explicitEvent = parseExplicitEventCommand(input.text, now);
  if (explicitEvent) {
    return { reply: "Vou salvar esse compromisso agora.", action: explicitEvent };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return noKeyResponse();
  }

  const summary = await currentMonthSummary(input.userId, now);
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "Você é WhatSpent, um assistente financeiro pessoal brasileiro. Responda sempre em português.",
            "Retorne exclusivamente JSON válido com as chaves reply e action.",
            "action deve ser EXPENSE, INCOME, EVENT ou NONE. Para EXPENSE/INCOME use amount, description, category e date YYYY-MM-DD. Para EVENT use title, startTime ISO, endTime ISO e description.",
            "Nunca invente valores, datas ou confirmações. Quando faltar informação, use NONE e peça o dado faltante.",
            `Data atual: ${now.toISOString()}. Resumo pessoal do mês: entradas R$ ${summary.income.toFixed(2)}, saídas R$ ${summary.expense.toFixed(2)}, saldo R$ ${summary.balance.toFixed(2)}.`,
          ].join("\n"),
        },
        { role: "user", content: input.text },
      ],
    }),
  });

  if (!response.ok) {
    return { reply: "Não consegui acessar o assistente agora. Tente novamente em alguns instantes; nenhum lançamento foi criado.", action: { kind: "NONE" } as const };
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
    return { reply: replyAfterActionValidation(input.text, reply, action), action };
  } catch {
    return { reply: "Não consegui interpretar sua mensagem com segurança. Pode reformular?", action: { kind: "NONE" } as const };
  }
}
