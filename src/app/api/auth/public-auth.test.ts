import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  consumeRateLimit: vi.fn(),
  sendAccountEmail: vi.fn(),
  validateRegistrationInput: vi.fn(),
  createOpaqueToken: vi.fn(),
  hashPassword: vi.fn(),
  getClientKey: vi.fn(),
  userFindUnique: vi.fn(),
  userCreate: vi.fn(),
  emailTokenDeleteMany: vi.fn(),
  emailTokenCreate: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({ consumeRateLimit: mocks.consumeRateLimit }));
vi.mock("@/lib/account-input", () => ({ validateRegistrationInput: mocks.validateRegistrationInput }));
vi.mock("@/lib/account-tokens", () => ({ createOpaqueToken: mocks.createOpaqueToken }));
vi.mock("@/lib/password", () => ({ hashPassword: mocks.hashPassword }));
vi.mock("@/lib/request-client", () => ({ getClientKey: mocks.getClientKey }));
vi.mock("@/lib/account-email", () => ({
  buildAccountUrl: (path: string, token: string) => new URL(`${path}?token=${token}`, "https://whatspent.com"),
  sendAccountEmail: mocks.sendAccountEmail,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique, create: mocks.userCreate },
    emailVerificationToken: { deleteMany: mocks.emailTokenDeleteMany, create: mocks.emailTokenCreate },
    $transaction: async (work: (transaction: unknown) => Promise<unknown>) => work({
      user: { create: mocks.userCreate },
      emailVerificationToken: { deleteMany: mocks.emailTokenDeleteMany, create: mocks.emailTokenCreate },
    }),
  },
}));

import { POST } from "./register/route";

describe("public registration API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true, remaining: 4, retryAfterSeconds: 60 });
    mocks.validateRegistrationInput.mockReturnValue({
      ok: true,
      value: { name: "Ana", email: "ana@example.com", password: "senha-segura12" },
    });
    mocks.createOpaqueToken.mockReturnValue({ plain: "plain-token", hash: "token-hash" });
    mocks.hashPassword.mockResolvedValue("password-hash");
    mocks.getClientKey.mockReturnValue("203.0.113.10");
    mocks.userFindUnique.mockResolvedValue(null);
    mocks.userCreate.mockResolvedValue({ id: "user-a", email: "ana@example.com", name: "Ana" });
    mocks.emailTokenDeleteMany.mockResolvedValue({ count: 0 });
    mocks.emailTokenCreate.mockResolvedValue({ id: "verification-a" });
    mocks.sendAccountEmail.mockResolvedValue(undefined);
  });

  it("creates an unverified account and sends a verification e-mail", async () => {
    const response = await POST(new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.10" },
      body: JSON.stringify({ name: "Ana", email: "ANA@example.com", password: "senha-segura12" }),
    }));

    expect(response.status).toBe(201);
    expect(mocks.userCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ email: "ana@example.com", emailVerified: null }),
    }));
    expect(mocks.emailTokenCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ userId: "user-a", tokenHash: expect.any(String) }),
    }));
    expect(mocks.sendAccountEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "ana@example.com" }));
  });

  it("does not create an account when the e-mail already exists", async () => {
    mocks.userFindUnique.mockResolvedValue({ id: "existing-user" });

    const response = await POST(new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "Ana", email: "ana@example.com", password: "senha-segura12" }),
    }));

    expect(response.status).toBe(409);
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });
});
