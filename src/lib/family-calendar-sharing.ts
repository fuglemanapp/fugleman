import prisma from "@/lib/prisma";
import { addGoogleCalendarReader, getGoogleCalendarStatus, removeGoogleCalendarReader, synchronizeGoogleCalendar } from "@/lib/google-calendar";

type Member = { userId: string; user: { id: string; name: string | null; email: string | null } };

async function getFamily(teamId: string) {
  return prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "asc" } },
      calendarShares: true,
    },
  });
}

function memberLabel(member: Member) {
  return member.user.name || member.user.email || "Membro da família";
}

export async function listFamilyCalendarSharing(userId: string) {
  const memberships = await prisma.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
    orderBy: { createdAt: "asc" },
  });
  const families = await Promise.all(memberships.map(async ({ teamId }) => {
    const team = await getFamily(teamId);
    if (!team) return null;
    const members = team.members as Member[];
    const ownMember = members.find((member) => member.userId === userId);
    const partner = members.find((member) => member.userId !== userId);
    const ownShare = team.calendarShares.find((share) => share.userId === userId);
    const partnerShare = partner ? team.calendarShares.find((share) => share.userId === partner.userId) : null;
    const google = await getGoogleCalendarStatus(userId);
    const isTwoPeopleFamily = members.length === 2;
    const active = Boolean(isTwoPeopleFamily && ownShare?.enabled && partnerShare?.enabled && !ownShare?.lastError && !partnerShare?.lastError && ownShare?.partnerAccessRuleId && partnerShare?.partnerAccessRuleId);
    const status = !isTwoPeopleFamily
      ? "NEEDS_TWO_MEMBERS"
      : !google.sharingConnected
        ? "NEEDS_RECONNECT"
        : !ownShare?.enabled
          ? "WAITING_FOR_YOU"
          : !partnerShare?.enabled
            ? "WAITING_FOR_PARTNER"
            : active
              ? "ACTIVE"
              : "ATTENTION";
    return {
      id: team.id,
      name: team.name,
      partner: partner ? { id: partner.user.id, name: memberLabel(partner), email: partner.user.email } : null,
      memberCount: members.length,
      canShare: Boolean(ownMember && partner),
      own: { enabled: ownShare?.enabled ?? false, lastError: ownShare?.lastError ?? null, sharingConnected: google.sharingConnected },
      partnerSharingEnabled: partnerShare?.enabled ?? false,
      status,
    };
  }));
  return families.filter((family): family is NonNullable<typeof family> => Boolean(family));
}

async function reconcileFamilyCalendarSharing(teamId: string) {
  const team = await getFamily(teamId);
  if (!team) return { error: "Família não encontrada." } as const;
  const members = team.members as Member[];
  if (members.length !== 2) return { error: "O compartilhamento de agenda está disponível para famílias com duas pessoas." } as const;

  const shares = team.calendarShares;
  if (shares.length !== 2 || shares.some((share) => !share.enabled)) return { pending: true } as const;

  const results = await Promise.all(members.map(async (member) => {
    const partner = members.find((candidate) => candidate.userId !== member.userId)!;
    const share = shares.find((candidate) => candidate.userId === member.userId)!;
    if (!partner.user.email) {
      const error = "O parceiro precisa ter um e-mail cadastrado para compartilhar a agenda.";
      await prisma.familyCalendarShare.update({ where: { id: share.id }, data: { lastError: error } });
      return { error };
    }
    const result = await addGoogleCalendarReader(member.userId, partner.user.email, share.partnerAccessRuleId);
    if ("error" in result) {
      await prisma.familyCalendarShare.update({ where: { id: share.id }, data: { lastError: result.error } });
      return result;
    }
    await prisma.familyCalendarShare.update({
      where: { id: share.id },
      data: { primaryCalendarId: "primary", partnerAccessRuleId: result.ruleId, lastError: null, lastSyncedAt: new Date() },
    });
    return result;
  }));
  const failure = results.find((result) => "error" in result);
  return failure && "error" in failure ? failure : { active: true } as const;
}

export async function setFamilyCalendarConsent(userId: string, teamId: string, enabled: boolean) {
  const membership = await prisma.teamMember.findUnique({ where: { teamId_userId: { teamId, userId } } });
  if (!membership) return { error: "Você não faz parte desta família." } as const;

  const team = await getFamily(teamId);
  if (!team || team.members.length !== 2) return { error: "O compartilhamento de agenda está disponível para famílias com duas pessoas." } as const;

  if (!enabled) {
    const revocations = await Promise.all(team.calendarShares.map(async (share) => {
      if (!share.partnerAccessRuleId) return null;
      return { share, result: await removeGoogleCalendarReader(share.userId, share.partnerAccessRuleId) };
    }));
    const failed = revocations.find((entry) => entry && "error" in entry.result);
    if (failed && "error" in failed.result) {
      await prisma.familyCalendarShare.update({ where: { id: failed.share.id }, data: { lastError: failed.result.error } });
      return failed.result;
    }
    await prisma.familyCalendarShare.updateMany({ where: { teamId }, data: { partnerAccessRuleId: null, lastSyncedAt: new Date(), lastError: null } });
  }

  await prisma.familyCalendarShare.upsert({
    where: { teamId_userId: { teamId, userId } },
    create: { teamId, userId, enabled, primaryCalendarId: enabled ? "primary" : null, lastError: null },
    update: {
      enabled,
      ...(enabled ? { primaryCalendarId: "primary", lastError: null } : { partnerAccessRuleId: null, lastError: null }),
    },
  });

  if (!enabled) return { disabled: true } as const;

  const synced = await synchronizeGoogleCalendar(userId);
  if ("error" in synced) {
    await prisma.familyCalendarShare.update({ where: { teamId_userId: { teamId, userId } }, data: { lastError: synced.error } });
    return synced;
  }

  return reconcileFamilyCalendarSharing(teamId);
}
