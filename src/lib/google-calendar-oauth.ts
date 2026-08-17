import { createHmac, randomBytes, timingSafeEqual } from "crypto";

type CalendarOAuthState = {
  expiresAt: number;
  nonce: string;
  userId: string;
};

const stateLifetimeMs = 10 * 60 * 1000;

function getSigningSecret() {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("NEXTAUTH_SECRET precisa estar configurado para conectar o Google Calendar.");
  }

  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
}

export function createGoogleCalendarOAuthState(userId: string) {
  const state: CalendarOAuthState = {
    userId,
    nonce: randomBytes(24).toString("base64url"),
    expiresAt: Date.now() + stateLifetimeMs,
  };
  const payload = Buffer.from(JSON.stringify(state)).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function validateGoogleCalendarOAuthState(state: string | null, expectedState: string | undefined) {
  if (!state || !expectedState || state !== expectedState) {
    return null;
  }

  const [payload, receivedSignature, ...extraParts] = state.split(".");
  if (!payload || !receivedSignature || extraParts.length > 0) {
    return null;
  }

  const expectedSignature = sign(payload);
  const receivedBuffer = Buffer.from(receivedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (receivedBuffer.length !== expectedBuffer.length || !timingSafeEqual(receivedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as CalendarOAuthState;
    if (!parsed.userId || !parsed.nonce || !Number.isFinite(parsed.expiresAt) || parsed.expiresAt < Date.now()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getGoogleCalendarRedirectUri(origin: string) {
  return `${origin}/api/integrations/google-calendar/callback`;
}
