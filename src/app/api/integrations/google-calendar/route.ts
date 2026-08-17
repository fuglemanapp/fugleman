import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { getGoogleCalendarStatus, synchronizeGoogleCalendar } from "@/lib/google-calendar";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para gerenciar a integração do Google Calendar." }, { status: 401 });
  }

  return NextResponse.json(await getGoogleCalendarStatus(user.id));
}

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para sincronizar sua agenda." }, { status: 401 });
  }

  const result = await synchronizeGoogleCalendar(user.id);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
