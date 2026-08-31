type DirectTransaction = {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: string;
  date: Date;
  source: string | null;
};

type CardInstallment = {
  id: string;
  number: number;
  amount: number;
  dueMonth: Date;
  purchase: {
    description: string;
    category: string;
    installments: number;
    card: {
      id: string;
      name: string;
      lastFour: string | null;
      isActive: boolean;
    };
  };
};

type ActivityInput = {
  transactions: DirectTransaction[];
  installments: CardInstallment[];
};

export type MonthlyActivity = {
  id: string;
  kind: "TRANSACTION" | "CARD_INSTALLMENT";
  amount: number;
  description: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  date: Date;
  canDelete: boolean;
  cardId?: string;
  cardName?: string;
  cardLastFour?: string | null;
  installmentLabel?: string;
};

export function buildMonthlyActivities({
  transactions,
  installments,
}: ActivityInput): MonthlyActivity[] {
  const directActivities: MonthlyActivity[] = transactions
    .filter((transaction) => transaction.source !== "CREDIT_CARD")
    .map((transaction) => ({
      id: transaction.id,
      kind: "TRANSACTION",
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      type: transaction.type === "INCOME" ? "INCOME" : "EXPENSE",
      date: transaction.date,
      canDelete: true,
    }));

  const installmentActivities: MonthlyActivity[] = installments
    .filter((installment) => installment.purchase.card.isActive)
    .map((installment) => ({
      id: `installment:${installment.id}`,
      kind: "CARD_INSTALLMENT",
      amount: installment.amount,
      description: installment.purchase.description,
      category: installment.purchase.category,
      type: "EXPENSE",
      date: installment.dueMonth,
      canDelete: false,
      cardId: installment.purchase.card.id,
      cardName: installment.purchase.card.name,
      cardLastFour: installment.purchase.card.lastFour,
      installmentLabel: `${installment.number}/${installment.purchase.installments}`,
    }));

  return [...directActivities, ...installmentActivities].sort(
    (first, second) => second.date.getTime() - first.date.getTime(),
  );
}
