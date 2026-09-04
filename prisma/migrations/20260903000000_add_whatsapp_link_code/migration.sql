-- AlterTable
ALTER TABLE "User" ADD COLUMN "whatsappLinkCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_whatsappLinkCode_key" ON "User"("whatsappLinkCode");
