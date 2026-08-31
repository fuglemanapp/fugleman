import { describe, expect, it } from "vitest";

import { validateRegistrationInput } from "./account-input";

describe("validateRegistrationInput", () => {
  it("normalizes a valid name and e-mail", () => {
    expect(validateRegistrationInput({
      name: " Ana ",
      email: " ANA@EXAMPLE.COM ",
      password: "senha-segura12",
    })).toEqual({
      ok: true,
      value: { name: "Ana", email: "ana@example.com", password: "senha-segura12" },
    });
  });

  it("rejects passwords shorter than twelve characters", () => {
    expect(validateRegistrationInput({
      name: "Ana",
      email: "ana@example.com",
      password: "curta",
    })).toEqual({ ok: false, error: "Use uma senha com pelo menos 12 caracteres." });
  });

  it("rejects an invalid e-mail without echoing it", () => {
    expect(validateRegistrationInput({
      name: "Ana",
      email: "nao-e-um-email",
      password: "senha-segura12",
    })).toEqual({ ok: false, error: "Informe um e-mail válido." });
  });
});
