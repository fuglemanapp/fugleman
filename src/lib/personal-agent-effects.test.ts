import { describe, expect, it } from "vitest";

import { matchCreditCards } from "./credit-card-reference";

describe("matchCreditCards", () => {
  it("matches a card by a natural reference and its final four digits", () => {
    const cards = [
      { id: "itau", name: "Itaú Black", issuer: "Itaú", lastFour: "2860", closingDay: 10 },
      { id: "magalu", name: "Magalu", issuer: "Itaú", lastFour: "5515", closingDay: 7 },
    ];

    expect(matchCreditCards("cartão Itaú final 2860", cards).map((card) => card.id)).toEqual(["itau"]);
    expect(matchCreditCards("cartão Magalu 5515", cards).map((card) => card.id)).toEqual(["magalu"]);
  });
});
