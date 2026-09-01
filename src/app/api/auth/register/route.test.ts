import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  hashPassword: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  consumeRateLimit: vi.fn(),
  reportSecurityEvent: vi.fn(),
  validateRegistrationInput: vi.fn(),
}));

vi.mock("@/lib/password", () => ({ hashPassword: mocks.hashPassword }));
vi.mock("@/lib/prisma", () => ({ default: { user: { findUnique: mocks.findUnique, create: mocks.create } } }));
vi.mock("@/lib/rate-limit", () => ({ consumeRateLimit: mocks.consumeRateLimit }));
vi.mock("@/lib/security-events", () => ({ reportSecurityEvent: mocks.reportSecurityEvent }));
vi.mock("@/lib/registration", () => ({ validateRegistrationInput: mocks.validateRegistrationInput }));

import * as route from "./route";

const accepted = { allowed: true, remaining: 2, retryAfterSeconds: 3600 };

describe("public registration API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.consumeRateLimit.mockResolvedValue(accepted);
    mocks.findUnique.mockResolvedValue(null);
    mocks.hashPassword.mockResolvedValue("hashed-password");
    mocks.create.mockResolvedValue({ id: "user-1" });
    mocks.validateRegistrationInput.mockImplementation((input: { name: string; email: string; password: string }) => ({
      valid: true,
      data: { ...input, email: input.email.toLowerCase() },
    }));
  });

  it("creates a password account without exposing the password", async () => {
    const response = await route.POST(new Request("https://whatspent.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://whatspent.com" },
      body: JSON.stringify({ name: "Ana", email: "ANA@example.com", password: "senhaSegura2026" }),
    }));

    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ email: "ana@example.com", passwordHash: "hashed-password" }),
    }));
    expect(await response.json()).toEqual({ ok: true });
  });

  it("blocks a cross-site registration request", async () => {
    const response = await route.POST(new Request("https://whatspent.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://other.example" },
      body: JSON.stringify({ name: "Ana", email: "ana@example.com", password: "senhaSegura2026" }),
    }));

    expect(response.status).toBe(403);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("rate limits repeated sign-up attempts", async () => {
    mocks.consumeRateLimit
      .mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterSeconds: 57 })
      .mockResolvedValueOnce(accepted);

    const response = await route.POST(new Request("https://whatspent.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ana", email: "ana@example.com", password: "senhaSegura2026" }),
    }));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("3600");
    expect(mocks.reportSecurityEvent).toHaveBeenCalledWith("rate_limit_reached", expect.objectContaining({ scope: "signup" }));
  });
});
