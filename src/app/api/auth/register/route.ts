import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { consumeRateLimit } from "@/lib/rate-limit";
import { validateRegistrationInput } from "@/lib/registration";
import { reportSecurityEvent } from "@/lib/security-events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function requesterAddress(request: Request) {
  return request.headers.get("x-vercel-forwarded-for")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

function tooManyRequests(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Muitas tentativas de cadastro. Tente novamente mais tarde." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origem da solicitação não autorizada." }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const validation = validateRegistrationInput(payload);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const [emailLimit, addressLimit] = await Promise.all([
    consumeRateLimit(`signup:email:${validation.data.email}`, { limit: 3, windowMs: 60 * 60 * 1_000 }),
    consumeRateLimit(`signup:address:${requesterAddress(request)}`, { limit: 12, windowMs: 60 * 60 * 1_000 }),
  ]);

  if (!emailLimit.allowed || !addressLimit.allowed) {
    reportSecurityEvent("rate_limit_reached", { route: "/api/auth/register", scope: "signup" });
    return tooManyRequests(Math.max(emailLimit.retryAfterSeconds, addressLimit.retryAfterSeconds));
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: validation.data.email },
    select: { id: true },
  });
  if (existingUser) {
    return NextResponse.json({ error: "Já existe uma conta com este e-mail. Entre para continuar." }, { status: 409 });
  }

  try {
    await prisma.user.create({
      data: {
        name: validation.data.name,
        email: validation.data.email,
        passwordHash: await hashPassword(validation.data.password),
      },
      select: { id: true },
    });
  } catch (error) {
    const prismaCode = typeof error === "object" && error && "code" in error ? (error as { code?: unknown }).code : null;
    if (prismaCode === "P2002") {
      return NextResponse.json({ error: "Já existe uma conta com este e-mail. Entre para continuar." }, { status: 409 });
    }

    console.error("Public registration failed", error);
    return NextResponse.json({ error: "Não foi possível criar sua conta agora. Tente novamente." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
