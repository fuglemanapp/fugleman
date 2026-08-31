import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const session = await getAuthSession();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, image: true, phone: true, createdAt: true },
  });
}
