import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { CHAT_ALLOWED_UPLOAD_CONTENT_TYPES, CHAT_MAX_FILE_SIZE, isBlobConfigured, isExpectedChatUploadPath, requireChatParticipant, validateChatFileName } from "@/lib/chat";
import { getCurrentUser } from "@/lib/current-user";
import { consumeRateLimit } from "@/lib/rate-limit";
import { reportSecurityEvent } from "@/lib/security-events";

export const dynamic = "force-dynamic";

type UploadPayload = { conversationId?: unknown };

function parsePayload(value: string | null) {
  if (!value) return null;
  try {
    const payload = JSON.parse(value) as UploadPayload;
    return typeof payload.conversationId === "string" ? payload.conversationId : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!isBlobConfigured()) return NextResponse.json({ error: "Os anexos ainda não foram configurados." }, { status: 503 });
  const body = await request.json().catch(() => null) as HandleUploadBody | null;
  if (!body) return NextResponse.json({ error: "Solicitação de upload inválida." }, { status: 400 });

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const user = await getCurrentUser();
        if (!user) throw new Error("Faça login para anexar arquivos.");
        const conversationId = parsePayload(clientPayload);
        const prefix = conversationId ? `chat/${conversationId}/` : "";
        if (!conversationId || !isExpectedChatUploadPath(pathname, prefix)) throw new Error("Destino do anexo inválido.");
        if (!await requireChatParticipant(user.id, conversationId)) throw new Error("Você não pode anexar arquivos nesta conversa.");

        const limit = await consumeRateLimit(`chat-upload:${user.id}`, { limit: 10, windowMs: 60 * 1_000 });
        if (!limit.allowed) {
          reportSecurityEvent("rate_limit_reached", { route: "/api/chat/uploads", scope: "chat_upload" });
          throw new Error("Muitos uploads em pouco tempo. Aguarde um minuto e tente novamente.");
        }

        const fileName = pathname.split("/").pop() || "";
        const validationError = validateChatFileName(fileName);
        if (validationError) throw new Error(validationError);

        return {
          allowedContentTypes: CHAT_ALLOWED_UPLOAD_CONTENT_TYPES,
          maximumSizeInBytes: CHAT_MAX_FILE_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ conversationId, userId: user.id }),
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível preparar o anexo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
