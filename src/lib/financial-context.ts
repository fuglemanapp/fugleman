import prisma from "@/lib/prisma";

export type FinancialContext =
  | {
      key: "personal";
      type: "PERSONAL";
      userId: string;
      memberIds: string[];
      teamId: null;
      name: string;
    }
  | {
      key: `team:${string}`;
      type: "FAMILY";
      userId: null;
      memberIds: string[];
      teamId: string;
      name: string;
      role: "ADMIN" | "MEMBER";
    };

export function parseFinancialContext(value: string | null) {
  if (!value || value === "personal") {
    return { type: "PERSONAL" as const };
  }

  const match = value.match(/^team:([a-zA-Z0-9_-]+)$/);
  return match ? { type: "FAMILY" as const, teamId: match[1] } : null;
}

export async function resolveFinancialContext(
  userId: string,
  value: string | null,
): Promise<FinancialContext | null> {
  const parsed = parseFinancialContext(value);
  if (!parsed) {
    return null;
  }

  if (parsed.type === "PERSONAL") {
    return {
      key: "personal",
      type: "PERSONAL",
      userId,
      memberIds: [userId],
      teamId: null,
      name: "Meu espaço",
    };
  }

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: parsed.teamId, userId } },
    include: { team: { include: { members: { select: { userId: true } } } } },
  });

  if (!membership) {
    return null;
  }

  return {
    key: `team:${parsed.teamId}`,
    type: "FAMILY",
    userId: null,
    teamId: parsed.teamId,
    memberIds: membership.team.members.map((member) => member.userId),
    name: membership.team.name,
    role: membership.role === "ADMIN" ? "ADMIN" : "MEMBER",
  };
}

export async function requireTeamAdmin(userId: string, teamId: string) {
  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId } },
    include: { team: true },
  });

  return membership?.role === "ADMIN" ? membership : null;
}

export function transactionContextWhere(context: FinancialContext) {
  if (context.type === "PERSONAL") {
    return { userId: context.userId };
  }

  return {
    OR: [{ userId: { in: context.memberIds } }, { teamId: context.teamId }],
  };
}

export async function availableFinancialContexts(userId: string) {
  const memberships = await prisma.teamMember.findMany({
    where: { userId },
    include: { team: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return [
    { key: "personal", label: "Meu espaço", type: "PERSONAL" as const },
    ...memberships.map((membership) => ({
      key: `team:${membership.teamId}`,
      label: membership.team.name,
      type: "FAMILY" as const,
      role: membership.role,
    })),
  ];
}
