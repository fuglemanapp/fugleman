import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  sendAccountEmail: vi.fn(),
  consumeRateLimit: vi.fn(),
  userFindUnique: vi.fn(),
  transactionFindMany: vi.fn(),
  creditCardFindMany: vi.fn(),
  cardPurchaseFindMany: vi.fn(),
  eventFindMany: vi.fn(),
  projectFindMany: vi.fn(),
  noteFindMany: vi.fn(),
  recurringTransactionFindMany: vi.fn(),
  budgetFindMany: vi.fn(),
  financialGoalFindMany: vi.fn(),
  financialPreferencesFindUnique: vi.fn(),
  assistantConversationFindUnique: vi.fn(),
  accountDeletionRequestUpsert: vi.fn(),
  userDelete: vi.fn(),
}));

vi.mock("@/lib/current-user", () => ({ getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/lib/account-email", () => ({ sendAccountEmail: mocks.sendAccountEmail }));
vi.mock("@/lib/rate-limit", () => ({ consumeRateLimit: mocks.consumeRateLimit }));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique, delete: mocks.userDelete },
    transaction: { findMany: mocks.transactionFindMany },
    creditCard: { findMany: mocks.creditCardFindMany },
    cardPurchase: { findMany: mocks.cardPurchaseFindMany },
    event: { findMany: mocks.eventFindMany },
    project: { findMany: mocks.projectFindMany },
    note: { findMany: mocks.noteFindMany },
    recurringTransaction: { findMany: mocks.recurringTransactionFindMany },
    budget: { findMany: mocks.budgetFindMany },
    financialGoal: { findMany: mocks.financialGoalFindMany },
    financialPreferences: { findUnique: mocks.financialPreferencesFindUnique },
    assistantConversation: { findUnique: mocks.assistantConversationFindUnique },
    accountDeletionRequest: { upsert: mocks.accountDeletionRequestUpsert },
  },
}));

import { GET as exportGET } from "./export/route";
import { POST as deletionPOST } from "./deletion-request/route";

describe("account privacy routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentUser.mockResolvedValue({ id: "user-a", email: "ana@example.com", name: "Ana", phone: "+5511999999999", createdAt: new Date("2026-01-01") });
    mocks.userFindUnique.mockResolvedValue({ id: "user-a", name: "Ana", email: "ana@example.com", image: null, phone: "+5511999999999", createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-02") });
    mocks.transactionFindMany.mockResolvedValue([{ id: "transaction-a", userId: "user-a" }]);
    mocks.creditCardFindMany.mockResolvedValue([]);
    mocks.cardPurchaseFindMany.mockResolvedValue([]);
    mocks.eventFindMany.mockResolvedValue([]);
    mocks.projectFindMany.mockResolvedValue([]);
    mocks.noteFindMany.mockResolvedValue([]);
    mocks.recurringTransactionFindMany.mockResolvedValue([]);
    mocks.budgetFindMany.mockResolvedValue([]);
    mocks.financialGoalFindMany.mockResolvedValue([]);
    mocks.financialPreferencesFindUnique.mockResolvedValue(null);
    mocks.assistantConversationFindUnique.mockResolvedValue(null);
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true, remaining: 2, retryAfterSeconds: 3600 });
    mocks.accountDeletionRequestUpsert.mockResolvedValue({ id: "request-a" });
    mocks.sendAccountEmail.mockResolvedValue(undefined);
  });

  it("exports only the authenticated user's records", async () => {
    const response = await exportGET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.user.id).toBe("user-a");
    expect(body.transactions.every((row: { userId: string }) => row.userId === "user-a")).toBe(true);
    expect(mocks.transactionFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "user-a" } }));
    expect(response.headers.get("Content-Disposition")).toContain("whatspent-dados.json");
  });

  it("creates a deletion request without deleting data immediately", async () => {
    const response = await deletionPOST(new Request("http://localhost/api/account/deletion-request", { method: "POST" }));

    expect(response.status).toBe(202);
    expect(mocks.accountDeletionRequestUpsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: "user-a" },
      create: expect.objectContaining({ userId: "user-a", status: "PENDING" }),
    }));
    expect(mocks.userDelete).not.toHaveBeenCalled();
  });
});
