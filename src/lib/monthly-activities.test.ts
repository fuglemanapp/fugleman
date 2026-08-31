import { describe, expect, it } from "vitest";

import { buildMonthlyActivities } from "./monthly-activities";

describe("buildMonthlyActivities", () => {
  it("shows active card installments in their statement month without duplicating the original purchase", () => {
    const activities = buildMonthlyActivities({
      transactions: [
        {
          id: "card-purchase",
          amount: 1_000,
          description: "Notebook",
          category: "Compras",
          type: "EXPENSE",
          date: new Date("2026-08-20T12:00:00.000Z"),
          source: "CREDIT_CARD",
        },
        {
          id: "cash-expense",
          amount: 80,
          description: "Mercado",
          category: "Alimentação",
          type: "EXPENSE",
          date: new Date("2026-09-03T12:00:00.000Z"),
          source: null,
        },
      ],
      installments: [
        {
          id: "active-installment",
          number: 1,
          amount: 100,
          dueMonth: new Date("2026-09-01T12:00:00.000Z"),
          purchase: {
            description: "Notebook",
            category: "Compras",
            installments: 10,
            card: { id: "card-1", name: "Magalu", lastFour: "5515", isActive: true },
          },
        },
        {
          id: "inactive-installment",
          number: 1,
          amount: 999,
          dueMonth: new Date("2026-09-01T12:00:00.000Z"),
          purchase: {
            description: "Registro antigo",
            category: "Compras",
            installments: 1,
            card: { id: "card-2", name: "Magalu", lastFour: "5515", isActive: false },
          },
        },
      ],
    });

    expect(activities).toEqual([
      expect.objectContaining({
        id: "cash-expense",
        kind: "TRANSACTION",
        amount: 80,
        canDelete: true,
      }),
      expect.objectContaining({
        id: "installment:active-installment",
        kind: "CARD_INSTALLMENT",
        amount: 100,
        description: "Notebook",
        cardName: "Magalu",
        installmentLabel: "1/10",
        canDelete: false,
      }),
    ]);
  });
});
