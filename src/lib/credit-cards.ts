export type InstallmentPlan = { number: number; dueMonth: Date; amount: number };

function utcMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 1, 12));
}

export function statementMonthForPurchase(purchaseDate: Date, closingDay: number) {
  const closing = Math.min(Math.max(closingDay, 1), 28);
  const year = purchaseDate.getUTCFullYear();
  const month = purchaseDate.getUTCMonth();
  return utcMonth(year, purchaseDate.getUTCDate() > closing ? month + 1 : month);
}

export function buildInstallments(totalAmount: number, purchaseDate: Date, closingDay: number, installments: number): InstallmentPlan[] {
  const count = Math.min(Math.max(Math.floor(installments), 1), 48);
  const totalCents = Math.round(totalAmount * 100);
  const baseCents = Math.floor(totalCents / count);
  const remainder = totalCents - baseCents * count;
  const firstMonth = statementMonthForPurchase(purchaseDate, closingDay);
  return Array.from({ length: count }, (_, index) => ({ number: index + 1, dueMonth: utcMonth(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + index), amount: (baseCents + (index < remainder ? 1 : 0)) / 100 }));
}

export function monthKey(value: Date) {
  return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function dateFromMonthKey(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const date = utcMonth(Number(match[1]), Number(match[2]) - 1);
  return date.getUTCMonth() === Number(match[2]) - 1 ? date : null;
}

export function statementDueDate(dueMonth: Date, dueDay: number) {
  const day = Math.min(Math.max(dueDay, 1), 28);
  return new Date(Date.UTC(dueMonth.getUTCFullYear(), dueMonth.getUTCMonth(), day, 12));
}
