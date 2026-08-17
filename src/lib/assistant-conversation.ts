import prisma from "./prisma";

export function ensureAssistantConversation(userId: string) {
  return prisma.assistantConversation.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}
