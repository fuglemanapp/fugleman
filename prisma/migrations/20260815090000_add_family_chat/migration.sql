CREATE TABLE "ChatConversation" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "directKey" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatConversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastReadAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatParticipant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "text" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ChatAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT,
    "ownerId" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatAttachment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ChatConversation_teamId_kind_directKey_key" ON "ChatConversation"("teamId", "kind", "directKey");
CREATE INDEX "ChatConversation_teamId_updatedAt_idx" ON "ChatConversation"("teamId", "updatedAt");
CREATE UNIQUE INDEX "ChatParticipant_conversationId_userId_key" ON "ChatParticipant"("conversationId", "userId");
CREATE INDEX "ChatParticipant_userId_lastReadAt_idx" ON "ChatParticipant"("userId", "lastReadAt");
CREATE INDEX "ChatMessage_conversationId_createdAt_idx" ON "ChatMessage"("conversationId", "createdAt");
CREATE UNIQUE INDEX "ChatAttachment_pathname_key" ON "ChatAttachment"("pathname");
CREATE INDEX "ChatAttachment_messageId_idx" ON "ChatAttachment"("messageId");
CREATE INDEX "ChatAttachment_ownerId_createdAt_idx" ON "ChatAttachment"("ownerId", "createdAt");

ALTER TABLE "ChatConversation" ADD CONSTRAINT "ChatConversation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatParticipant" ADD CONSTRAINT "ChatParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatAttachment" ADD CONSTRAINT "ChatAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChatAttachment" ADD CONSTRAINT "ChatAttachment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
