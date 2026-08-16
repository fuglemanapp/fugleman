import type { FinancialContext } from "@/lib/financial-context";

export function contextOwner(context: FinancialContext) {
  return context.type === "FAMILY"
    ? { teamId: context.teamId, userId: null }
    : { teamId: null, userId: context.userId };
}

export function monthStart(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1, 12));
  return date.getUTCMonth() === Number(match[2]) - 1 ? date : null;
}

export function validDate(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function positiveAmount(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) && amount > 0 && amount <= 1_000_000_000
    ? amount
    : null;
}
