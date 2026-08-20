import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  resolveFinancialContext: vi.fn(),
  creditCardFindMany: vi.fn(),
  creditCardFindFirst: vi.fn(),
  creditCardUpdate: vi.fn(),
}));

vi.mock("@/lib/current-user", () => ({ getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/lib/financial-context", () => ({ resolveFinancialContext: mocks.resolveFinancialContext }));
vi.mock("@/lib/prisma", () => ({
  default: {
    creditCard: {
      findMany: mocks.creditCardFindMany,
      findFirst: mocks.creditCardFindFirst,
      update: mocks.creditCardUpdate,
    },
  },
}));

import * as route from "./route";

const familyContext = { key: "team:family-1" as const, type: "FAMILY" as const, userId: null, memberIds: ["user-1"], teamId: "family-1", name: "Família", role: "ADMIN" as const };
const personalContext = { key: "personal" as const, type: "PERSONAL" as const, userId: "user-1", memberIds: ["user-1"], teamId: null, name: "Pessoal", role: null };

describe("cards API context isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.resolveFinancialContext.mockResolvedValue(personalContext);
    mocks.creditCardFindMany.mockResolvedValue([]);
    mocks.creditCardFindFirst.mockResolvedValue(null);
  });

  it("does not list a family card in the personal context", async () => {
    const response = await route.GET(new Request("http://localhost/api/financial/cards?context=personal"));

    expect(response.status).toBe(200);
    expect(mocks.creditCardFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: "user-1", teamId: null } }));
  });

  it("does not update a family card through the personal context", async () => {
    const response = await route.PATCH(new Request("http://localhost/api/financial/cards", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "family-card", context: "personal" }),
    }));

    expect(response.status).toBe(404);
    expect(mocks.creditCardFindFirst).toHaveBeenCalledWith({ where: { id: "family-card", userId: "user-1", teamId: null } });
    expect(mocks.creditCardUpdate).not.toHaveBeenCalled();
  });

  it("does not archive a family card through the personal context", async () => {
    const response = await route.DELETE(new Request("http://localhost/api/financial/cards?id=family-card&context=personal", { method: "DELETE" }));

    expect(response.status).toBe(404);
    expect(mocks.creditCardFindFirst).toHaveBeenCalledWith({ where: { id: "family-card", userId: "user-1", teamId: null }, select: { id: true } });
    expect(mocks.creditCardUpdate).not.toHaveBeenCalled();
  });

  it("keeps family card management scoped to its family", async () => {
    mocks.resolveFinancialContext.mockResolvedValue(familyContext);
    mocks.creditCardFindFirst.mockResolvedValue({ id: "family-card" });
    mocks.creditCardUpdate.mockResolvedValue({ id: "family-card" });

    const response = await route.DELETE(new Request("http://localhost/api/financial/cards?id=family-card&context=team:family-1", { method: "DELETE" }));

    expect(response.status).toBe(204);
    expect(mocks.creditCardFindFirst).toHaveBeenCalledWith({ where: { id: "family-card", userId: "user-1", teamId: "family-1" }, select: { id: true } });
  });
});
