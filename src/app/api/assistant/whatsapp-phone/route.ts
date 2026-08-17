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

  const payload = (await request.json().catch(() => null)) as { phone?: unknown; replaceExisting?: unknown } | null;
  const phone = normalizePhone(typeof payload?.phone === "string" ? payload.phone : null);
  if (!phone) return NextResponse.json({ error: "Informe seu número pessoal com DDI, por exemplo +5511999999999." }, { status: 400 });

  const replaceExisting = payload?.replaceExisting === true;

  try {
    const existingOwner = await prisma.user.findUnique({ where: { phone }, select: { id: true } });

    if (existingOwner && existingOwner.id !== user.id && !replaceExisting) {
      return NextResponse.json({ error: "Esse número já está vinculado a outra conta WhatSpent.", canReplace: true }, { status: 409 });
    }

    const updated = await prisma.$transaction(async (transaction) => {
      if (replaceExisting) {
        await transaction.user.updateMany({ where: { phone, id: { not: user.id } }, data: { phone: null } });
      }

      return transaction.user.update({ where: { id: user.id }, data: { phone }, select: { phone: true } });
    });

    return NextResponse.json({ phone: updated.phone, replacedExisting: replaceExisting });
  } catch (error) {
    console.error("Failed to update the WhatsApp phone link", {
      userId: user.id,
      replaceExisting,
      error,
    });
    return NextResponse.json({ error: "Esse número já está vinculado a outra conta WhatSpent." }, { status: 409 });
  }
}
