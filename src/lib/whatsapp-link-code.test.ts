import { describe, expect, it } from "vitest";

import { buildWhatsappLinkUrl, extractWhatsappLinkCode, generateLinkCode, whatsappLinkMessage } from "./whatsapp-link-code";

describe("WhatsApp link code", () => {
  it("extracts the code from the pre-filled CONECTAR message", () => {
    expect(extractWhatsappLinkCode(whatsappLinkMessage("K7F2QP"))).toBe("K7F2QP");
    expect(extractWhatsappLinkCode("CONECTAR K7F2QP")).toBe("K7F2QP");
  });

  it("extracts a bare code the user copied and pasted alone", () => {
    expect(extractWhatsappLinkCode("K7F2QP")).toBe("K7F2QP");
    expect(extractWhatsappLinkCode("  k7f2qp  ")).toBe("K7F2QP");
  });

  it("is case-insensitive and tolerates punctuation after the trigger", () => {
    expect(extractWhatsappLinkCode("conectar: k7f2qp")).toBe("K7F2QP");
    expect(extractWhatsappLinkCode("oi, conectar k7f2qp por favor")).toBe("K7F2QP");
  });

  it("returns null when there is no code", () => {
    expect(extractWhatsappLinkCode("Olá, acabei de criar minha conta.")).toBeNull();
    expect(extractWhatsappLinkCode("")).toBeNull();
    expect(extractWhatsappLinkCode(null)).toBeNull();
  });

  it("does not match tokens of the wrong length", () => {
    expect(extractWhatsappLinkCode("K7F2Q")).toBeNull();
    expect(extractWhatsappLinkCode("K7F2QPX")).toBeNull();
  });

  it("generates codes from the non-ambiguous alphabet that round-trip through extraction", () => {
    for (let i = 0; i < 200; i += 1) {
      const code = generateLinkCode();
      expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
      expect(extractWhatsappLinkCode(whatsappLinkMessage(code))).toBe(code);
    }
  });

  it("builds a wa.me url with the encoded CONECTAR message", () => {
    const url = buildWhatsappLinkUrl("K7F2QP");
    expect(url.startsWith("https://wa.me/13218448741?text=")).toBe(true);
    expect(decodeURIComponent(url.split("text=")[1])).toBe("CONECTAR K7F2QP");
  });
});
