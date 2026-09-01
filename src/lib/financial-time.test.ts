import { describe, expect, it } from "vitest";

import {
  monthBoundsInSaoPaulo,
  nextStatementMonthInSaoPaulo,
  saoPauloCalendarDate,
} from "./financial-time";

describe("financial time in São Paulo", () => {
  const augustEveningInBrazil = new Date("2026-09-01T00:30:00.000Z");

  it("keeps the local date in August after UTC has turned to September", () => {
    expect(saoPauloCalendarDate(augustEveningInBrazil)).toBe("2026-08-31");
  });

  it("keeps August as the active dashboard month at the UTC boundary", () => {
    const { from, to } = monthBoundsInSaoPaulo(augustEveningInBrazil);

    expect(from.toISOString()).toBe("2026-08-01T00:00:00.000Z");
    expect(to.toISOString()).toBe("2026-09-01T00:00:00.000Z");
  });

  it("opens card statements on September, not October, on August 31 in Brazil", () => {
    expect(nextStatementMonthInSaoPaulo(augustEveningInBrazil).toISOString()).toBe(
      "2026-09-01T12:00:00.000Z",
    );
  });
});
