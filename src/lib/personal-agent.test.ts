import { describe, expect, it } from "vitest";

import { actionConfirmation, parseAgentAction, parseExplicitEventCommand, replyAfterActionValidation } from "./personal-agent";

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

  it("turns an explicit tomorrow appointment into a São Paulo event", () => {
    expect(
      parseExplicitEventCommand("Crie um compromisso para amanhã às 17:00: Aula de inglês", new Date("2026-08-17T12:00:00.000Z")),
    ).toEqual({
      kind: "EVENT",
      title: "Aula de inglês",
      description: null,
      startTime: "2026-08-18T20:00:00.000Z",
      endTime: "2026-08-18T21:00:00.000Z",
    });
  });

  it("only uses a created confirmation for persisted event actions", () => {
    expect(
      actionConfirmation({
        kind: "EVENT",
        title: "Aula de inglês",
        description: null,
        startTime: "2026-08-18T20:00:00.000Z",
        endTime: "2026-08-18T21:00:00.000Z",
      }),
    ).toBe('Compromisso “Aula de inglês” criado para 18/08 às 17:00.');
    expect(actionConfirmation({ kind: "NONE" })).toBeNull();
  });

  it("does not pass along a successful event reply when no event action was validated", () => {
    expect(
      replyAfterActionValidation("Crie um compromisso para amanhã às 17:00: Aula de inglês", "Compromisso criado com sucesso.", { kind: "NONE" }),
    ).toContain("nenhum compromisso foi criado");
  });
});
