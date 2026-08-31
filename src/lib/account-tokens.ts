import { createHash, randomBytes } from "node:crypto";

export function hashOpaqueToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createOpaqueToken() {
  const plain = randomBytes(32).toString("base64url");
  return { plain, hash: hashOpaqueToken(plain) };
}
