import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getGoogleCalendarRedirectUri, validateGoogleCalendarOAuthState } from "@/lib/google-calendar-oauth";

export const dynamic = "force-dynamic";

const stateCookieName = "whatspent-google-calendar-state";

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  id_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
};

type GoogleProfile = {
  sub?: string;
};

function redirectToIntegrations(request: NextRequest, params: Record<string, string>) {
  const url = new URL("/dashboard/agenda/integracoes", request.url);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = NextResponse.redirect(url);
  response.cookies.set({ name: stateCookieName, value: "", path: "/", maxAge: 0 });
  return response;
}

export async function GET(request: NextRequest) {
  const providerError = request.nextUrl.searchParams.get("error");
  if (providerError) {
    return redirectToIntegrations(request, { googleCalendarError: "authorization_denied" });
  }

  const state = validateGoogleCalendarOAuthState(
    request.nextUrl.searchParams.get("state"),
    request.cookies.get(stateCookieName)?.value,
  );
  const code = request.nextUrl.searchParams.get("code");
  if (!state || !code) {
    return redirectToIntegrations(request, { googleCalendarError: "invalid_state" });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return redirectToIntegrations(request, { googleCalendarError: "missing_configuration" });
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: getGoogleCalendarRedirectUri(request.nextUrl.origin),
    }),
  });
  const token = await tokenResponse.json().catch(() => null) as GoogleTokenResponse | null;
  if (!tokenResponse.ok || !token?.access_token) {
    return redirectToIntegrations(request, { googleCalendarError: "token_exchange_failed" });
  }

  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  const profile = await profileResponse.json().catch(() => null) as GoogleProfile | null;
  if (!profileResponse.ok || !profile?.sub) {
    return redirectToIntegrations(request, { googleCalendarError: "profile_failed" });
  }

  const existingAccount = await prisma.account.findUnique({
    where: { provider_providerAccountId: { provider: "google", providerAccountId: profile.sub } },
    select: { id: true, userId: true, refresh_token: true },
  });

  if (existingAccount && existingAccount.userId !== state.userId) {
    return redirectToIntegrations(request, { googleCalendarError: "google_account_in_use" });
  }

  const accountData = {
    type: "oauth",
    access_token: token.access_token,
    expires_at: token.expires_in ? Math.floor(Date.now() / 1000 + token.expires_in) : null,
    id_token: token.id_token ?? null,
    refresh_token: token.refresh_token ?? existingAccount?.refresh_token ?? null,
    scope: token.scope ?? null,
    token_type: token.token_type ?? "Bearer",
  };

  if (existingAccount) {
    await prisma.account.update({ where: { id: existingAccount.id }, data: accountData });
  } else {
    await prisma.account.create({
      data: {
        ...accountData,
        userId: state.userId,
        provider: "google",
        providerAccountId: profile.sub,
      },
    });
  }

  return redirectToIntegrations(request, { googleCalendar: "connected" });
}
