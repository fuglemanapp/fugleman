import { describe, expect, it } from "vitest";

import { parseAgentAction } from "./personal-agent";

describe("parseAgentAction", () => {
  it("accepts a valid expense action", () => {
    expect(
      parseAgentAction({
        kind: "EXPENSE",
        amount: 42.5,
        description: "iFood",
        category: "Alimentação",
        date: "2026-08-16",
      }),
    ).toMatchObject({ kind: "EXPENSE", amount: 42.5 });
  });

  it("turns malformed actions into NONE", () => {
    expect(
      parseAgentAction({ kind: "EXPENSE", amount: -4, description: "", category: "", date: "tomorrow" }),
    ).toEqual({ kind: "NONE" });
  });

  it("accepts an event only when it has ordered ISO timestamps", () => {
    expect(
      parseAgentAction({
        kind: "EVENT",
        title: "Consulta",
        startTime: "2026-08-17T15:00:00.000Z",
        endTime: "2026-08-17T16:00:00.000Z",
        description: null,
      }),
    ).toMatchObject({ kind: "EVENT" });
  });
});
