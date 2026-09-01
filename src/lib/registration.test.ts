import { describe, expect, it } from "vitest";

import { validateRegistrationInput } from "./registration";

describe("validateRegistrationInput", () => {
  it("normalizes a valid public registration", () => {
    expect(validateRegistrationInput({
      name: "  Ana   Silva ",
      email: " ANA@EXAMPLE.COM ",
      password: "senhaSegura2026",
    })).toEqual({
      valid: true,
      data: { name: "Ana Silva", email: "ana@example.com", password: "senhaSegura2026" },
    });
  });

  it("requires a password with enough length, letters, and numbers", () => {
    expect(validateRegistrationInput({ name: "Ana", email: "ana@example.com", password: "1234567890" })).toEqual({
      valid: false,
      error: "Use uma senha com letras e números.",
    });
    expect(validateRegistrationInput({ name: "Ana", email: "ana@example.com", password: "curta1" })).toEqual({
      valid: false,
      error: "Use uma senha de 10 a 128 caracteres.",
    });
  });
});
