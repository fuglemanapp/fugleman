import { NextResponse } from "next/server";

import { buildAccountUrl, sendAccountEmail } from "@/lib/account-email";
import { createOpaqueToken } from "@/lib/account-tokens";
import { normalizeAccountEmail } from "@/lib/credential-access";
import prisma from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getClientKey } from "@/lib/request-client";

export const runtime = "nodejs";

const resetLifetimeMs = 60 * 60 * 1_000;
function genericResponse() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = normalizeAccountEmail(payload?.email);
  const ipAttempt = await consumeRateLimit(`password-reset:ip:${getClientKey(request)}`, { limit: 10, windowMs: 60 * 60 * 1_000 });
  if (!ipAttempt.allowed) return NextResponse.json({ error: "Aguarde alguns minutos antes de tentar novamente." }, { status: 429 });
  if (!email) return genericResponse();

  const emailAttempt = await consumeRateLimit(`password-reset:email:${email}`, { limit: 3, windowMs: 60 * 60 * 1_000 });
  if (!emailAttempt.allowed) return genericResponse();

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true } });
  if (!user?.email) return genericResponse();

  const token = createOpaqueToken();
  await prisma.$transaction(async (transaction) => {
    await transaction.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
    await transaction.passwordResetToken.create({
      data: { userId: user.id, tokenHash: token.hash, expiresAt: new Date(Date.now() + resetLifetimeMs) },
    });
  });

  try {
    const resetUrl = buildAccountUrl("/redefinir-senha", token.plain);
    await sendAccountEmail({
      to: user.email,
      subject: "Redefina sua senha do WhatSpent",
      html: `<p>Olá, ${user.name || ""}.</p><p>Use este link para definir uma nova senha:</p><p><a href="${resetUrl.toString()}">Redefinir senha</a></p><p>Este link expira em uma hora.</p>`,
    });
  } catch {
    // Keep this response indistinguishable from an unknown e-mail address.
  }

  return genericResponse();
}
