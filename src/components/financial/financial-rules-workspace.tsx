"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { LoaderCircle, Plus, Power, Trash2 } from "lucide-react";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";

type Rule = { id: string; matchText: string; category: string; type: string | null; isActive: boolean };
const categories = ["Alimentação", "Moradia", "Transporte", "Saúde", "Educação", "Lazer", "Assinaturas", "Compras", "Transferências", "Investimentos", "Receitas", "Outros"];

export function FinancialRulesWorkspace() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [matchText, setMatchText] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [type, setType] = useState<"" | "INCOME" | "EXPENSE">("EXPENSE");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadRules = useCallback(async () => {
    setIsLoading(true); setError("");
    try { const response = await fetch("/api/financial/rules"); const data = await response.json() as { rules?: Rule[]; error?: string }; if (!response.ok) throw new Error(data.error || "Não foi possível carregar as regras."); setRules(data.rules || []); } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível carregar as regras."); } finally { setIsLoading(false); }
  }, []);
  useEffect(() => { void loadRules(); }, [loadRules]);

  async function saveRule(event: FormEvent) {
    event.preventDefault(); setIsSaving(true); setError("");
    try { const response = await fetch("/api/financial/rules", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ matchText, category, type: type || null }) }); const data = await response.json() as { rule?: Rule; error?: string }; const created = data.rule; if (!response.ok || !created) throw new Error(data.error || "Não foi possível salvar a regra."); setRules((current) => [...current, created]); setMatchText(""); } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível salvar a regra."); } finally { setIsSaving(false); }
  }

  async function updateRule(rule: Rule, isActive: boolean) {
    const response = await fetch("/api/financial/rules", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: rule.id, isActive }) });
    const data = await response.json() as { rule?: Rule; error?: string };
    const updated = data.rule;
    if (!response.ok || !updated) { setError(data.error || "Não foi possível alterar a regra."); return; }
    setRules((current) => current.map((item) => item.id === rule.id ? updated : item));
  }

  async function removeRule(id: string) {
    const response = await fetch(`/api/financial/rules?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) { setError("Não foi possível remover a regra."); return; }
    setRules((current) => current.filter((rule) => rule.id !== id));
  }

  return <div className="min-h-[100dvh] bg-[#f6faf7] text-[#17372b]"><DashboardNav activePath="/dashboard/financeiro/regras" /><main className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-10 lg:py-10"><header><p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#079347]">Automação</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Regras que poupam seu tempo.</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#678176] sm:text-base">Crie uma regra e o WhatSpent sugere categoria e tipo quando você registrar ou importar uma movimentação. Cada regra é pessoal.</p></header>{error && <p className="mt-6 rounded-xl bg-[#fff1f1] px-4 py-3 text-sm text-[#a93636]">{error}</p>}<section className="mt-7 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><form onSubmit={saveRule} className="rounded-[1.8rem] bg-[#173e2d] p-6 text-white shadow-[0_24px_56px_-38px_rgba(12,73,43,0.72)]"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9be7b6]">Nova regra</p><h2 className="mt-2 text-xl font-semibold">Quando a descrição tiver…</h2><div className="mt-6 space-y-4"><label className="block text-sm font-semibold">Texto da descrição<input required maxLength={100} value={matchText} onChange={(event) => setMatchText(event.target.value)} placeholder="Ex.: iFood" className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/45 outline-none focus:border-[#d8ff8e] focus:ring-4 focus:ring-[#d8ff8e]/15" /></label><label className="block text-sm font-semibold">Categoria<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none"><option className="text-[#17372b]">{categories[0]}</option>{categories.slice(1).map((item) => <option className="text-[#17372b]" key={item}>{item}</option>)}</select></label><label className="block text-sm font-semibold">Tipo<select value={type} onChange={(event) => setType(event.target.value as typeof type)} className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none"><option className="text-[#17372b]" value="EXPENSE">Saída</option><option className="text-[#17372b]" value="INCOME">Entrada</option><option className="text-[#17372b]" value="">Não alterar</option></select></label><button disabled={isSaving} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#d8ff8e] px-4 text-sm font-bold text-[#174429] transition hover:bg-[#e5ffad] disabled:opacity-60">{isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{isSaving ? "Salvando..." : "Criar regra"}</button></div></form><section className="rounded-[1.8rem] bg-white p-6 shadow-[0_18px_48px_-34px_rgba(12,100,53,0.42)]"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#079347]">Suas regras</p><h2 className="mt-2 text-xl font-semibold">Categorias automáticas</h2></div>{isLoading ? <div className="grid min-h-56 place-items-center"><LoaderCircle className="h-6 w-6 animate-spin text-[#079347]" /></div> : rules.length ? <div className="mt-6 divide-y divide-[#edf3ef]">{rules.map((rule) => <article key={rule.id} className="flex flex-wrap items-center gap-3 py-4 first:pt-0"><div className="min-w-0 flex-1"><p className="text-sm font-bold">“{rule.matchText}” <span className="font-medium text-[#789083]">→</span> {rule.category}</p><p className="mt-1 text-xs text-[#789083]">{rule.type === "INCOME" ? "Marca como entrada" : rule.type === "EXPENSE" ? "Marca como saída" : "Mantém o tipo original"}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${rule.isActive ? "bg-[#e7f8ed] text-[#087d3c]" : "bg-[#eef1ef] text-[#728377]"}`}>{rule.isActive ? "Ativa" : "Pausada"}</span><button type="button" onClick={() => void updateRule(rule, !rule.isActive)} className="rounded-xl p-2 text-[#607b6e] hover:bg-[#edf8f1] hover:text-[#087d3c]" aria-label={rule.isActive ? "Pausar regra" : "Ativar regra"}><Power className="h-4 w-4" /></button><button type="button" onClick={() => void removeRule(rule.id)} className="rounded-xl p-2 text-[#8ba096] hover:bg-[#fff1f1] hover:text-[#b44747]" aria-label="Excluir regra"><Trash2 className="h-4 w-4" /></button></article>)}</div> : <p className="mt-6 rounded-2xl bg-[#f3f8f5] p-5 text-sm leading-relaxed text-[#678176]">Ainda não há regras. Comece pelas descrições que aparecem sempre no seu extrato.</p>}</section></section></main></div>;
}
