CREATE TABLE "TransactionRule" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "matchText" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "type" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TransactionRule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CreditCard" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "teamId" TEXT,
  "name" TEXT NOT NULL,
  "issuer" TEXT,
  "lastFour" TEXT,
  "color" TEXT NOT NULL DEFAULT '#0B9D4E',
  "limit" DOUBLE PRECISION NOT NULL,
  "closingDay" INTEGER NOT NULL,
  "dueDay" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CardPurchase" (
  "id" TEXT NOT NULL,
  "cardId" TEXT NOT NULL,
  "transactionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "totalAmount" DOUBLE PRECISION NOT NULL,
  "purchaseDate" TIMESTAMP(3) NOT NULL,
  "installments" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CardPurchase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CardInstallment" (
  "id" TEXT NOT NULL,
  "purchaseId" TEXT NOT NULL,
  "number" INTEGER NOT NULL,
  "dueMonth" TIMESTAMP(3) NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CardInstallment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CardStatementPayment" (
  "id" TEXT NOT NULL,
  "cardId" TEXT NOT NULL,
  "dueMonth" TIMESTAMP(3) NOT NULL,
  "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paidById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CardStatementPayment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TransactionRule_userId_isActive_idx" ON "TransactionRule"("userId", "isActive");
CREATE INDEX "CreditCard_userId_isActive_idx" ON "CreditCard"("userId", "isActive");
CREATE INDEX "CreditCard_teamId_isActive_idx" ON "CreditCard"("teamId", "isActive");
CREATE UNIQUE INDEX "CardPurchase_transactionId_key" ON "CardPurchase"("transactionId");
CREATE INDEX "CardPurchase_cardId_purchaseDate_idx" ON "CardPurchase"("cardId", "purchaseDate");
CREATE INDEX "CardPurchase_userId_purchaseDate_idx" ON "CardPurchase"("userId", "purchaseDate");
CREATE UNIQUE INDEX "CardInstallment_purchaseId_number_key" ON "CardInstallment"("purchaseId", "number");
CREATE INDEX "CardInstallment_dueMonth_idx" ON "CardInstallment"("dueMonth");
CREATE UNIQUE INDEX "CardStatementPayment_cardId_dueMonth_key" ON "CardStatementPayment"("cardId", "dueMonth");
CREATE INDEX "CardStatementPayment_paidById_idx" ON "CardStatementPayment"("paidById");

ALTER TABLE "TransactionRule" ADD CONSTRAINT "TransactionRule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CardPurchase" ADD CONSTRAINT "CardPurchase_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CardPurchase" ADD CONSTRAINT "CardPurchase_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CardPurchase" ADD CONSTRAINT "CardPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CardInstallment" ADD CONSTRAINT "CardInstallment_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "CardPurchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CardStatementPayment" ADD CONSTRAINT "CardStatementPayment_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CreditCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CardStatementPayment" ADD CONSTRAINT "CardStatementPayment_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
