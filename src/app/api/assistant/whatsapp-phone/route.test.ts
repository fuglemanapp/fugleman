import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  startPhoneVerification: vi.fn(),
  consumeRateLimit: vi.fn(),
  userFindUnique: vi.fn(),
  userUpdate: vi.fn(),
}));

vi.mock("@/lib/current-user", () => ({ getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/lib/phone-verification", () => ({ startPhoneVerification: mocks.startPhoneVerification }));
vi.mock("@/lib/rate-limit", () => ({ consumeRateLimit: mocks.consumeRateLimit }));
vi.mock("@/lib/zernio", () => ({ normalizePhone: (phone: string) => phone }));
vi.mock("@/lib/prisma", () => ({ default: { user: { findUnique: mocks.userFindUnique, update: mocks.userUpdate } } }));

import { PUT } from "./route";

describe("WhatsApp phone link API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentUser.mockResolvedValue({ id: "user-a" });
    mocks.userFindUnique.mockResolvedValue(null);
    mocks.consumeRateLimit.mockResolvedValue({ allowed: true, remaining: 4, retryAfterSeconds: 3600 });
    mocks.startPhoneVerification.mockResolvedValue({ code: "482193", expiresAt: new Date("2026-09-01T12:00:00.000Z") });
  });

  it("starts a challenge instead of saving a phone typed in the panel", async () => {
    const response = await PUT(new Request("http://localhost/api/assistant/whatsapp-phone", {
      method: "PUT",
      body: JSON.stringify({ phone: "+5511999999999" }),
    }));

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ phone: "+5511999999999", code: "482193", expiresAt: "2026-09-01T12:00:00.000Z" });
    expect(mocks.userUpdate).not.toHaveBeenCalled();
  });

  it("refuses a number already owned by another user without offering transfer", async () => {
    mocks.userFindUnique.mockResolvedValue({ id: "user-b" });

    const response = await PUT(new Request("http://localhost/api/assistant/whatsapp-phone", {
      method: "PUT",
      body: JSON.stringify({ phone: "+5511999999999" }),
    }));

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "Esse número já está vinculado a outra conta WhatSpent." });
    expect(mocks.startPhoneVerification).not.toHaveBeenCalled();
  });

  it("limits repeated verification-code requests from the same account", async () => {
    mocks.consumeRateLimit.mockResolvedValue({ allowed: false, remaining: 0, retryAfterSeconds: 3600 });

    const response = await PUT(new Request("http://localhost/api/assistant/whatsapp-phone", {
      method: "PUT",
      body: JSON.stringify({ phone: "+5511999999999" }),
    }));

    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: "Aguarde alguns minutos antes de gerar outro código." });
    expect(mocks.startPhoneVerification).not.toHaveBeenCalled();
  });
});
