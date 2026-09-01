import { describe, expect, it } from "vitest";

import { safeCallbackPath } from "./auth-navigation";

describe("safeCallbackPath", () => {
  it("keeps an internal dashboard callback", () => {
    expect(safeCallbackPath("/dashboard/conta")).toBe("/dashboard/conta");
  });

  it("rejects external and protocol-relative callback URLs", () => {
    expect(safeCallbackPath("https://example.com")).toBe("/dashboard");
    expect(safeCallbackPath("//example.com")).toBe("/dashboard");
  });
});
