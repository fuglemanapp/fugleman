import { describe, expect, it } from "vitest";

import {
  buildPendingInstallments,
  calculatePurchaseTotal,
  monthKey,
  suggestCurrentInstallment,
} from "./credit-cards";

describe("credit card calculation helpers", () => {
  it("keeps a cash purchase as installment 1/1", () => {
    expect(calculatePurchaseTotal(90, 1)).toBe(90);
  });

  it("uses the entered installment value instead of dividing it again", () => {
    expect(calculatePurchaseTotal(272.4, 21)).toBe(5720.4);
  });

  it("preserves cents while clamping the installment count", () => {
    expect(calculatePurchaseTotal(10.01, 49)).toBe(480.48);
  });

  it("suggests installment 20 for a January 2025 purchase viewed in August 2026", () => {
    expect(
      suggestCurrentInstallment(
        new Date("2025-01-22T12:00:00.000Z"),
        21,
        new Date("2026-08-19T12:00:00.000Z"),
      ),
    ).toBe(20);
  });

  it("clamps the suggested installment to the allowed range", () => {
    expect(
      suggestCurrentInstallment(
        new Date("2025-01-22T12:00:00.000Z"),
        0,
        new Date("2030-01-01T12:00:00.000Z"),
      ),
    ).toBe(1);
    expect(
      suggestCurrentInstallment(
        new Date("2025-01-22T12:00:00.000Z"),
        80,
        new Date("2030-01-01T12:00:00.000Z"),
      ),
    ).toBe(48);
  });

  it("creates only the remaining installments for statement projection", () => {
    const schedule = buildPendingInstallments({
      installmentAmount: 272.4,
      installments: 21,
      currentInstallment: 20,
      purchaseDate: new Date("2025-01-22T12:00:00.000Z"),
      closingDay: 10,
      referenceDate: new Date("2026-08-19T12:00:00.000Z"),
    });

    expect(schedule.map((item) => item.number)).toEqual([20, 21]);
    expect(schedule.map((item) => item.amount)).toEqual([272.4, 272.4]);
    expect(schedule.map((item) => monthKey(item.dueMonth))).toEqual(["2026-09", "2026-10"]);
  });

  it("anchors the full schedule to the original purchase date", () => {
    const schedule = buildPendingInstallments({
      installmentAmount: 272.4,
      installments: 21,
      currentInstallment: 1,
      purchaseDate: new Date("2025-01-22T12:00:00.000Z"),
      closingDay: 13,
      referenceDate: new Date("2026-08-20T12:00:00.000Z"),
    });

    expect(schedule).toHaveLength(21);
    expect(schedule[0]).toMatchObject({ number: 1, amount: 272.4 });
    expect(monthKey(schedule[0].dueMonth)).toBe("2025-02");
    expect(monthKey(schedule[19].dueMonth)).toBe("2026-09");
    expect(monthKey(schedule[20].dueMonth)).toBe("2026-10");
  });

  it("keeps a constant amount and clamps the current installment", () => {
    const schedule = buildPendingInstallments({
      installmentAmount: 10.01,
      installments: 49,
      currentInstallment: 0,
      purchaseDate: new Date("2026-08-05T12:00:00.000Z"),
      closingDay: 10,
      referenceDate: new Date("2026-08-19T12:00:00.000Z"),
    });

    expect(schedule).toHaveLength(48);
    expect(schedule[0]).toMatchObject({ number: 1, amount: 10.01 });
    expect(schedule.at(-1)).toMatchObject({ number: 48, amount: 10.01 });
    expect(monthKey(schedule[0].dueMonth)).toBe("2026-08");
    expect(monthKey(schedule.at(-1)!.dueMonth)).toBe("2030-07");
  });
});
