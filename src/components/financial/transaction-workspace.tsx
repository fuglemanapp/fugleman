"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LoaderCircle,
  Plus,
  ReceiptText,
  Trash2,
  X,
} from "lucide-react";

import {
  FinancialContextSwitcher,
  type FinancialWorkspace,
} from "@/components/financial/financial-context-switcher";

type Activity = {
  id: string;
  kind: "TRANSACTION" | "CARD_INSTALLMENT";
  amount: number;
  description: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  date: string;
  canDelete: boolean;
  cardId?: string;
  cardName?: string;
  cardLastFour?: string | null;
  installmentLabel?: string;
};
type CardPurchase = {
  id: string;
  description: string;
  category: string;
  totalAmount: number;
  purchaseDate: string;
  installments: number;
  cardName: string;
  cardLastFour: string | null;
};

type TransactionForm = {
  description: string;
  category: string;
  type: "EXPENSE" | "INCOME";
  amount: string;
  date: string;
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

function monthStart(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
}

function monthRange(month: Date) {
  const start = monthStart(month);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  return { start, end };
}

function formatInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultForm(month: Date): TransactionForm {
  return {
    description: "",
    category: categories[0],
    type: "EXPENSE",
    amount: "",
    date: formatInputDate(monthStart(month)),
  };
}

export function TransactionWorkspace() {
  const [context, setContext] = useState("personal");
  const [workspaces, setWorkspaces] = useState<FinancialWorkspace[]>([]);
  const [month, setMonth] = useState(() => monthStart(new Date()));
  const [activities, setActivities] = useState<Activity[]>([]);
  const [cardPurchases, setCardPurchases] = useState<CardPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<TransactionForm>(() => defaultForm(new Date()));

  const range = useMemo(() => monthRange(month), [month]);
  const label = useMemo(
    () => month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    [month],
  );

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        context,
        from: range.start.toISOString(),
        to: range.end.toISOString(),
      });
      const response = await fetch(`/api/transactions?${params}`, { cache: "no-store" });
      const data = (await response.json()) as { transactions?: Activity[]; cardPurchases?: CardPurchase[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível carregar suas transações.");
      setActivities(data.transactions || []);
      setCardPurchases(data.cardPurchases || []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível carregar suas transações.");
      setActivities([]);
      setCardPurchases([]);
    } finally {
      setIsLoading(false);
    }
  }, [context, range.end, range.start]);

  useEffect(() => {
    void fetch("/api/financial/workspaces", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { workspaces?: FinancialWorkspace[] }) => setWorkspaces(data.workspaces || []))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const totals = useMemo(
    () => activities.reduce(
      (summary, activity) => {
        if (activity.type === "INCOME") summary.income += activity.amount;
        else summary.expense += activity.amount;
        return summary;
      },
      { income: 0, expense: 0 },
    ),
    [activities],
  );
  const cardPurchaseTotal = useMemo(
    () => cardPurchases.reduce((total, purchase) => total + purchase.totalAmount, 0),
    [cardPurchases],
  );

  const changeMonth = (offset: number) => {
    setMonth((current) => new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + offset, 1)));
  };

  const openForm = () => {
    setForm(defaultForm(month));
    setError("");
    setIsFormOpen(true);
  };

  async function createTransaction(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount.replace(",", ".")), context }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível salvar a transação.");
      setIsFormOpen(false);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível salvar a transação.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteTransaction(id: string) {
    if (!window.confirm("Excluir este lançamento?")) return;
    setError("");
    try {
      const params = new URLSearchParams({ id, context });
      const response = await fetch(`/api/transactions?${params}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Não foi possível excluir a transação.");
      }
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível excluir a transação.");
    }
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f6faf7] px-4 py-8 text-[#17372b] sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[2rem] border border-[#dcebe2] bg-white px-6 py-7 shadow-[0_18px_48px_-34px_rgba(12,100,53,0.42)] sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#079347]">Financeiro</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Minhas transações</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#648273] sm:text-base">Lançamentos avulsos e parcelas de cartões aparecem no mês em que impactam sua fatura.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <FinancialContextSwitcher workspaces={workspaces} value={context} onChange={setContext} />
              <button type="button" onClick={openForm} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#099447] px-4 text-sm font-bold text-white shadow-[0_14px_26px_-14px_rgba(9,148,71,0.9)] transition-colors hover:bg-[#087d3c]"><Plus className="h-4 w-4" />Nova transação</button>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[1.7rem] border border-[#dcebe2] bg-white p-4 shadow-[0_18px_48px_-34px_rgba(12,100,53,0.32)] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => changeMonth(-1)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#dcebe2] text-[#315f48] hover:bg-[#f0f8f3]" aria-label="Mês anterior"><ChevronLeft className="h-5 w-5" /></button>
            <div className="text-center"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7b9688]">Período selecionado</p><h2 className="mt-1 text-lg font-bold capitalize">{label}</h2></div>
            <button type="button" onClick={() => changeMonth(1)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#dcebe2] text-[#315f48] hover:bg-[#f0f8f3]" aria-label="Próximo mês"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Entradas" value={totals.income} tone="green" />
            <SummaryCard label="Saídas" value={totals.expense} tone="red" />
            <SummaryCard label="Saldo do mês" value={totals.income - totals.expense} tone={totals.income - totals.expense >= 0 ? "green" : "red"} />
            <SummaryCard label="Compras no cartão" value={cardPurchaseTotal} tone="blue" />
          </div>
        </section>

        {error && <p role="alert" className="mt-5 rounded-2xl border border-[#f2c7c2] bg-[#fff3f1] px-4 py-3 text-sm font-semibold text-[#bd3c31]">{error}</p>}

        {cardPurchases.length > 0 && <section className="mt-6 overflow-hidden rounded-[1.7rem] border border-[#d7e5f6] bg-white shadow-[0_18px_48px_-34px_rgba(12,100,53,0.32)]">
          <div className="border-b border-[#e5eef7] px-6 py-5"><h2 className="text-lg font-bold">Compras realizadas no cartão</h2><p className="mt-1 text-sm text-[#67839a]">Elas aparecem na fatura projetada do cartão e ficam separadas das saídas para não duplicar seus gastos.</p></div>
          <ul className="divide-y divide-[#e8f0f8]">{cardPurchases.map((purchase) => <li key={purchase.id} className="flex items-center gap-4 px-6 py-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#edf4ff] text-[#2865ad]"><CreditCard className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="truncate font-bold">{purchase.description}</p><p className="mt-0.5 text-sm text-[#67839a]">{purchase.cardName}{purchase.cardLastFour ? ` •••• ${purchase.cardLastFour}` : ""} · {purchase.category} · {new Date(purchase.purchaseDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}{purchase.installments > 1 ? ` · ${purchase.installments} parcelas` : ""}</p></div><strong className="shrink-0 text-[#17372b]">{currency.format(purchase.totalAmount)}</strong></li>)}</ul>
        </section>}

        <section className="mt-6 overflow-hidden rounded-[1.7rem] border border-[#dcebe2] bg-white shadow-[0_18px_48px_-34px_rgba(12,100,53,0.32)]">
          <div className="border-b border-[#e5efe9] px-6 py-5"><h2 className="text-lg font-bold">Lançamentos de {label}</h2></div>
          {isLoading ? <div className="grid min-h-64 place-items-center text-[#638072]"><LoaderCircle className="h-7 w-7 animate-spin" /></div> : activities.length === 0 ? <div className="grid min-h-64 place-items-center px-6 text-center"><ReceiptText className="h-9 w-9 text-[#79a38c]" /><div><p className="mt-4 font-bold">Nenhum lançamento neste mês</p><p className="mt-1 text-sm text-[#789083]">As parcelas futuras aparecem automaticamente assim que uma compra no cartão é criada.</p></div></div> : <ul className="divide-y divide-[#edf3ef]">{activities.map((activity) => <li key={activity.id} className="flex items-center gap-4 px-6 py-4"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${activity.kind === "CARD_INSTALLMENT" ? "bg-[#edf4ff] text-[#2865ad]" : activity.type === "INCOME" ? "bg-[#e9f9ee] text-[#087d3c]" : "bg-[#fff1ef] text-[#c95445]"}`}>{activity.kind === "CARD_INSTALLMENT" ? <CreditCard className="h-5 w-5" /> : <ReceiptText className="h-5 w-5" />}</span><div className="min-w-0 flex-1"><p className="truncate font-bold">{activity.description}</p><p className="mt-0.5 text-sm text-[#789083]">{activity.kind === "CARD_INSTALLMENT" ? `${activity.cardName}${activity.cardLastFour ? ` •••• ${activity.cardLastFour}` : ""} · parcela ${activity.installmentLabel}` : `${activity.category} · ${new Date(activity.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}`}</p></div><div className="flex items-center gap-3"><strong className={activity.type === "INCOME" ? "text-[#087d3c]" : "text-[#17372b]"}>{activity.type === "INCOME" ? "+" : "−"}{currency.format(activity.amount)}</strong>{activity.canDelete && <button type="button" onClick={() => void deleteTransaction(activity.id)} className="rounded-xl p-2 text-[#8ba196] hover:bg-[#fff1ef] hover:text-[#c95445]" aria-label={`Excluir ${activity.description}`}><Trash2 className="h-4 w-4" /></button>}</div></li>)}</ul>}
        </section>
      </div>

      {isFormOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#123323]/35 p-4"><form onSubmit={createTransaction} className="w-full max-w-lg rounded-[1.8rem] bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#079347]">Novo lançamento</p><h2 className="mt-1 text-xl font-bold">Adicionar transação</h2></div><button type="button" onClick={() => setIsFormOpen(false)} className="rounded-xl p-2 text-[#638072] hover:bg-[#f2f8f4]" aria-label="Fechar"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-4"><label className="grid gap-1.5 text-sm font-semibold">Descrição<input required maxLength={140} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="h-11 rounded-xl border border-[#cfe1d6] px-3 outline-none focus:border-[#099447]" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-semibold">Tipo<select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as TransactionForm["type"] }))} className="h-11 rounded-xl border border-[#cfe1d6] px-3 outline-none focus:border-[#099447]"><option value="EXPENSE">Saída</option><option value="INCOME">Entrada</option></select></label><label className="grid gap-1.5 text-sm font-semibold">Valor<input required min="0.01" step="0.01" inputMode="decimal" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} className="h-11 rounded-xl border border-[#cfe1d6] px-3 outline-none focus:border-[#099447]" /></label></div><label className="grid gap-1.5 text-sm font-semibold">Categoria<select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="h-11 rounded-xl border border-[#cfe1d6] px-3 outline-none focus:border-[#099447]">{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label className="grid gap-1.5 text-sm font-semibold">Data<input required type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="h-11 rounded-xl border border-[#cfe1d6] px-3 outline-none focus:border-[#099447]" /></label></div><button disabled={isSaving} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#099447] px-4 text-sm font-bold text-white disabled:opacity-60">{isSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}Salvar transação</button></form></div>}
    </main>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number; tone: "green" | "red" | "blue" }) {
  const negative = value < 0;
  const styles = tone === "green"
    ? "border-[#ccebd8] bg-[#f0fbf4]"
    : tone === "blue"
      ? "border-[#d4e3f4] bg-[#f2f7ff]"
      : "border-[#f2d6d1] bg-[#fff6f4]";
  const valueTone = tone === "green" && !negative ? "text-[#087d3c]" : tone === "blue" ? "text-[#2865ad]" : "text-[#c95445]";
  return <article className={`rounded-2xl border p-4 ${styles}`}><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#789083]">{label}</p><p className={`mt-2 text-xl font-bold ${valueTone}`}>{currency.format(value)}</p></article>;
}
