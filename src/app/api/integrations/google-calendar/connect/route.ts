import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { GOOGLE_CALENDAR_SCOPES } from "@/lib/google-calendar";
import { createGoogleCalendarOAuthState, getGoogleCalendarRedirectUri } from "@/lib/google-calendar-oauth";

export const dynamic = "force-dynamic";

const stateCookieName = "whatspent-google-calendar-state";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?callbackUrl=/dashboard/agenda/integracoes", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/dashboard/agenda/integracoes?googleCalendarError=missing_configuration", request.url));
  }

  const state = createGoogleCalendarOAuthState(user.id);
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGoogleCalendarRedirectUri(request.nextUrl.origin),
    response_type: "code",
    scope: ["openid", "email", "profile", ...GOOGLE_CALENDAR_SCOPES].join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  }).toString();

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set({
    name: stateCookieName,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
