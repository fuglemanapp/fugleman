import { describe, expect, it } from "vitest";

import { publicWhatsAppOnboardingReply } from "./whatsapp-onboarding";

describe("publicWhatsAppOnboardingReply", () => {
  it("guides an unlinked WhatsApp sender to the free public signup", () => {
    expect(publicWhatsAppOnboardingReply()).toContain("https://whatspent.com");
    expect(publicWhatsAppOnboardingReply()).toContain("gratuita");
  });
});
