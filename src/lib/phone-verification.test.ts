import { describe, expect, it } from "vitest";

import { createPhoneVerificationCode, parsePhoneVerificationMessage } from "./phone-verification";

describe("phone verification", () => {
  it("creates a six-digit code", () => {
    expect(createPhoneVerificationCode()).toMatch(/^\d{6}$/);
  });

  it("accepts only the explicit WhatsApp linking command", () => {
    expect(parsePhoneVerificationMessage("VINCULAR 482193")).toBe("482193");
    expect(parsePhoneVerificationMessage("vincular 482193")).toBe("482193");
    expect(parsePhoneVerificationMessage("VINCULAR 48219")).toBeNull();
    expect(parsePhoneVerificationMessage("gastei 482193")).toBeNull();
  });
});
