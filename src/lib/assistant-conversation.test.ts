import { describe, expect, it, vi } from "vitest";

vi.mock("./personal-agent-effects", () => ({ persistAgentAction: vi.fn() }));

import { resolveAssistantTurn } from "./assistant-conversation";

describe("resolveAssistantTurn", () => {
  it("completes a pending card purchase from a natural follow-up", () => {
    const result = resolveAssistantTurn({
      currentPendingAction: {
        id: "pending-1",
        kind: "CARD_PURCHASE",
        amount: 95,
        description: "Veterinário",
        cardReference: "Itaú 2860",
        createdAt: "2026-08-31T15:00:00.000Z",
        expiresAt: "2026-08-31T15:30:00.000Z",
      },
      action: { kind: "NONE" },
      pendingAction: { kind: "CARD_PURCHASE", category: "Saúde", date: "2026-08-31" },
      now: new Date("2026-08-31T15:10:00.000Z"),
    });

    expect(result.pendingAction).toBeNull();
    expect(result.action).toEqual({
      kind: "CARD_PURCHASE",
      amount: 95,
      description: "Veterinário",
      category: "Saúde",
      date: "2026-08-31",
      cardReference: "Itaú 2860",
    });
  });
});
