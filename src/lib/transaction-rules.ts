import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type TransactionRuleSuggestion = { category: string; type?: "INCOME" | "EXPENSE"; matchedBy?: string };
type ActiveRule = { matchText: string; category: string; type: string | null; createdAt: Date };

export function normalizeRuleText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").replace(/\s+/g, " ").trim();
}

export function applyRules(rules: ActiveRule[], description: string, fallback: TransactionRuleSuggestion): TransactionRuleSuggestion {
  const normalizedDescription = normalizeRuleText(description);
  if (!normalizedDescription) return fallback;
  const matching = rules.filter((rule) => normalizedDescription.includes(normalizeRuleText(rule.matchText))).sort((first, second) => second.matchText.length - first.matchText.length)[0];
  if (!matching) return fallback;
  return { category: matching.category, type: matching.type === "INCOME" || matching.type === "EXPENSE" ? matching.type : fallback.type, matchedBy: matching.matchText };
}

type RuleDatabase = Pick<Prisma.TransactionClient, "transactionRule">;

export async function applyTransactionRule(userId: string, description: string, fallback: TransactionRuleSuggestion, database: RuleDatabase = prisma): Promise<TransactionRuleSuggestion> {
  const rules = await database.transactionRule.findMany({ where: { userId, isActive: true }, orderBy: { createdAt: "asc" } });
  return applyRules(rules, description, fallback);
}
