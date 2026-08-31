export function canAuthenticateWithPassword(input: { passwordHash: string | null; emailVerified: Date | null }) {
  return Boolean(input.passwordHash && input.emailVerified);
}

export function normalizeAccountEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254 ? email : null;
}

export function hasSecurePassword(value: unknown) {
  return typeof value === "string" && value.length >= 12;
}
