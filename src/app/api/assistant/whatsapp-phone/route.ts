import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";
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
    const updated = await prisma.user.update({ where: { id: user.id }, data: { phone }, select: { phone: true } });
    return NextResponse.json({ phone: updated.phone });
  } catch {
    return NextResponse.json({ error: "Esse número já está vinculado a outra conta WhatSpent." }, { status: 409 });
  }
}
