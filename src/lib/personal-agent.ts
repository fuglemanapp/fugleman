import prisma from "./prisma";

const MAX_AMOUNT = 1_000_000_000;

export type AgentAction =
  | { kind: "EXPENSE" | "INCOME"; amount: number; description: string; category: string; date: string }
  | { kind: "EVENT"; title: string; startTime: string; endTime: string; description: string | null }
  | { kind: "NONE" };

type AgentResponse = { reply?: unknown; action?: unknown };

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
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return noKeyResponse();
  }

  const now = input.now || new Date();
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
    return { reply, action: parseAgentAction(result.action) };
  } catch {
    return { reply: "Não consegui interpretar sua mensagem com segurança. Pode reformular?", action: { kind: "NONE" } as const };
  }
}
