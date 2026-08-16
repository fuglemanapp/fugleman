"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Circle, Sparkles } from "lucide-react";

type Setup = {
  transactionCount: number;
  eventCount: number;
  importedTransactionCount: number;
};

const goals = [
  { value: "ORGANIZE_SPENDING", label: "Organizar meus gastos" },
  { value: "PLAN_MONTH", label: "Planejar meu mês" },
  { value: "CENTRALIZE_ROUTINE", label: "Centralizar minha rotina" },
] as const;

export function OnboardingChecklist({ setup }: { setup: Setup }) {
  const [selectedGoal, setSelectedGoal] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setSelectedGoal(window.localStorage.getItem("whatspent:onboarding:goal") || "");
    setCompleted(window.localStorage.getItem("whatspent:onboarding:completed") === "true");
  }, []);

  if (completed) {
    return null;
  }

  const steps = [
    { label: "Escolha seu foco", completed: Boolean(selectedGoal), href: "#objetivo" },
    { label: "Registre uma movimentação", completed: setup.transactionCount > 0, href: "/dashboard/financeiro/transacoes" },
    { label: "Planeje um compromisso", completed: setup.eventCount > 0, href: "/dashboard/agenda" },
    { label: "Importe um extrato (opcional)", completed: setup.importedTransactionCount > 0, href: "/dashboard/financeiro/transacoes#importar-extrato", optional: true },
  ];
  const completedSteps = steps.filter((step) => step.completed).length;

  function selectGoal(goal: string) {
    setSelectedGoal(goal);
    window.localStorage.setItem("whatspent:onboarding:goal", goal);
  }

  function complete() {
    window.localStorage.setItem("whatspent:onboarding:completed", "true");
    setCompleted(true);
  }

  return (
    <section className="mt-6 overflow-hidden rounded-[2rem] border border-[#cfe5d6] bg-white shadow-[0_24px_60px_-46px_rgba(12,100,53,0.52)]">
      <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#e8f7ec] text-[#087d3c]"><Sparkles className="h-5 w-5" /></span>
            <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#079347]">Comece por aqui</p><h2 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[#17372b]">Vamos deixar o WhatSpent do seu jeito.</h2></div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#678176]">Leva poucos minutos. Você pode continuar usando o painel enquanto configura o essencial.</p>
          <fieldset id="objetivo" className="mt-5"><legend className="text-sm font-semibold text-[#315f48]">Seu principal objetivo</legend><div className="mt-3 flex flex-wrap gap-2">{goals.map((goal) => <button key={goal.value} type="button" onClick={() => selectGoal(goal.value)} className={`rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${selectedGoal === goal.value ? "border-[#0b9d4e] bg-[#edf9f1] text-[#087d3c]" : "border-[#dcebe2] text-[#5f7d6e] hover:border-[#a9d6b8] hover:bg-[#f7fbf8]"}`}>{goal.label}</button>)}</div></fieldset>
        </div>
        <div className="rounded-2xl bg-[#f4f9f5] p-5"><div className="flex items-center justify-between"><p className="text-sm font-bold text-[#315f48]">Seu progresso</p><span className="text-sm font-bold text-[#087d3c]">{completedSteps}/{steps.length}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dcebe2]"><div className="h-full rounded-full bg-[#0b9d4e] transition-all" style={{ width: `${(completedSteps / steps.length) * 100}%` }} /></div><div className="mt-5 space-y-3">{steps.map((step) => <Link key={step.label} href={step.href} className="flex items-center gap-2 text-sm text-[#4f6f60] hover:text-[#087d3c]"><span className={`grid h-5 w-5 place-items-center rounded-full ${step.completed ? "bg-[#0b9d4e] text-white" : "border border-[#b9d5c2] bg-white text-transparent"}`}>{step.completed ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}</span><span className={step.completed ? "line-through opacity-60" : "font-medium"}>{step.label}</span>{step.optional && <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-[#93a89c]">Opcional</span>}</Link>)}</div><button type="button" onClick={complete} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#087d3c] hover:text-[#056c35]">Concluir configuração <ArrowRight className="h-4 w-4" /></button></div>
      </div>
    </section>
  );
}
