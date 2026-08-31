import { describe, expect, it } from "vitest";

import { activePendingAction, type PendingAction } from "./assistant-pending-action";

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
});
