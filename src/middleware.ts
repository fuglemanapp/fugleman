import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

function isCrossSiteMutation(request: NextRequest) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return false;
  if (request.nextUrl.pathname.startsWith("/api/auth/") || request.nextUrl.pathname.startsWith("/api/webhook/")) {
    return false;
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return true;

  return request.headers.get("sec-fetch-site") === "cross-site";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      ...(authSecret ? { secret: authSecret } : {}),
    });

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/api/") && isCrossSiteMutation(request)) {
    return NextResponse.json({ error: "Origem da solicitação não autorizada." }, { status: 403 });
  }

  const response = NextResponse.next();
  if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Content-Type-Options", "nosniff");
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
