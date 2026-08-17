import Link from "next/link";
import { ArrowRight, CalendarClock, ChartNoAxesCombined, Sparkles } from "lucide-react";

const nextSteps = [
  {
    icon: ChartNoAxesCombined,
    title: "Acompanhe o mês",
    description: "Veja categorias, faturas e o saldo real para decidir seus próximos passos.",
    href: "/dashboard/financeiro/relatorios",
    action: "Abrir relatórios",
  },
  {
    icon: Sparkles,
    title: "Automatize lançamentos",
    description: "Crie regras para categorizar transações assim que elas entram no WhatSpent.",
    href: "/dashboard/financeiro/regras",
    action: "Criar regra",
  },
  {
    icon: CalendarClock,
    title: "Planeje recorrências",
    description: "Registre entradas e gastos previstos como transações e acompanhe o impacto no mês.",
    href: "/dashboard/financeiro/transacoes",
    action: "Adicionar transação",
  },
];

export default function FinancialPlanningPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f6faf7] px-4 py-8 text-[#17372b] sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-[2rem] border border-[#dcebe2] bg-white px-6 py-7 shadow-[0_18px_48px_-34px_rgba(12,100,53,0.42)] sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#079347]">Planejamento financeiro</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Organize o mês antes dele acontecer.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#648273] sm:text-base">
            Use seus lançamentos, regras e relatórios para manter gastos recorrentes, cartões e objetivos sob controle.
          </p>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {nextSteps.map(({ icon: Icon, title, description, href, action }) => (
            <article key={title} className="flex min-h-64 flex-col rounded-[1.6rem] border border-[#dcebe2] bg-white p-6 shadow-[0_18px_48px_-34px_rgba(12,100,53,0.32)]">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf9f1] text-[#087d3c]"><Icon className="h-5 w-5" /></span>
              <h2 className="mt-5 text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#678176]">{description}</p>
              <Link href={href} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#087d3c] hover:text-[#056d31]">
                {action} <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
