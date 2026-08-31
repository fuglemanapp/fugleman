import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ queryRaw: vi.fn() }));

vi.mock("@/lib/prisma", () => ({ default: { $queryRaw: mocks.queryRaw } }));

import { consumeRateLimit } from "./rate-limit";

describe("consumeRateLimit", () => {
  it("uses the shared database bucket instead of process memory", async () => {
    mocks.queryRaw.mockResolvedValueOnce([{ count: 1, resetAt: new Date(Date.now() + 60_000) }]);

    const result = await consumeRateLimit("credentials:user@example.com", {
      limit: 5,
      windowMs: 60_000,
    });

    expect(result).toMatchObject({ allowed: true, remaining: 4 });
    expect(mocks.queryRaw).toHaveBeenCalledTimes(1);
  });
});
