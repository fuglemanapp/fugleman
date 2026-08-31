export type InstallmentPlan = { number: number; dueMonth: Date; amount: number };

export type PendingInstallmentInput = {
  installmentAmount: number;
  installments: number;
  currentInstallment: number;
  purchaseDate: Date;
  closingDay: number;
  referenceDate?: Date;
};

function utcMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 1, 12));
}

function clampInstallmentCount(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(Math.floor(value), 1), 48);
}

function clampInstallmentNumber(value: number, count: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(Math.floor(value), 1), count);
}

function moneyFromCents(value: number) {
  return Math.round(value) / 100;
}

export function statementMonthForPurchase(purchaseDate: Date, _closingDay: number) {
  return utcMonth(purchaseDate.getUTCFullYear(), purchaseDate.getUTCMonth() + 1);
}

export function buildInstallments(totalAmount: number, purchaseDate: Date, closingDay: number, installments: number): InstallmentPlan[] {
  const count = clampInstallmentCount(installments);
  const totalCents = Math.round(totalAmount * 100);
  const baseCents = Math.floor(totalCents / count);
  const remainder = totalCents - baseCents * count;
  const firstMonth = statementMonthForPurchase(purchaseDate, closingDay);
  return Array.from({ length: count }, (_, index) => ({ number: index + 1, dueMonth: utcMonth(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + index), amount: (baseCents + (index < remainder ? 1 : 0)) / 100 }));
}

export function calculatePurchaseTotal(installmentAmount: number, installments: number) {
  const count = clampInstallmentCount(installments);
  const installmentCents = Math.round(installmentAmount * 100);
  return moneyFromCents(installmentCents * count);
}

export function suggestCurrentInstallment(purchaseDate: Date, installments: number, referenceDate = new Date()) {
  const count = clampInstallmentCount(installments);
  const monthDistance =
    (referenceDate.getUTCFullYear() - purchaseDate.getUTCFullYear()) * 12 +
    referenceDate.getUTCMonth() -
    purchaseDate.getUTCMonth();
  return clampInstallmentNumber(monthDistance + 1, count);
}

export function buildPendingInstallments({
  installmentAmount,
  installments,
  currentInstallment,
  purchaseDate,
  closingDay,
}: PendingInstallmentInput): InstallmentPlan[] {
  const count = clampInstallmentCount(installments);
  const firstInstallment = clampInstallmentNumber(currentInstallment, count);
  const amount = moneyFromCents(installmentAmount * 100);
  const purchaseStatementMonth = statementMonthForPurchase(purchaseDate, closingDay);
  const firstDueMonth = utcMonth(
    purchaseStatementMonth.getUTCFullYear(),
    purchaseStatementMonth.getUTCMonth() + firstInstallment - 1,
  );

  return Array.from({ length: count - firstInstallment + 1 }, (_, index) => ({
    number: firstInstallment + index,
    dueMonth: utcMonth(firstDueMonth.getUTCFullYear(), firstDueMonth.getUTCMonth() + index),
    amount,
  }));
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
