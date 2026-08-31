import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  executeRaw: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: { $transaction: mocks.transaction },
}));

import { withUserDb } from "./db-context";

describe("request-bound database context", () => {
  it("sets only the current user identifier as a transaction-local setting", async () => {
    mocks.executeRaw.mockResolvedValue(1);
    mocks.transaction.mockImplementation(async (work: (transaction: { $executeRaw: typeof mocks.executeRaw }) => Promise<unknown>) => work({ $executeRaw: mocks.executeRaw }));

    await withUserDb("user-a", async () => "done");

    expect(mocks.executeRaw).toHaveBeenCalledTimes(1);
    expect(mocks.executeRaw.mock.calls[0][0].join("")).toContain("set_config('app.user_id', ");
    expect(mocks.executeRaw.mock.calls[0][0].join("")).toContain(", true)");
    expect(mocks.executeRaw.mock.calls[0][1]).toBe("user-a");
  });
});
