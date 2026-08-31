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

export type PendingActionUpdate = Pick<
  PendingAction,
  | "amount"
  | "description"
  | "category"
  | "date"
  | "cardReference"
  | "cardId"
  | "installments"
  | "currentInstallment"
  | "title"
  | "startTime"
  | "endTime"
>;

export function activePendingAction(value: PendingAction | null, now: Date) {
  return value && new Date(value.expiresAt).getTime() > now.getTime() ? value : null;
}

export function mergePendingAction(
  action: PendingAction,
  update: PendingActionUpdate,
): PendingAction {
  const definedUpdate = Object.fromEntries(
    Object.entries(update).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  ) as PendingActionUpdate;

  return { ...action, ...definedUpdate };
}

export function missingPendingFields(action: PendingAction): string[] {
  const required =
    action.kind === "EVENT"
      ? ["title", "startTime", "endTime"] as const
      : ["amount", "description", "category", "date"] as const;

  if (action.kind === "CARD_PURCHASE") {
    required.push("cardReference" as never);
  }

  return required.filter((field) => {
    const value = action[field as keyof PendingAction];
    return value === undefined || value === null || value === "";
  });
}

export function cancelPendingAction(text: string): boolean {
  const normalized = text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");

  return /\b(cancela(?:r)?|desiste?(?:ir)?|nao quero mais)\b/.test(normalized);
}
