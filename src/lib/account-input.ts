export type RegistrationInput = {
  name: string;
  email: string;
  password: string;
};

export type RegistrationInputResult =
  | { ok: true; value: RegistrationInput }
  | { ok: false; error: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistrationInput(input: Partial<RegistrationInput>): RegistrationInputResult {
  const name = input.name?.trim() || "";
  const email = input.email?.trim().toLowerCase() || "";
  const password = input.password || "";

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: "Informe seu nome completo." };
  }

  if (!emailPattern.test(email) || email.length > 254) {
    return { ok: false, error: "Informe um e-mail válido." };
  }

  if (password.length < 12) {
    return { ok: false, error: "Use uma senha com pelo menos 12 caracteres." };
  }

  return { ok: true, value: { name, email, password } };
}
