export type CardPurchaseMode = "CASH" | "INSTALLMENT";

export type NormalizedCardPurchaseInput = {
  mode: CardPurchaseMode;
  amountPerInstallment: number;
  installments: number;
  currentInstallment: number;
};

const MAX_AMOUNT_PER_INSTALLMENT = 1_000_000_000;
const MAX_INSTALLMENTS = 48;

type CardPurchaseInputResult =
  | { value: NormalizedCardPurchaseInput }
  | { error: string };

function finiteNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value !== "string" || value.trim() === "") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function positiveMonetaryAmount(value: unknown) {
  const amount = finiteNumber(value);
  return amount !== null && amount > 0 && amount <= MAX_AMOUNT_PER_INSTALLMENT ? amount : null;
}

function installmentCount(value: unknown) {
  const count = finiteNumber(value);
  return count !== null && Number.isInteger(count) && count >= 1 && count <= MAX_INSTALLMENTS ? count : null;
}

export function normalizeCardPurchaseInput(input: Record<string, unknown>): CardPurchaseInputResult {
  const { mode } = input;
  if (mode !== "CASH" && mode !== "INSTALLMENT") {
    return { error: "Informe um modo de compra válido." };
  }

  const amountPerInstallment = positiveMonetaryAmount(input.amountPerInstallment);
  if (amountPerInstallment === null) {
    return { error: "Informe um valor por parcela válido." };
  }

  if (mode === "CASH") {
    return {
      value: {
        mode,
        amountPerInstallment,
        installments: 1,
        currentInstallment: 1,
      },
    };
  }

  const installments = installmentCount(input.installments);
  if (installments === null) {
    return { error: "Informe uma quantidade de parcelas entre 1 e 48." };
  }

  const currentInstallment = installmentCount(input.currentInstallment);
  if (currentInstallment === null || currentInstallment > installments) {
    return { error: `Informe a parcela atual entre 1 e ${installments}.` };
  }

  return {
    value: {
      mode,
      amountPerInstallment,
      installments,
      currentInstallment,
    },
  };
}
