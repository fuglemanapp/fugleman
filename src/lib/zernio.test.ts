import { describe, expect, it } from "vitest";

import { normalizePhone, parseZernioInboundMessage, verifyZernioSignature } from "./zernio";

describe("Zernio WhatsApp helpers", () => {
  it("normalizes a WhatsApp phone number", () => {
    expect(normalizePhone("(11) 99999-9999")).toBe("+11999999999");
    expect(normalizePhone("invalid")).toBeNull();
  });

  it("parses only inbound message events", () => {
    expect(parseZernioInboundMessage({
      id: "event-1",
      event: "message.received",
      account: { id: "account-1" },
      message: {
        conversationId: "conversation-1",
        platformMessageId: "wamid-1",
        text: "  gastei R$ 20  ",
        sender: { phoneNumber: "+55 (11) 99999-9999" },
      },
    })).toMatchObject({
      eventId: "event-1",
      accountId: "account-1",
      conversationId: "conversation-1",
      platformMessageId: "wamid-1",
      senderPhone: "+5511999999999",
      text: "gastei R$ 20",
      hasAttachments: false,
    });
    expect(parseZernioInboundMessage({ event: "message.sent" })).toBeNull();
  });

  it("verifies the signature against the unmodified body", () => {
    const raw = '{"event":"webhook.test"}';
    const signature = "e439cfc9f4104ef3c768cecff1b32f1b9cfce56f0928906e64caaac51754cada";
    expect(verifyZernioSignature(raw, signature, "whatspent-test-secret")).toBe(true);
    expect(verifyZernioSignature(`${raw} `, signature, "whatspent-test-secret")).toBe(false);
  });
});
