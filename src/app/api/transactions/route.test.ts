import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  resolveFinancialContext: vi.fn(),
  withUserDb: vi.fn(),
  transactionFindMany: vi.fn(),
  installmentFindMany: vi.fn(),
  buildMonthlyActivities: vi.fn(),
}));

vi.mock("@/lib/current-user", () => ({ getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/lib/db-context", () => ({ withUserDb: mocks.withUserDb }));
vi.mock("@/lib/financial-context", () => ({
  resolveFinancialContext: mocks.resolveFinancialContext,
  transactionContextWhere: (context: { userId: string }) => ({ userId: context.userId }),
}));
vi.mock("@/lib/monthly-activities", () => ({ buildMonthlyActivities: mocks.buildMonthlyActivities }));
vi.mock("@/lib/transaction-rules", () => ({ applyTransactionRule: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ default: {} }));

import { GET } from "./route";

describe("transactions API database context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentUser.mockResolvedValue({ id: "user-a" });
    mocks.resolveFinancialContext.mockResolvedValue({ key: "personal", type: "PERSONAL", userId: "user-a", memberIds: ["user-a"], teamId: null, name: "Meu espaço" });
    mocks.transactionFindMany.mockResolvedValue([]);
    mocks.installmentFindMany.mockResolvedValue([]);
    mocks.buildMonthlyActivities.mockReturnValue([]);
    mocks.withUserDb.mockImplementation(async (_userId: string, work: (database: unknown) => Promise<unknown>) => work({
      transaction: { findMany: mocks.transactionFindMany },
      cardInstallment: { findMany: mocks.installmentFindMany },
    }));
  });

  it("reads transactions inside the authenticated user's database context", async () => {
    const response = await GET(new Request("http://localhost/api/transactions"));

    expect(response.status).toBe(200);
    expect(mocks.withUserDb).toHaveBeenCalledWith("user-a", expect.any(Function));
  });
});
