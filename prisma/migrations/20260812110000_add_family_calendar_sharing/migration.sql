CREATE TABLE "FamilyCalendarShare" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "primaryCalendarId" TEXT,
    "partnerAccessRuleId" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyCalendarShare_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FamilyCalendarShare_teamId_userId_key" ON "FamilyCalendarShare"("teamId", "userId");
CREATE INDEX "FamilyCalendarShare_userId_idx" ON "FamilyCalendarShare"("userId");

ALTER TABLE "FamilyCalendarShare" ADD CONSTRAINT "FamilyCalendarShare_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyCalendarShare" ADD CONSTRAINT "FamilyCalendarShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
