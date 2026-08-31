import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => new PrismaClient();

declare const globalThis: {
  appPrismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const appPrisma = globalThis.appPrismaGlobal ?? prismaClientSingleton();

export default appPrisma;

if (process.env.NODE_ENV !== "production") globalThis.appPrismaGlobal = appPrisma;
