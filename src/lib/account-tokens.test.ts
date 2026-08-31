import { expect, it } from "vitest";

import { createOpaqueToken, hashOpaqueToken } from "./account-tokens";

it("creates a random plaintext token with a deterministic stored hash", () => {
  const first = createOpaqueToken();
  const second = createOpaqueToken();

  expect(first.plain).not.toBe(first.hash);
  expect(second.plain).not.toBe(first.plain);
  expect(hashOpaqueToken(first.plain)).toBe(first.hash);
});
