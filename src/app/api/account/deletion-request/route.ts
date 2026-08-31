import { NextResponse } from "next/server";

import { sendAccountEmail } from "@/lib/account-email";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para solicitar a exclusão da conta." }, { status: 401 });

  const attempt = await consumeRateLimit(`account-deletion:user:${user.id}`, { limit: 3, windowMs: 24 * 60 * 60 * 1_000 });
  if (!attempt.allowed) {
    return NextResponse.json(
      { error: "Aguarde alguns minutos antes de enviar outra solicitação." },
      { status: 429, headers: { "Retry-After": String(attempt.retryAfterSeconds) } },
    );
  }

  await prisma.accountDeletionRequest.upsert({
    where: { userId: user.id },
    create: { userId: user.id, status: "PENDING" },
    update: { status: "PENDING", requestedAt: new Date(), confirmedAt: null, completedAt: null },
  });

  if (user.email) {
    try {
      await sendAccountEmail({
        to: user.email,
        subject: "Recebemos sua solicitação de exclusão — WhatSpent",
        html: "<p>Recebemos sua solicitação de exclusão de conta.</p><p>Para proteger seus dados, a solicitação será verificada pelo suporte antes da conclusão. Não exclua dados por conta própria enquanto o atendimento estiver em andamento.</p>",
      });
    } catch {
      console.error("Failed to acknowledge account deletion request");
      return NextResponse.json({ error: "Recebemos sua solicitação, mas não foi possível enviar a confirmação por e-mail agora." }, { status: 503 });
    }
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}
