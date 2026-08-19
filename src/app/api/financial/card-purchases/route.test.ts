import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  resolveFinancialContext: vi.fn(),
  normalizeCardPurchaseInput: vi.fn(),
  validDate: vi.fn(),
  applyTransactionRule: vi.fn(),
  buildPendingInstallments: vi.fn(),
  calculatePurchaseTotal: vi.fn(),
  creditCardFindFirst: vi.fn(),
  cardPurchaseFindFirst: vi.fn(),
  cardPurchaseCreate: vi.fn(),
  cardPurchaseUpdate: vi.fn(),
  cardPurchaseDelete: vi.fn(),
  cardInstallmentDeleteMany: vi.fn(),
  transactionCreate: vi.fn(),
  transactionUpdate: vi.fn(),
  transactionDelete: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/lib/current-user", () => ({ getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/lib/financial-context", () => ({ resolveFinancialContext: mocks.resolveFinancialContext }));
vi.mock("@/lib/card-purchase-input", () => ({ normalizeCardPurchaseInput: mocks.normalizeCardPurchaseInput }));
vi.mock("@/lib/financial-input", () => ({ validDate: mocks.validDate }));
vi.mock("@/lib/transaction-rules", () => ({ applyTransactionRule: mocks.applyTransactionRule }));
vi.mock("@/lib/credit-cards", () => ({
  buildPendingInstallments: mocks.buildPendingInstallments,
  calculatePurchaseTotal: mocks.calculatePurchaseTotal,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    creditCard: { findFirst: mocks.creditCardFindFirst },
    cardPurchase: {
      findFirst: mocks.cardPurchaseFindFirst,
      create: mocks.cardPurchaseCreate,
      update: mocks.cardPurchaseUpdate,
      delete: mocks.cardPurchaseDelete,
    },
    cardInstallment: { deleteMany: mocks.cardInstallmentDeleteMany },
    transaction: {
      create: mocks.transactionCreate,
      update: mocks.transactionUpdate,
      delete: mocks.transactionDelete,
    },
    $transaction: mocks.transaction,
  },
}));

import * as route from "./route";

const familyContext = {
  key: "team:family-1" as const,
  type: "FAMILY" as const,
  userId: null,
  memberIds: ["user-1"],
  teamId: "family-1",
  name: "Família",
  role: "ADMIN" as const,
};

const personalContext = {
  key: "personal" as const,
  type: "PERSONAL" as const,
  userId: "user-1",
  memberIds: ["user-1"],
  teamId: null,
  name: "Pessoal",
  role: null,
};

const purchaseInput = {
  id: "purchase-1",
  cardId: "card-1",
  context: "team:family-1",
  description: "Curso",
  category: "Educação",
  mode: "INSTALLMENT",
  amountPerInstallment: 272.4,
  installments: 21,
  currentInstallment: 20,
  purchaseDate: "2025-01-22T12:00:00.000Z",
};

function request(method: string, body?: Record<string, unknown>, context = "team:family-1") {
  return new Request(`http://localhost/api/financial/card-purchases?id=purchase-1&context=${context}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("card purchases API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.resolveFinancialContext.mockResolvedValue(familyContext);
    mocks.normalizeCardPurchaseInput.mockReturnValue({
      value: {
        mode: "INSTALLMENT",
        amountPerInstallment: 272.4,
        installments: 21,
        currentInstallment: 20,
      },
    });
    mocks.validDate.mockImplementation((value: unknown) => new Date(String(value)));
    mocks.applyTransactionRule.mockResolvedValue({ category: "Educação", matchedBy: undefined });
    mocks.creditCardFindFirst.mockResolvedValue({ id: "card-1", closingDay: 10 });
    mocks.calculatePurchaseTotal.mockReturnValue(5720.4);
    mocks.buildPendingInstallments.mockReturnValue([
      { number: 20, dueMonth: new Date("2026-09-01T12:00:00.000Z"), amount: 272.4 },
      { number: 21, dueMonth: new Date("2026-10-01T12:00:00.000Z"), amount: 272.4 },
    ]);
    mocks.transaction.mockImplementation(async (callback: (database: unknown) => unknown) => callback({
      transaction: { create: mocks.transactionCreate, update: mocks.transactionUpdate, delete: mocks.transactionDelete },
      cardPurchase: { create: mocks.cardPurchaseCreate, update: mocks.cardPurchaseUpdate, delete: mocks.cardPurchaseDelete },
      cardInstallment: { deleteMany: mocks.cardInstallmentDeleteMany },
    }));
  });

  it("persists the complete amount and only pending installments on POST", async () => {
    mocks.transactionCreate.mockResolvedValue({ id: "transaction-1" });
    mocks.cardPurchaseCreate.mockResolvedValue({ id: "purchase-1", installmentsList: [], transaction: {} });

    const response = await route.POST(request("POST", purchaseInput));

    expect(response.status).toBe(201);
    expect(mocks.transactionCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ amount: 5720.4 }),
    }));
    expect(mocks.cardPurchaseCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        totalAmount: 5720.4,
        installments: 21,
        installmentAmount: 272.4,
        currentInstallment: 20,
        installmentsList: { create: expect.arrayContaining([expect.objectContaining({ number: 20 }), expect.objectContaining({ number: 21 })]) },
      }),
    }));
  });

  it("rebuilds only a purchase's installments and linked transaction on PATCH", async () => {
    mocks.cardPurchaseFindFirst.mockResolvedValue({ id: "purchase-1", transactionId: "transaction-1", card: { closingDay: 10 } });
    mocks.cardPurchaseUpdate.mockResolvedValue({ id: "purchase-1", installmentsList: [], transaction: {} });

    const patch = (route as Record<string, unknown>).PATCH as (input: Request) => Promise<Response>;
    const response = await patch(request("PATCH", purchaseInput));

    expect(response.status).toBe(200);
    expect(mocks.transactionUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "transaction-1" },
      data: expect.objectContaining({ amount: 5720.4 }),
    }));
    expect(mocks.cardInstallmentDeleteMany).toHaveBeenCalledWith({ where: { purchaseId: "purchase-1" } });
    expect(mocks.cardPurchaseUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "purchase-1" },
      data: expect.objectContaining({ installmentAmount: 272.4, currentInstallment: 20 }),
    }));
  });

  it("deletes only the owned purchase and its transaction", async () => {
    mocks.cardPurchaseFindFirst.mockResolvedValue({ id: "purchase-1", transactionId: "transaction-1" });
    mocks.transaction.mockResolvedValue([]);

    const response = await route.DELETE(request("DELETE"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true, purchaseId: "purchase-1" });
    expect(mocks.cardPurchaseDelete).toHaveBeenCalledWith({ where: { id: "purchase-1" } });
    expect(mocks.transactionDelete).toHaveBeenCalledWith({ where: { id: "transaction-1" } });
    expect(mocks.creditCardFindFirst).not.toHaveBeenCalled();
  });

  it("does not delete a purchase when its card is outside the requested context", async () => {
    mocks.cardPurchaseFindFirst.mockResolvedValue(null);

    const response = await route.DELETE(request("DELETE"));

    expect(response.status).toBe(404);
    expect(mocks.resolveFinancialContext).toHaveBeenCalledWith("user-1", "team:family-1");
    expect(mocks.cardPurchaseFindFirst).toHaveBeenCalledWith({
      where: {
        id: "purchase-1",
        userId: "user-1",
        card: { teamId: "family-1", userId: "user-1", isActive: true },
      },
      select: { id: true, transactionId: true },
    });
    expect(mocks.cardPurchaseDelete).not.toHaveBeenCalled();
    expect(mocks.transactionDelete).not.toHaveBeenCalled();
    expect(mocks.creditCardFindFirst).not.toHaveBeenCalled();
  });

  it("does not delete a family-card purchase from the personal context", async () => {
    mocks.resolveFinancialContext.mockResolvedValue(personalContext);
    mocks.cardPurchaseFindFirst.mockResolvedValue(null);

    const response = await route.DELETE(request("DELETE", undefined, "personal"));

    expect(response.status).toBe(404);
    expect(mocks.cardPurchaseFindFirst).toHaveBeenCalledWith({
      where: {
        id: "purchase-1",
        userId: "user-1",
        card: { teamId: null, userId: "user-1", isActive: true },
      },
      select: { id: true, transactionId: true },
    });
    expect(mocks.cardPurchaseDelete).not.toHaveBeenCalled();
    expect(mocks.transactionDelete).not.toHaveBeenCalled();
  });

  it("does not update a family-card purchase from the personal context", async () => {
    mocks.resolveFinancialContext.mockResolvedValue(personalContext);
    mocks.cardPurchaseFindFirst.mockResolvedValue(null);

    const patch = (route as Record<string, unknown>).PATCH as (input: Request) => Promise<Response>;
    const response = await patch(request("PATCH", { ...purchaseInput, context: "personal" }));

    expect(response.status).toBe(404);
    expect(mocks.cardPurchaseFindFirst).toHaveBeenCalledWith({
      where: {
        id: "purchase-1",
        userId: "user-1",
        card: { teamId: null, userId: "user-1", isActive: true },
      },
      select: { id: true, transactionId: true, card: { select: { closingDay: true } } },
    });
    expect(mocks.transactionUpdate).not.toHaveBeenCalled();
    expect(mocks.cardPurchaseUpdate).not.toHaveBeenCalled();
  });
});
