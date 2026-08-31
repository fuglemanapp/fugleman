import { describe, expect, it } from "vitest";

import { summarizeDashboardExpenses } from "./dashboard-expenses";

describe("summarizeDashboardExpenses", () => {
  it("uses active card installments instead of the full purchase transaction", () => {
    const summary = summarizeDashboardExpenses({
      transactions: [
        { amount: 1_000, category: "Compras", type: "EXPENSE", source: "CREDIT_CARD" },
        { amount: 80, category: "Alimentação", type: "EXPENSE", source: null },
        { amount: 500, category: "Salário", type: "INCOME", source: null },
      ],
      installments: [
        { amount: 100, purchase: { category: "Compras", card: { isActive: true } } },
        { amount: 100, purchase: { category: "Compras", card: { isActive: false } } },
      ],
    });

    expect(summary.income).toBe(500);
    expect(summary.expense).toBe(180);
    expect(summary.transactionCount).toBe(3);
    expect(summary.expenseCategories).toEqual([
      { category: "Compras", amount: 100 },
      { category: "Alimentação", amount: 80 },
    ]);
  });
});
