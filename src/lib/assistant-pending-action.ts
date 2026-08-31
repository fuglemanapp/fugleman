export type PendingAction = {
  id: string;
  kind: "EXPENSE" | "INCOME" | "CARD_PURCHASE" | "EVENT";
  amount?: number;
  description?: string;
  category?: string;
  date?: string;
  cardReference?: string;
  cardId?: string;
  installments?: number;
  currentInstallment?: number;
  title?: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  expiresAt: string;
};

export function activePendingAction(value: PendingAction | null, now: Date) {
  return value && new Date(value.expiresAt).getTime() > now.getTime() ? value : null;
}
