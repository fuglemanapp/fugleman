import { expect, it } from "vitest";

import { CARD_COLORS } from "./card-colors";

it("provides twelve distinct valid card colors", () => {
  expect(CARD_COLORS).toHaveLength(12);
  expect(new Set(CARD_COLORS).size).toBe(CARD_COLORS.length);
  expect(CARD_COLORS.every((color) => /^#[0-9A-F]{6}$/.test(color))).toBe(true);
});
