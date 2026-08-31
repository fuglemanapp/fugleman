import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  resolveFinancialContext: vi.fn(),
  creditCardFindMany: vi.fn(),
  creditCardFindFirst: vi.fn(),
  cardInstallmentFindMany: vi.fn(),
  cardStatementPaymentFindMany: vi.fn(),
  cardStatementPaymentDeleteMany: vi.fn(),
  cardStatementPaymentUpsert: vi.fn(),
  dateFromMonthKey: vi.fn(),
  monthKey: vi.fn(),
  statementDueDate: vi.fn(),
}));

vi.mock("@/lib/current-user", () => ({ getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/lib/financial-context", () => ({ resolveFinancialContext: mocks.resolveFinancialContext }));
vi.mock("@/lib/credit-cards", () => ({ dateFromMonthKey: mocks.dateFromMonthKey, monthKey: mocks.monthKey, statementDueDate: mocks.statementDueDate }));
vi.mock("@/lib/prisma", () => ({
  default: {
    creditCard: { findMany: mocks.creditCardFindMany, findFirst: mocks.creditCardFindFirst },
    cardInstallment: { findMany: mocks.cardInstallmentFindMany },
    cardStatementPayment: { findMany: mocks.cardStatementPaymentFindMany, deleteMany: mocks.cardStatementPaymentDeleteMany, upsert: mocks.cardStatementPaymentUpsert },
  },
}));

import * as route from "./route";

const familyContext = { key: "team:family-1" as const, type: "FAMILY" as const, userId: null, memberIds: ["user-1"], teamId: "family-1", name: "Família", role: "ADMIN" as const };
const personalContext = { key: "personal" as const, type: "PERSONAL" as const, userId: "user-1", memberIds: ["user-1"], teamId: null, name: "Pessoal", role: null };

describe("card statements API context isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.resolveFinancialContext.mockResolvedValue(personalContext);
    mocks.dateFromMonthKey.mockImplementation((key: string) => new Date(`${key}-01T12:00:00.000Z`));
    mocks.monthKey.mockReturnValue("2026-08");
    mocks.statementDueDate.mockReturnValue(new Date("2026-08-10T12:00:00.000Z"));
    mocks.creditCardFindMany.mockResolvedValue([]);
    mocks.creditCardFindFirst.mockResolvedValue(null);
    mocks.cardInstallmentFindMany.mockResolvedValue([]);
    mocks.cardStatementPaymentFindMany.mockResolvedValue([]);
  });

  it("opens the statement list at the following calendar month by default", async () => {
    const now = new Date();
    const expectedMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );
    mocks.monthKey.mockImplementation((date: Date) =>
      date.toISOString().slice(0, 7),
    );

    const response = await route.GET(
      new Request("http://localhost/api/financial/card-statements?context=personal"),
    );

    expect(response.status).toBe(200);
    expect(mocks.dateFromMonthKey).toHaveBeenCalledWith(
      expectedMonth.toISOString().slice(0, 7),
    );
  });

  it("does not list family-card statements in the personal context", async () => {
    const response = await route.GET(new Request("http://localhost/api/financial/card-statements?context=personal&from=2026-08&months=1"));

    expect(response.status).toBe(200);
    expect(mocks.creditCardFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "user-1", teamId: null } }));
  });

  it("includes installments stored at the start of the statement month", async () => {
    await route.GET(new Request("http://localhost/api/financial/card-statements?context=personal&from=2026-08&months=1"));

    expect(mocks.cardInstallmentFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        dueMonth: {
          gte: new Date("2026-08-01T00:00:00.000Z"),
          lt: new Date("2026-09-01T00:00:00.000Z"),
        },
      }),
    }));
  });

  it("returns statement data without cache", async () => {
    const response = await route.GET(
      new Request("http://localhost/api/financial/card-statements?context=personal&from=2026-08&months=1"),
    );

    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("does not mark a family-card statement through the personal context", async () => {
    const response = await route.POST(new Request("http://localhost/api/financial/card-statements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: "family-card", dueMonth: "2026-08", context: "personal" }),
    }));

    expect(response.status).toBe(404);
    expect(mocks.creditCardFindFirst).toHaveBeenCalledWith({ where: { id: "family-card", userId: "user-1", teamId: null }, select: { id: true } });
  });

  it("keeps family-card statements scoped to the active family", async () => {
    mocks.resolveFinancialContext.mockResolvedValue(familyContext);
    mocks.creditCardFindFirst.mockResolvedValue({ id: "family-card" });

    const response = await route.POST(new Request("http://localhost/api/financial/card-statements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: "family-card", dueMonth: "2026-08", context: "team:family-1", paid: false }),
    }));

    expect(response.status).toBe(200);
    expect(mocks.creditCardFindFirst).toHaveBeenCalledWith({ where: { id: "family-card", teamId: "family-1" }, select: { id: true } });
  });
});
