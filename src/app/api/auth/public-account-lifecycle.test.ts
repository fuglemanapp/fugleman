import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  consumeRateLimit: vi.fn(),
  hashOpaqueToken: vi.fn(),
  createOpaqueToken: vi.fn(),
  hashPassword: vi.fn(),
  sendAccountEmail: vi.fn(),
  userFindUnique: vi.fn(),
  userUpdate: vi.fn(),
  emailFindUnique: vi.fn(),
  emailUpdateMany: vi.fn(),
  resetCreate: vi.fn(),
  resetFindUnique: vi.fn(),
  resetUpdateMany: vi.fn(),
  sessionDeleteMany: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({ consumeRateLimit: mocks.consumeRateLimit }));
vi.mock("@/lib/account-tokens", () => ({ hashOpaqueToken: mocks.hashOpaqueToken, createOpaqueToken: mocks.createOpaqueToken }));
vi.mock("@/lib/password", () => ({ hashPassword: mocks.hashPassword }));
vi.mock("@/lib/credential-access", () => ({
  normalizeAccountEmail: (value: unknown) => typeof value === "string" && value.includes("@") ? value.toLowerCase() : null,
  hasSecurePassword: (value: unknown) => typeof value === "string" && value.length >= 12,
}));
vi.mock("@/lib/request-client", () => ({ getClientKey: () => "203.0.113.10" }));
vi.mock("@/lib/account-email", () => ({
  buildAccountUrl: (path: string, token: string) => new URL(`${path}?token=${token}`, "https://whatspent.com"),
  sendAccountEmail: mocks.sendAccountEmail,
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique, update: mocks.userUpdate },
    emailVerificationToken: { findUnique: mocks.emailFindUnique, updateMany: mocks.emailUpdateMany },
    passwordResetToken: { create: mocks.resetCreate, findUnique: mocks.resetFindUnique, updateMany: mocks.resetUpdateMany },
    session: { deleteMany: mocks.sessionDeleteMany },
    $transaction: async (work: (transaction: unknown) => Promise<unknown>) => work({
      user: { update: mocks.userUpdate },
      emailVerificationToken: { findUnique: mocks.emailFindUnique, updateMany: mocks.emailUpdateMany },
      passwordResetToken: { create: mocks.resetCreate, findUnique: mocks.resetFindUnique, updateMany: mocks.resetUpdateMany },
      session: { deleteMany: mocks.sessionDeleteMany },
    }),
  },
}));

import { POST as verifyEmail } from "./verify-email/route";
import { POST as requestReset } from "./password-reset/route";
import { POST as confirmReset } from "./password-reset/confirm/route";

describe("public account lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true, remaining: 4, retryAfterSeconds: 60 });
    mocks.hashOpaqueToken.mockImplementation((value: string) => `hash:${value}`);
    mocks.createOpaqueToken.mockReturnValue({ plain: "reset-token", hash: "hash:reset-token" });
    mocks.hashPassword.mockResolvedValue("new-password-hash");
    mocks.sendAccountEmail.mockResolvedValue(undefined);
    mocks.emailFindUnique.mockResolvedValue({ id: "verify-a", userId: "user-a", expiresAt: new Date(Date.now() + 60_000), usedAt: null });
    mocks.emailUpdateMany.mockResolvedValue({ count: 1 });
    mocks.resetFindUnique.mockResolvedValue({ id: "reset-a", userId: "user-a", expiresAt: new Date(Date.now() + 60_000), usedAt: null });
    mocks.resetUpdateMany.mockResolvedValue({ count: 1 });
    mocks.userUpdate.mockResolvedValue({ id: "user-a" });
    mocks.sessionDeleteMany.mockResolvedValue({ count: 1 });
  });

  it("confirms an unexpired verification token exactly once", async () => {
    const response = await verifyEmail(new Request("http://localhost/api/auth/verify-email", {
      method: "POST", body: JSON.stringify({ token: "verify-token" }),
    }));

    expect(response.status).toBe(200);
    expect(mocks.userUpdate).toHaveBeenCalledWith({ where: { id: "user-a" }, data: { emailVerified: expect.any(Date) } });
    expect(mocks.emailUpdateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ id: "verify-a", usedAt: null }) }));
  });

  it("returns the same reset response for an unknown e-mail", async () => {
    mocks.userFindUnique.mockResolvedValue(null);

    const response = await requestReset(new Request("http://localhost/api/auth/password-reset", {
      method: "POST", body: JSON.stringify({ email: "missing@example.com" }),
    }));

    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(mocks.resetCreate).not.toHaveBeenCalled();
  });

  it("resets a password and clears active sessions after consuming the token", async () => {
    const response = await confirmReset(new Request("http://localhost/api/auth/password-reset/confirm", {
      method: "POST", body: JSON.stringify({ token: "reset-token", password: "senha-nova-segura" }),
    }));

    expect(response.status).toBe(200);
    expect(mocks.userUpdate).toHaveBeenCalledWith({ where: { id: "user-a" }, data: { passwordHash: "new-password-hash" } });
    expect(mocks.sessionDeleteMany).toHaveBeenCalledWith({ where: { userId: "user-a" } });
  });
});
