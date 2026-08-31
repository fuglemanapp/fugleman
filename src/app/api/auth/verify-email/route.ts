import { NextResponse } from "next/server";

import { hashOpaqueToken } from "@/lib/account-tokens";
import { servicePrisma } from "@/lib/prisma-service";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getClientKey } from "@/lib/request-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { token?: unknown } | null;
  const token = typeof payload?.token === "string" ? payload.token : "";
  if (!token) return NextResponse.json({ error: "Link de confirmação inválido." }, { status: 400 });

  const attempt = await consumeRateLimit(`email-verification:ip:${getClientKey(request)}`, { limit: 20, windowMs: 60 * 60 * 1_000 });
  if (!attempt.allowed) return NextResponse.json({ error: "Aguarde alguns minutos antes de tentar novamente." }, { status: 429 });

  const verified = await servicePrisma.$transaction(async (transaction) => {
    const record = await transaction.emailVerificationToken.findUnique({
      where: { tokenHash: hashOpaqueToken(token) },
      select: { id: true, userId: true, expiresAt: true, usedAt: true },
    });
    if (!record || record.usedAt || record.expiresAt <= new Date()) return false;

    const consumed = await transaction.emailVerificationToken.updateMany({
      where: { id: record.id, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });
    if (consumed.count !== 1) return false;

    await transaction.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } });
    return true;
  });

  if (!verified) return NextResponse.json({ error: "Este link expirou ou já foi usado." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
