import prisma from "@/lib/prisma";

export type TransactionRuleSuggestion = { category: string; type?: "INCOME" | "EXPENSE"; matchedBy?: string };

export function normalizeRuleText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").replace(/\s+/g, " ").trim();
}

export async function applyTransactionRule(userId: string, description: string, fallback: TransactionRuleSuggestion): Promise<TransactionRuleSuggestion> {
  const normalizedDescription = normalizeRuleText(description);
  if (!normalizedDescription) return fallback;
  const rules = await prisma.transactionRule.findMany({ where: { userId, isActive: true }, orderBy: { createdAt: "asc" } });
  const matching = rules.filter((rule) => normalizedDescription.includes(normalizeRuleText(rule.matchText))).sort((first, second) => second.matchText.length - first.matchText.length)[0];
  if (!matching) return fallback;
  return { category: matching.category, type: matching.type === "INCOME" || matching.type === "EXPENSE" ? matching.type : fallback.type, matchedBy: matching.matchText };
}
