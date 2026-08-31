import { describe, expect, it } from "vitest";

import { actionConfirmation, getGroqModel, parseAgentAction, parseAgentPendingAction, parseExplicitEventCommand, replyAfterActionValidation, runPersonalAgent } from "./personal-agent";

describe("parseAgentAction", () => {
  it("uses a Groq model that remains available to developer accounts by default", () => {
    expect(getGroqModel(undefined)).toBe("openai/gpt-oss-20b");
  });

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

  it("keeps partial card details in a pending action instead of treating them as a failed command", () => {
    expect(
      parseAgentPendingAction({
        kind: "CARD_PURCHASE",
        amount: 95,
        description: "Veterinário",
        cardReference: "Itaú 2860",
      }),
    ).toEqual({
      kind: "CARD_PURCHASE",
      amount: 95,
      description: "Veterinário",
      cardReference: "Itaú 2860",
    });
  });

  it("accepts a complete card purchase action", () => {
    expect(
      parseAgentAction({
        kind: "CARD_PURCHASE",
        amount: 95,
        description: "Veterinário",
        category: "Saúde",
        date: "2026-08-31",
        cardReference: "Itaú 2860",
      }),
    ).toMatchObject({ kind: "CARD_PURCHASE", amount: 95, cardReference: "Itaú 2860" });
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

  it("turns an explicit Brazilian date into a São Paulo event", () => {
    expect(
      parseExplicitEventCommand("Crie um compromisso para mim para o dia 21/08 às 12:00: Atividade dejem", new Date("2026-08-18T12:00:00.000Z")),
    ).toEqual({
      kind: "EVENT",
      title: "Atividade dejem",
      description: null,
      startTime: "2026-08-21T15:00:00.000Z",
      endTime: "2026-08-21T16:00:00.000Z",
    });
  });

  it("accepts the WhatsApp phrasing used for a timed appointment", () => {
    expect(
      parseExplicitEventCommand("Cria um compromisso pra mim dia 26/09/2026 às 12:00: Prova Engenharia, ciência e Tecnologia", new Date("2026-08-31T07:00:00.000Z")),
    ).toEqual({
      kind: "EVENT",
      title: "Prova Engenharia, ciência e Tecnologia",
      description: null,
      startTime: "2026-09-26T15:00:00.000Z",
      endTime: "2026-09-26T16:00:00.000Z",
    });
  });

  it("asks for a time instead of sending an incomplete appointment to the AI", async () => {
    const result = await runPersonalAgent({
      userId: "user-1",
      text: "Cria um compromisso pra mim dia 26/09/2026: Prova Engenharia, ciência e Tecnologia",
      now: new Date("2026-08-31T07:00:00.000Z"),
    });

    expect(result.action).toEqual({ kind: "NONE" });
    expect(result.reply).toContain("horário");
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
