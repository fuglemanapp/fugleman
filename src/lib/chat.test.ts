import { describe, expect, it } from "vitest";

import { directConversationKey, normalizeChatText, validateChatFile } from "./chat";

describe("chat helpers", () => {
  it("creates the same direct key regardless of participant order", () => {
    expect(directConversationKey("user-b", "user-a")).toBe("user-a:user-b");
  });

  it("trims text and rejects messages larger than 4,000 characters", () => {
    expect(normalizeChatText("  Oi, amor!  ")).toBe("Oi, amor!");
    expect(normalizeChatText(" ")).toBeNull();
    expect(normalizeChatText("a".repeat(4001))).toBeNull();
  });

  it("accepts supported files up to 25 MB and rejects executables", () => {
    expect(validateChatFile({ name: "recibo.pdf", size: 25 * 1024 * 1024, type: "application/pdf" })).toBeNull();
    expect(validateChatFile({ name: "instalador.exe", size: 12, type: "application/octet-stream" })).toContain("não é permitido");
    expect(validateChatFile({ name: "grande.mp4", size: 25 * 1024 * 1024 + 1, type: "video/mp4" })).toContain("25 MB");
  });
});
