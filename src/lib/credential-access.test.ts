import { expect, it } from "vitest";

import { canAuthenticateWithPassword } from "./credential-access";

it("requires both a password hash and a verified e-mail", () => {
  expect(canAuthenticateWithPassword({ passwordHash: "hash", emailVerified: new Date() })).toBe(true);
  expect(canAuthenticateWithPassword({ passwordHash: "hash", emailVerified: null })).toBe(false);
  expect(canAuthenticateWithPassword({ passwordHash: null, emailVerified: new Date() })).toBe(false);
});
