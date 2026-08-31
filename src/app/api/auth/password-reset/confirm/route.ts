import { NextResponse } from "next/server";

import { hashOpaqueToken } from "@/lib/account-tokens";
import { hasSecurePassword } from "@/lib/credential-access";
import { hashPassword } from "@/lib/password";
import { servicePrisma } from "@/lib/prisma-service";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getClientKey } from "@/lib/request-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { token?: unknown; password?: unknown } | null;
  const token = typeof payload?.token === "string" ? payload.token : "";
  const password = typeof payload?.password === "string" ? payload.password : "";
  if (!token || !hasSecurePassword(password)) {
    return NextResponse.json({ error: "Informe uma nova senha com pelo menos 12 caracteres." }, { status: 400 });
  }

  const attempt = await consumeRateLimit(`password-reset-confirm:ip:${getClientKey(request)}`, { limit: 10, windowMs: 60 * 60 * 1_000 });
  if (!attempt.allowed) return NextResponse.json({ error: "Aguarde alguns minutos antes de tentar novamente." }, { status: 429 });

  const passwordHash = await hashPassword(password);
  const reset = await servicePrisma.$transaction(async (transaction) => {
    const record = await transaction.passwordResetToken.findUnique({
      where: { tokenHash: hashOpaqueToken(token) },
      select: { id: true, userId: true, expiresAt: true, usedAt: true },
    });
    if (!record || record.usedAt || record.expiresAt <= new Date()) return false;

    const consumed = await transaction.passwordResetToken.updateMany({
      where: { id: record.id, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });
    if (consumed.count !== 1) return false;

    await transaction.user.update({ where: { id: record.userId }, data: { passwordHash } });
    await transaction.session.deleteMany({ where: { userId: record.userId } });
    return true;
  });

  if (!reset) return NextResponse.json({ error: "Este link expirou ou já foi usado." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
