import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySignature: vi.fn(),
  parseInbound: vi.fn(),
  sendInboxMessage: vi.fn(),
  completePhoneVerification: vi.fn(),
  runPersonalAgent: vi.fn(),
  eventFindUnique: vi.fn(),
  eventCreate: vi.fn(),
  eventUpdate: vi.fn(),
}));

vi.mock("@/lib/zernio", () => ({
  verifyZernioSignature: mocks.verifySignature,
  parseZernioInboundMessage: mocks.parseInbound,
  sendZernioInboxMessage: mocks.sendInboxMessage,
  normalizePhone: (value: string) => value,
}));
vi.mock("@/lib/phone-verification", () => ({
  completePhoneVerification: mocks.completePhoneVerification,
  parsePhoneVerificationMessage: (text: string) => /^VINCULAR\s+(\d{6})$/i.exec(text)?.[1] || null,
}));
vi.mock("@/lib/assistant-conversation", () => ({ ensureAssistantConversation: vi.fn() }));
vi.mock("@/lib/personal-agent", () => ({ runPersonalAgent: mocks.runPersonalAgent }));
vi.mock("@/lib/personal-agent-effects", () => ({ persistAgentAction: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  default: {
    zernioWebhookEvent: { findUnique: mocks.eventFindUnique, create: mocks.eventCreate, update: mocks.eventUpdate },
    user: { findMany: vi.fn() },
    assistantMessage: { create: vi.fn() },
    assistantConversation: { update: vi.fn() },
  },
}));

import { POST } from "./route";

describe("WhatsApp webhook phone ownership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ZERNIO_API_KEY = "test-key";
    process.env.ZERNIO_WEBHOOK_SECRET = "test-secret";
    process.env.ZERNIO_WHATSAPP_ACCOUNT_ID = "account-a";
    mocks.verifySignature.mockReturnValue(true);
    mocks.parseInbound.mockReturnValue({
      eventId: "event-a",
      accountId: "account-a",
      conversationId: "conversation-a",
      platformMessageId: "message-a",
      senderPhone: "+5511999999999",
      text: "VINCULAR 482193",
      hasAttachments: false,
    });
    mocks.eventFindUnique.mockResolvedValue(null);
    mocks.eventCreate.mockResolvedValue({ id: "event-a", responseText: null, deliveredAt: null });
    mocks.eventUpdate.mockResolvedValue({ id: "event-a", responseText: "WhatsApp confirmado.", deliveredAt: null });
    mocks.completePhoneVerification.mockResolvedValue({ userId: "user-a", phone: "+5511999999999" });
    mocks.sendInboxMessage.mockResolvedValue(undefined);
  });

  it("confirms the owner before using the message as an agent command", async () => {
    const response = await POST(new Request("http://localhost/api/webhook/whatsapp", {
      method: "POST",
      headers: { "x-zernio-signature": "valid" },
      body: JSON.stringify({ event: "message.received" }),
    }));

    expect(response.status).toBe(200);
    expect(mocks.completePhoneVerification).toHaveBeenCalledWith("+5511999999999", "482193");
    expect(mocks.runPersonalAgent).not.toHaveBeenCalled();
    expect(mocks.eventUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "event-a" },
      data: expect.objectContaining({ userId: "user-a", responseText: "WhatsApp confirmado. Agora este número fala apenas com o seu agente pessoal." }),
    }));
  });
});
