import { NextResponse } from "next/server";

import { buildAccountUrl, sendAccountEmail } from "@/lib/account-email";
import { validateRegistrationInput } from "@/lib/account-input";
import { createOpaqueToken } from "@/lib/account-tokens";
import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getClientKey } from "@/lib/request-client";

export const runtime = "nodejs";

const verificationLifetimeMs = 24 * 60 * 60 * 1_000;

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const input = validateRegistrationInput({
    name: typeof payload?.name === "string" ? payload.name : undefined,
    email: typeof payload?.email === "string" ? payload.email : undefined,
    password: typeof payload?.password === "string" ? payload.password : undefined,
  });

  if (!input.ok) {
    return NextResponse.json({ error: input.error }, { status: 400 });
  }

  const [ipAttempt, emailAttempt] = await Promise.all([
    consumeRateLimit(`registration:ip:${getClientKey(request)}`, { limit: 10, windowMs: 60 * 60 * 1_000 }),
    consumeRateLimit(`registration:email:${input.value.email}`, { limit: 3, windowMs: 60 * 60 * 1_000 }),
  ]);
  if (!ipAttempt.allowed || !emailAttempt.allowed) {
    return NextResponse.json({ error: "Aguarde alguns minutos antes de tentar novamente." }, { status: 429 });
  }

  const existing = await prisma.user.findUnique({ where: { email: input.value.email }, select: { id: true } });
  if (existing) {
    return NextResponse.json({ error: "Já existe uma conta com este e-mail. Entre ou recupere sua senha." }, { status: 409 });
  }

  const verification = createOpaqueToken();
  const passwordHash = await hashPassword(input.value.password);

  try {
    const user = await prisma.$transaction(async (transaction) => {
      const created = await transaction.user.create({
        data: { name: input.value.name, email: input.value.email, passwordHash, emailVerified: null },
        select: { id: true, name: true, email: true },
      });
      await transaction.emailVerificationToken.deleteMany({ where: { userId: created.id, usedAt: null } });
      await transaction.emailVerificationToken.create({
        data: { userId: created.id, tokenHash: verification.hash, expiresAt: new Date(Date.now() + verificationLifetimeMs) },
      });
      return created;
    });

    const verifyUrl = buildAccountUrl("/verificar-email", verification.plain);
    await sendAccountEmail({
      to: user.email || input.value.email,
      subject: "Confirme seu e-mail no WhatSpent",
      html: `<p>Olá, ${user.name || ""}.</p><p>Confirme seu e-mail para ativar sua conta:</p><p><a href="${verifyUrl.toString()}">Confirmar e-mail</a></p><p>Este link expira em 24 horas.</p>`,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "E-mail transacional não está configurado.") {
      return NextResponse.json({ error: "O cadastro ainda não está disponível. Tente novamente mais tarde." }, { status: 503 });
    }
    return NextResponse.json({ error: "Não foi possível criar sua conta. Tente novamente." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Confira seu e-mail para ativar a conta." }, { status: 201 });
}
