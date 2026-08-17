import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { ensureAssistantConversation } from "@/lib/assistant-conversation";
import { CHAT_MAX_FILE_SIZE, isBlobConfigured, validateChatFile } from "@/lib/chat";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

type UploadPayload = { conversationId?: unknown };

function parsePayload(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const payload = JSON.parse(value) as UploadPayload;
    return typeof payload.conversationId === "string" ? payload.conversationId : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!isBlobConfigured()) {
    return NextResponse.json({ error: "Os anexos ainda não foram configurados." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) {
    return NextResponse.json({ error: "Solicitação de upload inválida." }, { status: 400 });
  }

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const user = await getCurrentUser();
        if (!user) {
          throw new Error("Faça login para anexar arquivos.");
        }

        const conversation = await ensureAssistantConversation(user.id);
        const conversationId = parsePayload(clientPayload);
        if (conversationId !== conversation.id || !pathname.startsWith(`assistant/${conversation.id}/`)) {
          throw new Error("Destino do anexo inválido.");
        }

        const fileName = pathname.split("/").pop() || "";
        const validationError = validateChatFile({ name: fileName, size: 1, type: "application/octet-stream" });
        if (validationError && validationError !== "Esse tipo de arquivo ainda não é aceito no chat.") {
          throw new Error(validationError);
        }

        return {
          allowedContentTypes: [
            "image/*", "audio/*", "video/*", "application/pdf", "application/json", "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword", "text/csv", "text/plain", "application/x-ofx", "application/ofx",
          ],
          maximumSizeInBytes: CHAT_MAX_FILE_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ conversationId: conversation.id, userId: user.id }),
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
