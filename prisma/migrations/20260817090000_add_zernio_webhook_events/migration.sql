CREATE TABLE "ZernioWebhookEvent" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "accountId" TEXT,
    "conversationId" TEXT,
    "responseText" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZernioWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ZernioWebhookEvent_createdAt_idx" ON "ZernioWebhookEvent"("createdAt");
CREATE INDEX "ZernioWebhookEvent_userId_idx" ON "ZernioWebhookEvent"("userId");

ALTER TABLE "ZernioWebhookEvent" ADD CONSTRAINT "ZernioWebhookEvent_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
