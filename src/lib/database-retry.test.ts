import { describe, expect, it } from "vitest";

import { retryDatabaseOperation } from "./database-retry";

describe("retryDatabaseOperation", () => {
  it("retries a transient database initialization failure before succeeding", async () => {
    let attempts = 0;

    const result = await retryDatabaseOperation(
      async () => {
        attempts += 1;
        if (attempts < 3) {
          const error = new Error("Can't reach database server");
          error.name = "PrismaClientInitializationError";
          throw error;
        }
        return "saved";
      },
      { delay: async () => undefined },
    );

    expect(result).toBe("saved");
    expect(attempts).toBe(3);
  });

  it("does not retry an application validation error", async () => {
    let attempts = 0;

    await expect(
      retryDatabaseOperation(
        async () => {
          attempts += 1;
          throw new Error("Invalid payload");
        },
        { delay: async () => undefined },
      ),
    ).rejects.toThrow("Invalid payload");

    expect(attempts).toBe(1);
  });
});
