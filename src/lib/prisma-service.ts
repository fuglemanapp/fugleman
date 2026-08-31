import { PrismaClient } from "@prisma/client";

function createServicePrisma() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  return new PrismaClient(url ? { datasources: { db: { url } } } : undefined);
}

declare const globalThis: {
  servicePrismaGlobal: ReturnType<typeof createServicePrisma>;
} & typeof global;

/**
 * Privileged connection reserved for authentication, migrations, rate limits
 * and signed provider/webhook bookkeeping. User data must use `withUserDb`.
 */
export const servicePrisma = globalThis.servicePrismaGlobal ?? createServicePrisma();

if (process.env.NODE_ENV !== "production") globalThis.servicePrismaGlobal = servicePrisma;
