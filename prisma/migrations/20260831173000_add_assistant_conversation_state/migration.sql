ALTER TABLE "AssistantConversation"
  ADD COLUMN "pendingAction" JSONB,
  ADD COLUMN "pendingActionExpiresAt" TIMESTAMP(3),
  ADD COLUMN "pendingActionVersion" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Transaction" ADD COLUMN "assistantMessageId" TEXT;
ALTER TABLE "Event" ADD COLUMN "assistantMessageId" TEXT;

CREATE UNIQUE INDEX "Transaction_assistantMessageId_key"
  ON "Transaction"("assistantMessageId")
  WHERE "assistantMessageId" IS NOT NULL;

CREATE UNIQUE INDEX "Event_assistantMessageId_key"
  ON "Event"("assistantMessageId")
  WHERE "assistantMessageId" IS NOT NULL;
