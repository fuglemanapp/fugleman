import prisma from "./prisma";

export const CHAT_MAX_FILE_SIZE = 25 * 1024 * 1024;
export const CHAT_MAX_TEXT_LENGTH = 4_000;

const blockedExtensions = new Set(["apk", "bat", "cmd", "com", "dmg", "exe", "msi", "sh"]);
const supportedContentTypes = new Set([
  "application/pdf",
  "application/json",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/csv",
  "text/plain",
  "application/x-ofx",
  "application/ofx",
]);

type ChatFile = { name: string; size: number; type: string };

export function directConversationKey(firstUserId: string, secondUserId: string) {
  return [firstUserId, secondUserId].sort((first, second) => first.localeCompare(second)).join(":");
}

export function normalizeChatText(value: unknown) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text && text.length <= CHAT_MAX_TEXT_LENGTH ? text : null;
}

export function validateChatFile(file: ChatFile) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!file.name.trim() || !extension) return "Escolha um arquivo com nome e extensão válidos.";
  if (blockedExtensions.has(extension)) return "Esse tipo de arquivo não é permitido.";
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > CHAT_MAX_FILE_SIZE) return "Cada anexo pode ter no máximo 25 MB.";
  if (file.type.startsWith("image/") || file.type.startsWith("audio/") || file.type.startsWith("video/") || supportedContentTypes.has(file.type)) return null;
  return "Esse tipo de arquivo ainda não é aceito no chat.";
}

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function ensureFamilyConversation(teamId: string) {
  const members = await prisma.teamMember.findMany({
    where: { teamId },
    select: { userId: true },
  });

  if (members.length < 2) return null;

  const conversation = await prisma.chatConversation.upsert({
    where: { teamId_kind_directKey: { teamId, kind: "FAMILY", directKey: "family" } },
    create: {
      teamId,
      kind: "FAMILY",
      directKey: "family",
      title: "Família",
      participants: { create: members.map((member) => ({ userId: member.userId })) },
    },
    update: {},
  });

  const existingParticipantIds = await prisma.chatParticipant.findMany({
    where: { conversationId: conversation.id },
    select: { userId: true },
  });
  const existing = new Set(existingParticipantIds.map((participant) => participant.userId));
  const missing = members.filter((member) => !existing.has(member.userId));
  if (missing.length) {
    await prisma.chatParticipant.createMany({
      data: missing.map((member) => ({ conversationId: conversation.id, userId: member.userId })),
      skipDuplicates: true,
    });
  }

  return conversation;
}

export async function createOrFindDirectConversation(teamId: string, firstUserId: string, secondUserId: string) {
  if (firstUserId === secondUserId) return null;
  const members = await prisma.teamMember.findMany({
    where: { teamId, userId: { in: [firstUserId, secondUserId] } },
    select: { userId: true },
  });
  if (new Set(members.map((member) => member.userId)).size !== 2) return null;

  const directKey = directConversationKey(firstUserId, secondUserId);
  return prisma.chatConversation.upsert({
    where: { teamId_kind_directKey: { teamId, kind: "DIRECT", directKey } },
    create: {
      teamId,
      kind: "DIRECT",
      directKey,
      participants: { create: [{ userId: firstUserId }, { userId: secondUserId }] },
    },
    update: {},
  });
}

export async function requireChatParticipant(userId: string, conversationId: string) {
  const participant = await prisma.chatParticipant.findFirst({
    where: {
      userId,
      conversationId,
      conversation: { team: { members: { some: { userId } } } },
    },
    include: { conversation: { select: { id: true, teamId: true, kind: true, title: true } } },
  });

  return participant;
}
