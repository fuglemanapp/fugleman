"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  CreditCard,
  LoaderCircle,
  Plus,
  ReceiptText,
  X,
} from "lucide-react";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import {
  FinancialContextSwitcher,
  type FinancialWorkspace,
} from "@/components/financial/financial-context-switcher";
import { CARD_COLORS } from "@/lib/card-colors";
import { suggestCurrentInstallment } from "@/lib/credit-cards";
import { nextStatementMonthInSaoPaulo, saoPauloCalendarDate } from "@/lib/financial-time";

type Card = {
  id: string;
  name: string;
  issuer: string | null;
  lastFour: string | null;
  color: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  isActive: boolean;
  canManage: boolean;
  user: { id: string; name: string | null; email: string | null };
};
type Purchase = {
  id: string;
  description: string;
  category: string;
  totalAmount: number;
  purchaseDate: string;
  installments: number;
  installmentAmount: number | null;
  currentInstallment: number | null;
  user: { id: string; name: string | null; email: string | null };
  installmentsList: {
    id: string;
    number: number;
    dueMonth: string;
    amount: number;
  }[];
};
type PurchaseForm = {
  description: string;
  category: string;
  purchaseDate: string;
  mode: "CASH" | "INSTALLMENT";
  amountPerInstallment: string;
  installments: string;
  currentInstallment: string;
};
type CardForm = {
  name: string;
  issuer: string;
  lastFour: string;
  limit: string;
  closingDay: string;
  dueDay: string;
  color: string;
};
type Statement = {
  card: Card;
  dueMonth: string;
  dueDate: string;
  amount: number;
  paidAt: string | null;
  items: {
    id: string;
    number: number;
    amount: number;
    description: string;
    category: string;
    installments: number;
    user: { id: string; name: string | null; email: string | null };
  }[];
};
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const categories = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Assinaturas",
  "Compras",
  "Transferências",
  "Investimentos",
  "Outros",
];
const hexColorPattern = /^#[0-9A-F]{6}$/;
function nextStatementMonth() {
  return nextStatementMonthInSaoPaulo()
    .toISOString()
    .slice(0, 7);
}
function personName(card: Card) {
  return card.user.name || card.user.email || "Membro";
}
function defaultPurchaseForm(): PurchaseForm {
  return {
    description: "",
    category: categories[0],
    purchaseDate: saoPauloCalendarDate(),
    mode: "CASH",
    amountPerInstallment: "",
    installments: "1",
    currentInstallment: "1",
  };
}
function clampNumber(value: string, minimum: number, maximum: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return minimum;
  return Math.min(Math.max(Math.trunc(parsed), minimum), maximum);
}
function dateFromInput(value: string) {
  return new Date(`${value}T12:00:00.000Z`);
}

export function CreditCardsWorkspace() {
  const [context, setContext] = useState("personal");
  const [workspaces, setWorkspaces] = useState<FinancialWorkspace[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);
  const [isPurchaseFormOpen, setIsPurchaseFormOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [currentInstallmentWasEdited, setCurrentInstallmentWasEdited] =
    useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [cardForm, setCardForm] = useState<CardForm>({
    name: "",
    issuer: "",
    lastFour: "",
    limit: "",
    closingDay: "10",
    dueDay: "17",
    color: CARD_COLORS[0],
  });
  const [colorDraft, setColorDraft] = useState<string>(CARD_COLORS[0]);
  const [purchaseForm, setPurchaseForm] =
    useState<PurchaseForm>(defaultPurchaseForm);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [cardsResponse, statementsResponse] = await Promise.all([
        fetch(`/api/financial/cards?context=${encodeURIComponent(context)}`, {
          cache: "no-store",
        }),
        fetch(
          `/api/financial/card-statements?context=${encodeURIComponent(context)}&from=${nextStatementMonth()}&months=7`,
          { cache: "no-store" },
        ),
      ]);
      const cardsData = (await cardsResponse.json()) as {
        cards?: Card[];
        error?: string;
      };
      const statementsData = (await statementsResponse.json()) as {
        statements?: Statement[];
        error?: string;
      };
      if (!cardsResponse.ok)
        throw new Error(
          cardsData.error || "Não foi possível carregar seus cartões.",
        );
      if (!statementsResponse.ok)
        throw new Error(
          statementsData.error || "Não foi possível carregar as faturas.",
        );
      setCards(cardsData.cards || []);
      setStatements(statementsData.statements || []);
      setSelectedCard((current) =>
        current
          ? (cardsData.cards || []).find((card) => card.id === current.id) ||
            null
          : null,
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível carregar seus cartões.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [context]);
  useEffect(() => {
    void fetch("/api/financial/workspaces")
      .then((response) => response.json())
      .then((data: { workspaces?: FinancialWorkspace[] }) =>
        setWorkspaces(data.workspaces || []),
      )
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    if (!selectedCard) {
      setPurchases([]);
      return;
    }
    void fetch(
      `/api/financial/card-purchases?context=${encodeURIComponent(context)}&cardId=${encodeURIComponent(selectedCard.id)}`,
    )
      .then(async (response) => {
        const data = (await response.json()) as {
          purchases?: Purchase[];
          error?: string;
        };
        if (!response.ok) throw new Error(data.error);
        setPurchases(data.purchases || []);
      })
      .catch((reason: unknown) =>
        setError(
          reason instanceof Error
            ? reason.message
            : "Não foi possível carregar as compras.",
        ),
      );
  }, [context, selectedCard]);
  const statementsByCard = useMemo(
    () =>
      new Map(
        cards.map((card) => [
          card.id,
          statements.filter((statement) => statement.card.id === card.id),
        ]),
      ),
    [cards, statements],
  );

  async function createCard(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch("/api/financial/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cardForm, context }),
      });
      const data = (await response.json()) as { card?: Card; error?: string };
      if (!response.ok || !data.card)
        throw new Error(data.error || "Não foi possível criar o cartão.");
      setIsCardFormOpen(false);
      setCardForm({
        name: "",
        issuer: "",
        lastFour: "",
        limit: "",
        closingDay: "10",
        dueDay: "17",
        color: CARD_COLORS[0],
      });
      setColorDraft(CARD_COLORS[0]);
      await load();
      setSelectedCard(data.card);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível criar o cartão.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function openPurchaseForm(purchase?: Purchase) {
    if (!purchase) {
      setEditingPurchase(null);
      setCurrentInstallmentWasEdited(false);
      setPurchaseForm(defaultPurchaseForm());
      setIsPurchaseFormOpen(true);
      return;
    }

    const legacyInstallmentAmount =
      purchase.installmentAmount ??
      Number((purchase.totalAmount / purchase.installments).toFixed(2));
    const installments = clampNumber(String(purchase.installments), 1, 48);
    const currentInstallment = clampNumber(
      String(
        purchase.currentInstallment ??
          purchase.installmentsList[0]?.number ??
          1,
      ),
      1,
      installments,
    );

    setEditingPurchase(purchase);
    setCurrentInstallmentWasEdited(true);
    setPurchaseForm({
      description: purchase.description,
      category: purchase.category,
      purchaseDate: purchase.purchaseDate.slice(0, 10),
      mode: installments === 1 ? "CASH" : "INSTALLMENT",
      amountPerInstallment: String(legacyInstallmentAmount),
      installments: String(installments),
      currentInstallment: String(currentInstallment),
    });
    setIsPurchaseFormOpen(true);
  }

  function updatePurchaseDate(purchaseDate: string) {
    setPurchaseForm((current) => {
      const next = { ...current, purchaseDate };
      if (next.mode === "CASH" || currentInstallmentWasEdited) return next;
      return {
        ...next,
        currentInstallment: String(
          suggestCurrentInstallment(
            dateFromInput(purchaseDate),
            clampNumber(next.installments, 1, 48),
          ),
        ),
      };
    });
  }

  function updateInstallmentCount(value: string) {
    const installments = clampNumber(value, 1, 48);
    setPurchaseForm((current) => {
      const next = { ...current, installments: String(installments) };
      if (currentInstallmentWasEdited) {
        return {
          ...next,
          currentInstallment: String(
            clampNumber(next.currentInstallment, 1, installments),
          ),
        };
      }
      return {
        ...next,
        currentInstallment: String(
          suggestCurrentInstallment(
            dateFromInput(next.purchaseDate),
            installments,
          ),
        ),
      };
    });
  }

  function changePurchaseMode(mode: PurchaseForm["mode"]) {
    setCurrentInstallmentWasEdited(false);
    setPurchaseForm((current) => {
      if (mode === "CASH") {
        return {
          ...current,
          mode,
          installments: "1",
          currentInstallment: "1",
        };
      }
      const installments = clampNumber(current.installments, 1, 48);
      return {
        ...current,
        mode,
        installments: String(installments),
        currentInstallment: String(
          suggestCurrentInstallment(
            dateFromInput(current.purchaseDate),
            installments,
          ),
        ),
      };
    });
  }

  async function savePurchase(event: FormEvent) {
    event.preventDefault();
    if (!selectedCard) return;
    setIsSaving(true);
    setError("");
    try {
      const installments =
        purchaseForm.mode === "CASH"
          ? 1
          : clampNumber(purchaseForm.installments, 1, 48);
      const currentInstallment =
        purchaseForm.mode === "CASH"
          ? 1
          : clampNumber(purchaseForm.currentInstallment, 1, installments);
      const response = await fetch("/api/financial/card-purchases", {
        method: editingPurchase ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...purchaseForm,
          installments,
          currentInstallment,
          cardId: selectedCard.id,
          context,
          ...(editingPurchase ? { id: editingPurchase.id } : {}),
        }),
      });
      const data = (await response.json()) as {
        purchase?: Purchase;
        suggestion?: { matchedBy: string } | null;
        error?: string;
      };
      if (!response.ok || !data.purchase) {
        throw new Error(
          data.error ||
            (editingPurchase
              ? "Não foi possível atualizar a compra."
              : "Não foi possível registrar a compra."),
        );
      }
      setMessage(
        editingPurchase
          ? "Compra atualizada e projeções recalculadas."
          : data.suggestion
            ? `Compra registrada com a regra “${data.suggestion.matchedBy}”.`
            : "Compra registrada e incluída na sua projeção.",
      );
      setIsPurchaseFormOpen(false);
      setEditingPurchase(null);
      setCurrentInstallmentWasEdited(false);
      setPurchaseForm(defaultPurchaseForm());
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : editingPurchase
            ? "Não foi possível atualizar a compra."
            : "Não foi possível registrar a compra.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function markStatement(statement: Statement, paid: boolean) {
    setError("");
    const response = await fetch("/api/financial/card-statements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context,
        cardId: statement.card.id,
        dueMonth: statement.dueMonth.slice(0, 7),
        paid,
      }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error || "Não foi possível atualizar a fatura.");
      return;
    }
    await load();
  }

  async function archiveCard(card: Card) {
    const confirmed = window.confirm(
      `Arquivar o cartão “${card.name}”? Esta ação arquiva o cartão inteiro, não uma compra individual.`,
    );
    if (!confirmed) return;

    setError("");
    const response = await fetch(
      `/api/financial/cards?id=${encodeURIComponent(card.id)}&context=${encodeURIComponent(context)}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      setError("Não foi possível arquivar o cartão.");
      return;
    }
    setSelectedCard(null);
    await load();
  }

  async function deletePurchase(purchase: Purchase) {
    const confirmed = window.confirm(
      `Excluir a compra “${purchase.description}”? Esta ação remove apenas esta compra e suas parcelas; o cartão permanecerá ativo.`,
    );
    if (!confirmed) return;

    setIsSaving(true);
    setError("");
    try {
      const response = await fetch(
        `/api/financial/card-purchases?id=${encodeURIComponent(purchase.id)}&context=${encodeURIComponent(context)}`,
        { method: "DELETE" },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível excluir a compra.");
      }
      setMessage(`Compra “${purchase.description}” excluída. O cartão permanece ativo.`);
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível excluir a compra.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const canManageSelected = selectedCard?.canManage === true;
  const selectedStatements = selectedCard
    ? statementsByCard.get(selectedCard.id) || []
    : [];
  const isInstallmentPurchase = purchaseForm.mode === "INSTALLMENT";
  const installmentCount = isInstallmentPurchase
    ? clampNumber(purchaseForm.installments, 1, 48)
    : 1;
  const currentInstallment = isInstallmentPurchase
    ? clampNumber(purchaseForm.currentInstallment, 1, installmentCount)
    : 1;
  const totalAmount =
    (Math.round(Number(purchaseForm.amountPerInstallment) * 100) *
      installmentCount || 0) / 100;
  return (
    <div className="min-h-[100dvh] bg-[#f6faf7] text-[#17372b]">
      <DashboardNav activePath="/dashboard/financeiro/cartoes" />
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#079347]">
              Cartões
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Gaste hoje, antecipe a fatura.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#678176] sm:text-base">
              Compras entram na data em que acontecem; as parcelas mostram o que
              virá nos próximos meses.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <FinancialContextSwitcher
              workspaces={workspaces}
              value={context}
              onChange={setContext}
            />
            <button
              type="button"
              onClick={() => setIsCardFormOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#0b9d4e] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_-14px_rgba(11,157,78,0.7)] transition hover:-translate-y-0.5 hover:bg-[#078940]"
            >
              <Plus className="h-4 w-4" /> Novo cartão
            </button>
          </div>
        </header>
        {error && (
          <p className="mt-6 rounded-xl bg-[#fff1f1] px-4 py-3 text-sm text-[#a93636]">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-6 rounded-xl bg-[#edf9f1] px-4 py-3 text-sm text-[#315f48]">
            {message}
          </p>
        )}
        {isLoading ? (
          <div className="grid min-h-72 place-items-center">
            <LoaderCircle className="h-6 w-6 animate-spin text-[#079347]" />
          </div>
        ) : selectedCard ? (
          <section className="mt-7">
            <button
              type="button"
              onClick={() => setSelectedCard(null)}
              className="inline-flex items-center gap-1 text-sm font-bold text-[#087d3c]"
            >
              <ChevronLeft className="h-4 w-4" /> Todos os cartões
            </button>
            <div className="mt-4 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
              <article
                className="overflow-hidden rounded-[1.9rem] text-white shadow-[0_26px_56px_-36px_rgba(12,73,43,0.7)]"
                style={{
                  background: `linear-gradient(135deg, ${selectedCard.color}, #173e2d)`,
                }}
              >
                <div className="p-7">
                  <CreditCard className="h-7 w-7" />
                  <p className="mt-12 text-sm font-semibold text-white/75">
                    {selectedCard.issuer || "Cartão de crédito"}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                    {selectedCard.name}
                  </h2>
                  <p className="mt-7 text-sm tracking-[0.2em]">
                    •••• {selectedCard.lastFour || "••••"}
                  </p>
                  <div className="mt-8 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-white/65">Limite total</p>
                      <p className="mt-1 text-lg font-bold">
                        {currency.format(selectedCard.limit)}
                      </p>
                    </div>
                    <div className="text-right text-xs text-white/70">
                      <p>Fecha dia {selectedCard.closingDay}</p>
                      <p className="mt-1">Vence dia {selectedCard.dueDay}</p>
                    </div>
                  </div>
                </div>
              </article>
              <article className="rounded-[1.9rem] bg-white p-6 shadow-[0_18px_48px_-34px_rgba(12,100,53,0.42)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#079347]">
                      Detalhe do cartão
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      Faturas e projeções
                    </h2>
                    {context.startsWith("team:") && (
                      <p className="mt-1 text-xs text-[#789083]">
                        Cartão de {personName(selectedCard)}
                      </p>
                    )}
                  </div>
                  {canManageSelected && (
                    <button
                      type="button"
                      onClick={() => openPurchaseForm()}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0b9d4e] px-4 text-sm font-bold text-white hover:bg-[#078940]"
                    >
                      <Plus className="h-4 w-4" /> Nova compra
                    </button>
                  )}
                </div>
                {selectedStatements.some(
                  (statement) => statement.amount > 0,
                ) ? (
                  <div className="mt-5 space-y-3">
                    {selectedStatements
                      .filter((statement) => statement.amount > 0)
                      .map((statement) => (
                        <div
                          key={statement.dueMonth}
                          className="rounded-2xl border border-[#e0ece4] p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold">
                                Fatura de{" "}
                                {new Date(statement.dueDate).toLocaleDateString(
                                  "pt-BR",
                                  { month: "long", year: "numeric" },
                                )}
                              </p>
                              <p className="mt-1 text-xs text-[#789083]">
                                Vence em{" "}
                                {new Date(statement.dueDate).toLocaleDateString(
                                  "pt-BR",
                                )}{" "}
                                · {statement.items.length}{" "}
                                {statement.items.length === 1
                                  ? "lançamento"
                                  : "lançamentos"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold">
                                {currency.format(statement.amount)}
                              </p>
                              {statement.paidAt ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void markStatement(statement, false)
                                  }
                                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#087d3c]"
                                >
                                  <Check className="h-3.5 w-3.5" /> Paga
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void markStatement(statement, true)
                                  }
                                  className="mt-1 text-xs font-bold text-[#087d3c]"
                                >
                                  Marcar como paga
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 border-t border-[#edf3ef] pt-3">
                            {statement.items.slice(0, 3).map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between gap-3 py-1 text-xs"
                              >
                                <span className="truncate text-[#567465]">
                                  {item.description}{" "}
                                  {item.installments > 1
                                    ? `· ${item.number}/${item.installments}`
                                    : ""}
                                </span>
                                <span className="font-semibold">
                                  {currency.format(item.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="mt-6 rounded-2xl bg-[#f3f8f5] p-5 text-sm leading-relaxed text-[#678176]">
                    Nenhuma compra registrada neste cartão. Adicione uma compra
                    para visualizar a primeira fatura.
                  </p>
                )}
              </article>
            </div>
            <article className="mt-6 rounded-[1.9rem] bg-white p-6 shadow-[0_18px_48px_-34px_rgba(12,100,53,0.42)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#079347]">
                    Compras
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    Histórico e parcelas
                  </h2>
                </div>
                {canManageSelected && (
                  <button
                    type="button"
                    onClick={() => void archiveCard(selectedCard)}
                    className="rounded-xl px-3 py-2 text-sm font-bold text-[#a14a4a] hover:bg-[#fff1f1] hover:text-[#863535]"
                  >
                    Arquivar cartão
                  </button>
                )}
              </div>
              {purchases.length ? (
                <div className="mt-5 divide-y divide-[#edf3ef]">
                  {purchases.map((purchase) => {
                    const currentNumber =
                      purchase.currentInstallment ??
                      purchase.installmentsList[0]?.number ??
                      1;
                    const installmentAmount =
                      purchase.installmentAmount ??
                      Number(
                        (
                          purchase.totalAmount / purchase.installments
                        ).toFixed(2),
                      );
                    const remaining = Math.max(
                      purchase.installments - currentNumber + 1,
                      0,
                    );
                    const progress =
                      purchase.installments === 1
                        ? "À vista · 1/1"
                        : `${currentNumber}/${purchase.installments} · ${currency.format(installmentAmount)} por parcela · ${remaining} ${remaining === 1 ? "restante" : "restantes"}`;

                    return (
                      <div className="py-4 first:pt-0" key={purchase.id}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold">
                              {purchase.description}
                            </p>
                            <p className="mt-1 text-xs text-[#789083]">
                              {purchase.category} ·{" "}
                              {new Date(
                                purchase.purchaseDate,
                              ).toLocaleDateString("pt-BR")}
                            </p>
                            <p className="mt-2 text-xs font-semibold text-[#5d786a]">
                              {progress}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-bold">
                              {currency.format(purchase.totalAmount)}
                            </p>
                            {canManageSelected && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openPurchaseForm(purchase)}
                                  className="rounded-lg px-2 py-1 text-xs font-bold text-[#087d3c] hover:bg-[#edf9f1]"
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void deletePurchase(purchase)}
                                  className="rounded-lg px-2 py-1 text-xs font-bold text-[#a14a4a] hover:bg-[#fff1f1]"
                                >
                                  Excluir compra
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl bg-[#f3f8f5] p-5 text-sm text-[#678176]">
                  Suas compras aparecerão aqui.
                </p>
              )}
            </article>
          </section>
        ) : (
          <section className="mt-7">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {cards
                .filter((card) => card.isActive)
                .map((card) => {
                  const next = (statementsByCard.get(card.id) || []).find(
                    (statement) => statement.amount > 0 && !statement.paidAt,
                  );
                  return (
                    <button
                      type="button"
                      onClick={() => setSelectedCard(card)}
                      key={card.id}
                      className="overflow-hidden rounded-[1.8rem] bg-white text-left shadow-[0_18px_48px_-34px_rgba(12,100,53,0.42)] transition hover:-translate-y-1"
                    >
                      <div
                        className="h-2"
                        style={{ backgroundColor: card.color }}
                      />
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold">{card.name}</p>
                            <p className="mt-1 text-xs text-[#789083]">
                              {card.issuer || "Cartão de crédito"} · ••••{" "}
                              {card.lastFour || "••••"}
                            </p>
                          </div>
                          <CreditCard
                            className="h-5 w-5"
                            style={{ color: card.color }}
                          />
                        </div>
                        <p className="mt-6 text-xs font-semibold text-[#789083]">
                          Próxima fatura
                        </p>
                        <p className="mt-1 text-xl font-bold">
                          {next ? currency.format(next.amount) : "Sem compras"}
                        </p>
                        <p className="mt-1 text-xs text-[#789083]">
                          {next
                            ? `Vence em ${new Date(next.dueDate).toLocaleDateString("pt-BR")}`
                            : `Limite ${currency.format(card.limit)}`}
                        </p>
                        {context.startsWith("team:") && (
                          <p className="mt-4 text-xs font-semibold text-[#087d3c]">
                            De {personName(card)}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
            {!cards.filter((card) => card.isActive).length && (
              <div className="mt-8 rounded-[2rem] border border-dashed border-[#cfe1d6] bg-white px-6 py-16 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#edf9f1] text-[#087d3c]">
                  <ReceiptText className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-xl font-semibold">
                  Seu primeiro cartão começa aqui.
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#718b7e]">
                  Cadastre o cartão, informe fechamento e vencimento e passe a
                  acompanhar suas faturas e parcelas.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCardFormOpen(true)}
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#0b9d4e] px-5 text-sm font-bold text-white hover:bg-[#078940]"
                >
                  <Plus className="h-4 w-4" /> Cadastrar cartão
                </button>
              </div>
            )}
          </section>
        )}
      </main>
      {isCardFormOpen && (
        <Modal
          title="Novo cartão"
          subtitle="O cartão fica no seu nome e aparece na visão familiar se você escolher esse contexto."
          onClose={() => setIsCardFormOpen(false)}
        >
          <form onSubmit={createCard} className="space-y-4">
            <Field label="Nome">
              <input
                required
                value={cardForm.name}
                onChange={(event) =>
                  setCardForm({ ...cardForm, name: event.target.value })
                }
                placeholder="Ex.: Nubank Platinum"
                className="input"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Emissor (opcional)">
                <input
                  value={cardForm.issuer}
                  onChange={(event) =>
                    setCardForm({ ...cardForm, issuer: event.target.value })
                  }
                  placeholder="Nubank"
                  className="input"
                />
              </Field>
              <Field label="Últimos 4 dígitos">
                <input
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  value={cardForm.lastFour}
                  onChange={(event) =>
                    setCardForm({
                      ...cardForm,
                      lastFour: event.target.value.replace(/\D/g, ""),
                    })
                  }
                  placeholder="1234"
                  className="input"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Limite">
                <input
                  required
                  min="0"
                  step="0.01"
                  type="number"
                  value={cardForm.limit}
                  onChange={(event) =>
                    setCardForm({ ...cardForm, limit: event.target.value })
                  }
                  placeholder="5000"
                  className="input"
                />
              </Field>
              <Field label="Fecha dia">
                <input
                  required
                  min="1"
                  max="28"
                  type="number"
                  value={cardForm.closingDay}
                  onChange={(event) =>
                    setCardForm({ ...cardForm, closingDay: event.target.value })
                  }
                  className="input"
                />
              </Field>
              <Field label="Vence dia">
                <input
                  required
                  min="1"
                  max="28"
                  type="number"
                  value={cardForm.dueDay}
                  onChange={(event) =>
                    setCardForm({ ...cardForm, dueDay: event.target.value })
                  }
                  className="input"
                />
              </Field>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-[#315f48]">Cor</p>
              <div className="grid grid-cols-6 gap-2">
                {CARD_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setCardForm({ ...cardForm, color });
                      setColorDraft(color);
                    }}
                    className={`h-8 w-8 rounded-full border-2 ${cardForm.color === color ? "border-[#17372b]" : "border-transparent"}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Escolher cor ${color}`}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#dbe9df] bg-[#f7faf8] p-2">
                <input
                  type="color"
                  value={cardForm.color}
                  onChange={(event) => {
                    const color = event.target.value.toUpperCase();
                    setCardForm({ ...cardForm, color });
                    setColorDraft(color);
                  }}
                  className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  aria-label="Escolher qualquer cor"
                />
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Código hexadecimal da cor</span>
                  <input
                    value={colorDraft}
                    onChange={(event) => {
                      const value = event.target.value.toUpperCase();
                      setColorDraft(value);
                      if (hexColorPattern.test(value)) {
                        setCardForm({ ...cardForm, color: value });
                      }
                    }}
                    onBlur={() => setColorDraft(cardForm.color)}
                    maxLength={7}
                    placeholder="#0B9D4E"
                    className="w-full bg-transparent font-mono text-sm font-semibold uppercase text-[#315f48] outline-none placeholder:text-[#9ab0a3]"
                  />
                </label>
                <span className="text-xs font-medium text-[#678176]">Qualquer cor</span>
              </div>
            </div>
            <ModalActions isSaving={isSaving} label="Criar cartão" />
          </form>
        </Modal>
      )}
      {isPurchaseFormOpen && selectedCard && (
        <Modal
          title={editingPurchase ? "Editar compra" : "Nova compra"}
          subtitle="A despesa entra na data da compra. As parcelas projetam somente o que ainda falta nas próximas faturas."
          onClose={() => {
            setIsPurchaseFormOpen(false);
            setEditingPurchase(null);
            setCurrentInstallmentWasEdited(false);
          }}
        >
          <form onSubmit={savePurchase} className="space-y-4">
            <Field label="Descrição">
              <input
                required
                value={purchaseForm.description}
                onChange={(event) =>
                  setPurchaseForm({
                    ...purchaseForm,
                    description: event.target.value,
                  })
                }
                placeholder="Ex.: Passagens da viagem"
                className="input"
              />
            </Field>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-[#315f48]">
                Forma de pagamento
              </legend>
              <div
                className="grid grid-cols-2 rounded-xl border border-[#dbe9df] bg-[#f7faf8] p-1"
                role="radiogroup"
                aria-label="Forma de pagamento"
              >
                {(
                  [
                    ["CASH", "À vista"],
                    ["INSTALLMENT", "Parcelada"],
                  ] as const
                ).map(([mode, label]) => (
                  <label
                    key={mode}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${purchaseForm.mode === mode ? "bg-white text-[#087d3c] shadow-sm" : "text-[#678176]"}`}
                  >
                    <input
                      type="radio"
                      name="purchase-mode"
                      value={mode}
                      checked={purchaseForm.mode === mode}
                      onChange={() => changePurchaseMode(mode)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={
                  isInstallmentPurchase
                    ? "Valor de cada parcela"
                    : "Valor da compra"
                }
              >
                <input
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={purchaseForm.amountPerInstallment}
                  onChange={(event) =>
                    setPurchaseForm({
                      ...purchaseForm,
                      amountPerInstallment: event.target.value,
                    })
                  }
                  placeholder="0,00"
                  className="input"
                />
              </Field>
              <Field label="Data da compra">
                <input
                  required
                  type="date"
                  value={purchaseForm.purchaseDate}
                  onChange={(event) => updatePurchaseDate(event.target.value)}
                  className="input"
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Categoria">
                <select
                  value={purchaseForm.category}
                  onChange={(event) =>
                    setPurchaseForm({
                      ...purchaseForm,
                      category: event.target.value,
                    })
                  }
                  className="input"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </Field>
              {isInstallmentPurchase && (
                <Field label="Quantidade de parcelas">
                  <input
                    required
                    min="1"
                    max="48"
                    type="number"
                    value={purchaseForm.installments}
                    onChange={(event) =>
                      updateInstallmentCount(event.target.value)
                    }
                    className="input"
                  />
                </Field>
              )}
            </div>
            {isInstallmentPurchase ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Parcela atual">
                  <input
                    required
                    min="1"
                    max={installmentCount}
                    type="number"
                    value={purchaseForm.currentInstallment}
                    onChange={(event) => {
                      setCurrentInstallmentWasEdited(true);
                      setPurchaseForm({
                        ...purchaseForm,
                        currentInstallment: String(
                          clampNumber(event.target.value, 1, installmentCount),
                        ),
                      });
                    }}
                    className="input"
                  />
                </Field>
                <div className="rounded-xl bg-[#f3f8f5] px-4 py-3 text-sm text-[#315f48]">
                  <p className="font-semibold">Total da compra</p>
                  <p className="mt-1 text-lg font-bold">
                    {currency.format(totalAmount)}
                  </p>
                  <p className="mt-1 text-xs text-[#678176]">
                    Progresso: {currentInstallment}/{installmentCount}
                  </p>
                </div>
              </div>
            ) : (
              <p className="rounded-xl bg-[#f3f8f5] px-4 py-3 text-sm text-[#315f48]">
                Compra à vista · 1/1
              </p>
            )}
            <ModalActions
              isSaving={isSaving}
              label={editingPurchase ? "Salvar compra" : "Registrar compra"}
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-[#17372b]/35 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full rounded-t-[2rem] bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-[2rem] sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#079347]">
              Cartões
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#678176]">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[#718b7e] hover:bg-[#edf8f1]"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#315f48]">
        {label}
      </span>
      {children}
    </label>
  );
}
function ModalActions({
  isSaving,
  label,
}: {
  isSaving: boolean;
  label: string;
}) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0b9d4e] px-5 text-sm font-semibold text-white hover:bg-[#078940] disabled:opacity-60"
      >
        {isSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {isSaving ? "Salvando..." : label}
      </button>
    </div>
  );
}
