import prisma from "@/lib/prisma";
import { generateLinkCode } from "@/lib/whatsapp-link-code";
import { normalizePhone } from "@/lib/zernio";

/** Returns the account's link code, generating and persisting one on first use. */
export async function ensureWhatsappLinkCode(userId: string): Promise<string> {
  const existing = await prisma.user.findUnique({ where: { id: userId }, select: { whatsappLinkCode: true } });
  if (existing?.whatsappLinkCode) return existing.whatsappLinkCode;

  // Retry on the unlikely unique collision.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateLinkCode();
    try {
      await prisma.user.update({ where: { id: userId }, data: { whatsappLinkCode: code } });
      return code;
    } catch {
      const current = await prisma.user.findUnique({ where: { id: userId }, select: { whatsappLinkCode: true } });
      if (current?.whatsappLinkCode) return current.whatsappLinkCode;
    }
  }
  throw new Error("Não foi possível gerar o código de vínculo do WhatsApp.");
}

type LinkResult = { linked: true; userId: string } | { linked: false };

/**
 * Links the sender's real WhatsApp number to the account that owns `code`.
 * The number moves to this account if it was linked elsewhere (the sender proves
 * control of the number, and the code proves ownership of the account).
 */
export async function linkWhatsappByCode(code: string, senderPhone: string): Promise<LinkResult> {
  const phone = normalizePhone(senderPhone);
  if (!phone) return { linked: false };

  const owner = await prisma.user.findUnique({ where: { whatsappLinkCode: code }, select: { id: true } });
  if (!owner) return { linked: false };

  await prisma.$transaction(async (transaction) => {
    await transaction.user.updateMany({ where: { phone, id: { not: owner.id } }, data: { phone: null } });
    await transaction.user.update({ where: { id: owner.id }, data: { phone } });
  });

  return { linked: true, userId: owner.id };
}
