import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

import { isBlobConfigured, shouldRenderAttachmentInline } from "@/lib/chat";
import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
type RouteContext = { params: Promise<{ attachmentId: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para acessar anexos." }, { status: 401 });
  if (!isBlobConfigured()) return NextResponse.json({ error: "Os anexos ainda não foram configurados." }, { status: 503 });
  const { attachmentId } = await params;
  const attachment = await prisma.chatAttachment.findFirst({
    where: { id: attachmentId, message: { conversation: { participants: { some: { userId: user.id } }, team: { members: { some: { userId: user.id } } } } } },
    select: { pathname: true, fileName: true, contentType: true },
  });
  if (!attachment) return NextResponse.json({ error: "Anexo não encontrado." }, { status: 404 });

  const file = await get(attachment.pathname, { access: "private" });
  if (!file || file.statusCode !== 200 || !file.stream) return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 404 });
  return new NextResponse(file.stream, {
    headers: {
      "Content-Type": attachment.contentType,
      "Content-Disposition": `${shouldRenderAttachmentInline(attachment.contentType) ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(attachment.fileName)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "sandbox",
    },
  });
}
