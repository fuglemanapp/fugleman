export type RegistrationInput = {
  name: string;
  email: string;
  password: string;
};

export type RegistrationValidation =
  | { valid: true; data: RegistrationInput }
  | { valid: false; error: string };

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateRegistrationInput(input: unknown): RegistrationValidation {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, error: "Dados de cadastro inválidos." };
  }

  const record = input as Record<string, unknown>;
  const name = asTrimmedString(record.name).replace(/\s+/g, " ");
  const email = asTrimmedString(record.email).toLowerCase();
  const password = typeof record.password === "string" ? record.password : "";

  if (name.length < 2 || name.length > 80) {
    return { valid: false, error: "Informe seu nome com 2 a 80 caracteres." };
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: "Informe um e-mail válido." };
  }

  if (password.length < 10 || password.length > 128) {
    return { valid: false, error: "Use uma senha de 10 a 128 caracteres." };
  }

  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    return { valid: false, error: "Use uma senha com letras e números." };
  }

  return { valid: true, data: { name, email, password } };
}
