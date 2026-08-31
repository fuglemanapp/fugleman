import { randomInt } from "node:crypto";

import prisma from "./prisma";
import { hashOpaqueToken } from "./account-tokens";

const verificationLifetimeMs = 10 * 60 * 1_000;

export function createPhoneVerificationCode() {
  return String(randomInt(100_000, 1_000_000));
}

export function parsePhoneVerificationMessage(text: string | null | undefined) {
  const match = text?.trim().match(/^VINCULAR\s+(\d{6})$/i);
  return match?.[1] || null;
}

export async function startPhoneVerification(userId: string, phone: string) {
  const code = createPhoneVerificationCode();
  const expiresAt = new Date(Date.now() + verificationLifetimeMs);
  await prisma.phoneVerification.upsert({
    where: { phone },
    create: { userId, phone, codeHash: hashOpaqueToken(code), expiresAt },
    // A pending code does not grant ownership. Replacing it prevents an
    // abandoned request from blocking the number's actual owner for 10 min.
    update: { userId, codeHash: hashOpaqueToken(code), expiresAt, verifiedAt: null },
  });

  return { code, expiresAt };
}

export async function completePhoneVerification(phone: string, code: string) {
  return prisma.$transaction(async (transaction) => {
    const verification = await transaction.phoneVerification.findUnique({
      where: { phone },
      select: { userId: true, codeHash: true, expiresAt: true },
    });
    if (!verification || verification.expiresAt <= new Date() || verification.codeHash !== hashOpaqueToken(code)) {
      return null;
    }

    const owner = await transaction.user.findUnique({ where: { phone }, select: { id: true } });
    if (owner) return null;

    await transaction.user.update({ where: { id: verification.userId }, data: { phone } });
    await transaction.phoneVerification.delete({ where: { phone } });
    return { userId: verification.userId, phone };
  });
}
