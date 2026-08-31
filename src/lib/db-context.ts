import type { Prisma } from "@prisma/client";

import appPrisma from "@/lib/prisma";

/** Runs user-scoped database work with an RLS context local to this transaction. */
export async function withUserDb<T>(userId: string, work: (transaction: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  return appPrisma.$transaction(async (transaction) => {
    await transaction.$executeRaw`SELECT set_config('app.user_id', ${userId}, true)`;
    return work(transaction);
  });
}
