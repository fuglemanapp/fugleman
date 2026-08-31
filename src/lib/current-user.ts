import { getAuthSession } from "@/lib/auth";
import { servicePrisma } from "@/lib/prisma-service";

export async function getCurrentUser() {
  const session = await getAuthSession();
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    return null;
  }

  return servicePrisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, image: true, phone: true, createdAt: true },
  });
}
