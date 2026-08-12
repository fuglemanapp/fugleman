import { NextResponse } from "next/server";

import { listFamilyCalendarSharing, setFamilyCalendarConsent } from "@/lib/family-calendar-sharing";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para acessar o compartilhamento da agenda." }, { status: 401 });
  return NextResponse.json({ families: await listFamilyCalendarSharing(user.id) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para alterar o compartilhamento da agenda." }, { status: 401 });
  let body: { teamId?: unknown; enabled?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados de compartilhamento inválidos." }, { status: 400 });
  }
  if (typeof body.teamId !== "string" || !body.teamId || typeof body.enabled !== "boolean") {
    return NextResponse.json({ error: "Dados de compartilhamento inválidos." }, { status: 400 });
  }
  const result = await setFamilyCalendarConsent(user.id, body.teamId, body.enabled);
  if ("error" in result) return NextResponse.json(result, { status: 400 });
  return NextResponse.json({ result, families: await listFamilyCalendarSharing(user.id) });
}
