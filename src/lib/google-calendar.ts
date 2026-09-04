import prisma from "@/lib/prisma";

export const GOOGLE_CALENDAR_EVENT_SCOPE = "https://www.googleapis.com/auth/calendar.events";
// Google uses the plural `acls` scope for access-control rules. The singular
// `calendar.acl` URL is rejected during OAuth with `invalid_scope`.
export const GOOGLE_CALENDAR_ACL_SCOPE = "https://www.googleapis.com/auth/calendar.acls";
export const GOOGLE_CALENDAR_SCOPE = GOOGLE_CALENDAR_EVENT_SCOPE;
export const GOOGLE_CALENDAR_SCOPES = [GOOGLE_CALENDAR_EVENT_SCOPE, GOOGLE_CALENDAR_ACL_SCOPE];

type CalendarEventInput = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
};

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
};

type GoogleCalendarEvent = {
  id?: string;
  status?: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
};

type GoogleCalendarAclRule = {
  id?: string;
  scope?: { type?: string; value?: string };
};

function hasCalendarScope(scope: string | null) {
  const scopes = scope?.split(" ") || [];
  return scopes.includes(GOOGLE_CALENDAR_EVENT_SCOPE) || scopes.includes("https://www.googleapis.com/auth/calendar");
}

function hasCalendarSharingScope(scope: string | null) {
  const scopes = scope?.split(" ") || [];
  return scopes.includes(GOOGLE_CALENDAR_ACL_SCOPE) || scopes.includes("https://www.googleapis.com/auth/calendar");
}

async function getGoogleAccount(userId: string) {
  return prisma.account.findFirst({
    where: { userId, provider: "google" },
    orderBy: { id: "desc" },
  });
}

async function getAccessToken(userId: string, requirement: "events" | "sharing" = "events") {
  const account = await getGoogleAccount(userId);
  const hasRequiredScope = requirement === "sharing" ? hasCalendarSharingScope(account?.scope || null) : hasCalendarScope(account?.scope || null);
  if (!account || !hasRequiredScope) {
    return { error: requirement === "sharing" ? "Reconecte o Google Calendar e autorize o compartilhamento da agenda." : "Google Calendar não está conectado nesta conta." } as const;
  }

  const isCurrent = account.access_token && (!account.expires_at || account.expires_at * 1000 > Date.now() + 30_000);
  if (account.access_token && isCurrent) return { accessToken: account.access_token } as const;
  if (!account.refresh_token || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return { error: "A conexão com o Google Calendar expirou. Conecte novamente." } as const;
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
    }),
  });
  const body = await response.json() as GoogleTokenResponse;
  if (!response.ok || !body.access_token) {
    console.error("Google Calendar token refresh failed", {
      userId,
      status: response.status,
      error: body.error ?? null,
      errorDescription: (body as { error_description?: string }).error_description ?? null,
    });
    return { error: "Não foi possível renovar a conexão com o Google Calendar. Reconecte o Google Calendar no painel para voltar a sincronizar." } as const;
  }

  await prisma.account.update({
    where: { id: account.id },
    data: {
      access_token: body.access_token,
      expires_at: body.expires_in ? Math.floor(Date.now() / 1000 + body.expires_in) : null,
      scope: body.scope || account.scope,
    },
  });
  return { accessToken: body.access_token } as const;
}

async function googleRequest(path: string, accessToken: string, init?: RequestInit) {
  return fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", ...init?.headers },
  });
}

export async function getGoogleCalendarStatus(userId: string) {
  const account = await getGoogleAccount(userId);
  return {
    connected: Boolean(account && hasCalendarScope(account.scope)),
    sharingConnected: Boolean(account && hasCalendarSharingScope(account.scope)),
    // A conta Google pode ser diferente do e-mail usado para entrar no WhatSpent.
    // Não exibimos o e-mail do perfil WhatSpent como se ele fosse o e-mail do Google.
    email: null,
  };
}

export async function createGoogleCalendarEvent(userId: string, event: CalendarEventInput) {
  const token = await getAccessToken(userId);
  if ("error" in token) return { synced: false, error: token.error } as const;
  const response = await googleRequest("/calendars/primary/events", token.accessToken, {
    method: "POST",
    body: JSON.stringify({ summary: event.title, description: event.description || undefined, start: { dateTime: event.startTime.toISOString() }, end: { dateTime: event.endTime.toISOString() } }),
  });
  const body = await response.json().catch(() => null) as GoogleCalendarEvent | null;
  if (!response.ok || !body?.id) return { synced: false, error: "O compromisso foi salvo aqui, mas não pôde ser enviado ao Google Calendar." } as const;
  await prisma.event.update({ where: { id: event.id }, data: { googleEventId: body.id, googleSyncedAt: new Date() } });
  return { synced: true } as const;
}

export async function deleteGoogleCalendarEvent(userId: string, googleEventId: string) {
  const token = await getAccessToken(userId);
  if ("error" in token) return { synced: false, error: token.error } as const;
  const response = await googleRequest(`/calendars/primary/events/${encodeURIComponent(googleEventId)}`, token.accessToken, { method: "DELETE" });
  if (!response.ok && response.status !== 404) return { synced: false, error: "O compromisso foi excluído aqui, mas não pôde ser removido do Google Calendar." } as const;
  return { synced: true } as const;
}

export async function updateGoogleCalendarEvent(userId: string, event: CalendarEventInput & { googleEventId: string | null }) {
  if (!event.googleEventId) return { synced: true } as const;
  const token = await getAccessToken(userId);
  if ("error" in token) return { synced: false, error: token.error } as const;
  const response = await googleRequest(`/calendars/primary/events/${encodeURIComponent(event.googleEventId)}`, token.accessToken, {
    method: "PATCH",
    body: JSON.stringify({ summary: event.title, description: event.description || undefined, start: { dateTime: event.startTime.toISOString() }, end: { dateTime: event.endTime.toISOString() } }),
  });
  if (!response.ok) return { synced: false, error: "O compromisso foi atualizado aqui, mas não pôde ser alterado no Google Calendar." } as const;
  await prisma.event.update({ where: { id: event.id }, data: { googleSyncedAt: new Date() } });
  return { synced: true } as const;
}

export async function addGoogleCalendarReader(userId: string, readerEmail: string, knownRuleId?: string | null) {
  const token = await getAccessToken(userId, "sharing");
  if ("error" in token) return { error: token.error } as const;
  const normalizedEmail = readerEmail.trim().toLowerCase();
  if (!normalizedEmail) return { error: "O parceiro precisa ter um e-mail cadastrado para compartilhar a agenda." } as const;

  if (knownRuleId) {
    const update = await googleRequest(`/calendars/primary/acl/${encodeURIComponent(knownRuleId)}`, token.accessToken, {
      method: "PATCH",
      body: JSON.stringify({ role: "reader" }),
    });
    const rule = await update.json().catch(() => null) as GoogleCalendarAclRule | null;
    if (update.ok && rule?.id) return { ruleId: rule.id } as const;
  }

  const existingResponse = await googleRequest("/calendars/primary/acl", token.accessToken);
  const existingBody = await existingResponse.json().catch(() => null) as { items?: GoogleCalendarAclRule[] } | null;
  const existingRule = existingBody?.items?.find((rule) => rule.scope?.type === "user" && rule.scope.value?.toLowerCase() === normalizedEmail);
  if (existingResponse.ok && existingRule?.id) {
    const update = await googleRequest(`/calendars/primary/acl/${encodeURIComponent(existingRule.id)}`, token.accessToken, { method: "PATCH", body: JSON.stringify({ role: "reader" }) });
    if (update.ok) return { ruleId: existingRule.id } as const;
  }

  const created = await googleRequest("/calendars/primary/acl", token.accessToken, {
    method: "POST",
    body: JSON.stringify({ scope: { type: "user", value: normalizedEmail }, role: "reader" }),
  });
  const rule = await created.json().catch(() => null) as GoogleCalendarAclRule | null;
  if (!created.ok || !rule?.id) return { error: "Não foi possível conceder ao parceiro a visualização do seu Google Calendar." } as const;
  return { ruleId: rule.id } as const;
}

export async function removeGoogleCalendarReader(userId: string, ruleId: string) {
  const token = await getAccessToken(userId, "sharing");
  if ("error" in token) return { error: token.error } as const;
  const response = await googleRequest(`/calendars/primary/acl/${encodeURIComponent(ruleId)}`, token.accessToken, { method: "DELETE" });
  if (!response.ok && response.status !== 404) return { error: "Não foi possível remover o acesso do parceiro ao Google Calendar." } as const;
  return { removed: true } as const;
}

export async function synchronizeGoogleCalendar(userId: string) {
  const token = await getAccessToken(userId);
  if ("error" in token) return { error: token.error } as const;
  const now = new Date();
  const until = new Date(now);
  until.setFullYear(until.getFullYear() + 1);
  const remoteResponse = await googleRequest(`/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(now.toISOString())}&timeMax=${encodeURIComponent(until.toISOString())}`, token.accessToken);
  const remoteBody = await remoteResponse.json().catch(() => null) as { items?: GoogleCalendarEvent[] } | null;
  if (!remoteResponse.ok) return { error: "Não foi possível ler os eventos do Google Calendar." } as const;

  let imported = 0;
  let skipped = 0;
  for (const remote of remoteBody?.items || []) {
    const startTime = remote.start?.dateTime ? new Date(remote.start.dateTime) : null;
    const endTime = remote.end?.dateTime ? new Date(remote.end.dateTime) : null;
    if (!remote.id || remote.status === "cancelled" || !startTime || !endTime || Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) { skipped += 1; continue; }
    const exists = await prisma.event.findUnique({ where: { googleEventId: remote.id }, select: { id: true } });
    if (exists) continue;
    await prisma.event.create({ data: { title: remote.summary?.trim() || "Compromisso sem título", description: remote.description?.slice(0, 1000) || null, startTime, endTime, userId, googleEventId: remote.id, googleSyncedAt: new Date() } });
    imported += 1;
  }

  const localEvents = await prisma.event.findMany({ where: { userId, googleEventId: null, startTime: { gte: now, lt: until } } });
  let exported = 0;
  for (const event of localEvents) {
    const result = await createGoogleCalendarEvent(userId, event);
    if (result.synced) exported += 1;
  }
  return { imported, exported, skipped } as const;
}
