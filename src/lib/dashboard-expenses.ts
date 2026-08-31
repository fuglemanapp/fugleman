type DashboardTransaction = {
  amount: number;
  category: string;
  type: string;
  source: string | null;
};

type DashboardInstallment = {
  amount: number;
  purchase: {
    category: string;
    card: { isActive: boolean };
  };
};

type DashboardExpenseInput = {
  transactions: DashboardTransaction[];
  installments: DashboardInstallment[];
};

export function summarizeDashboardExpenses({
  transactions,
  installments,
}: DashboardExpenseInput) {
  const directTransactions = transactions.filter(
    (transaction) => transaction.source !== "CREDIT_CARD",
  );
  const activeInstallments = installments.filter(
    (installment) => installment.purchase.card.isActive,
  );
  const categories = new Map<string, number>();

  for (const transaction of directTransactions) {
    if (transaction.type !== "EXPENSE") continue;
    categories.set(
      transaction.category,
      (categories.get(transaction.category) || 0) + transaction.amount,
    );
  }

  for (const installment of activeInstallments) {
    categories.set(
      installment.purchase.category,
      (categories.get(installment.purchase.category) || 0) + installment.amount,
    );
  }

  const income = directTransactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expense = [...categories.values()].reduce(
    (total, amount) => total + amount,
    0,
  );

  return {
    income,
    expense,
    transactionCount: directTransactions.length + activeInstallments.length,
    expenseCategories: [...categories.entries()]
      .map(([category, amount]) => ({ category, amount }))
      .sort((first, second) => second.amount - first.amount),
  };
}
