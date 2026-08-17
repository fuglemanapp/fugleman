import { createHash } from "crypto";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";

  if (!token) {
    return NextResponse.json({ error: "Convite inválido." }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const invite = await prisma.financialInvite.findUnique({
    where: { tokenHash },
    include: { team: { select: { name: true } } },
  });

  if (!invite || invite.revokedAt || invite.acceptedAt || invite.expiresAt <= new Date()) {
    return NextResponse.json({ error: "Este convite não está mais disponível." }, { status: 410 });
  }

  return NextResponse.json({ name: invite.team.name, expiresAt: invite.expiresAt });
}
