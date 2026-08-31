import { describe, expect, it } from "vitest";

import { activePendingAction, cancelPendingAction, mergePendingAction, missingPendingFields, type PendingAction } from "./assistant-pending-action";

function pending(expiresAt: string): PendingAction {
  return {
    id: "pending-1",
    kind: "EXPENSE",
    amount: 95,
    description: "Veterinário",
    createdAt: "2026-08-31T15:00:00.000Z",
    expiresAt,
  };
}

describe("activePendingAction", () => {
  it("drops a pending action after thirty minutes", () => {
    expect(activePendingAction(pending("2026-08-31T15:30:00.000Z"), new Date("2026-08-31T15:30:00.000Z"))).toBeNull();
  });

  it("merges category and date into a pending card purchase", () => {
    const result = mergePendingAction(
      { ...pending("2026-08-31T15:30:00.000Z"), kind: "CARD_PURCHASE", cardReference: "Itaú 2860" },
      { category: "Saúde", date: "2026-08-31" },
    );

    expect(result).toMatchObject({ amount: 95, description: "Veterinário", cardReference: "Itaú 2860", category: "Saúde", date: "2026-08-31" });
    expect(missingPendingFields(result)).toEqual([]);
  });

  it("keeps existing values when a partial reply omits them", () => {
    const result = mergePendingAction(
      { ...pending("2026-08-31T15:30:00.000Z"), kind: "CARD_PURCHASE", cardReference: "Itaú 2860", category: "Saúde" },
      { date: "2026-08-31" },
    );

    expect(result).toMatchObject({ amount: 95, description: "Veterinário", category: "Saúde", date: "2026-08-31" });
  });

  it("recognizes a natural cancellation", () => {
    expect(cancelPendingAction("cancela isso")).toBe(true);
  });
});
