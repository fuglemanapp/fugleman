import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { startPhoneVerification } from "@/lib/phone-verification";
import prisma from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/rate-limit";
import { normalizePhone } from "@/lib/zernio";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para ver sua configuração." }, { status: 401 });
  return NextResponse.json({ phone: user.phone || null });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para configurar seu WhatsApp." }, { status: 401 });

  const payload = (await request.json().catch(() => null)) as { phone?: unknown } | null;
  const phone = normalizePhone(typeof payload?.phone === "string" ? payload.phone : null);
  if (!phone) return NextResponse.json({ error: "Informe seu número pessoal com DDI, por exemplo +5511999999999." }, { status: 400 });

  try {
    const attempt = await consumeRateLimit(`whatsapp-phone:user:${user.id}`, { limit: 5, windowMs: 60 * 60 * 1_000 });
    if (!attempt.allowed) {
      return NextResponse.json(
        { error: "Aguarde alguns minutos antes de gerar outro código." },
        { status: 429, headers: { "Retry-After": String(attempt.retryAfterSeconds) } },
      );
    }

    const existingOwner = await prisma.user.findUnique({ where: { phone }, select: { id: true } });
    if (existingOwner && existingOwner.id !== user.id) {
      return NextResponse.json({ error: "Esse número já está vinculado a outra conta WhatSpent." }, { status: 409 });
    }

    if (existingOwner?.id === user.id) return NextResponse.json({ phone, verified: true });

    const verification = await startPhoneVerification(user.id, phone);
    if (!verification) return NextResponse.json({ error: "Já existe uma confirmação pendente para este número." }, { status: 409 });

    return NextResponse.json({ phone, code: verification.code, expiresAt: verification.expiresAt.toISOString() }, { status: 202 });
  } catch (error) {
    console.error("Failed to update the WhatsApp phone link", {
      userId: user.id,
      error,
    });
    return NextResponse.json({ error: "Não foi possível iniciar a confirmação do seu WhatsApp." }, { status: 500 });
  }
}
