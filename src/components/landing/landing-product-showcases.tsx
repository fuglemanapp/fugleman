import React from "react";
import { ArrowUpRight, CalendarClock, CheckCircle2, CircleDollarSign, FileText, ListChecks, MoreHorizontal, ReceiptText, WalletCards } from "lucide-react";
import { LandingPhone } from "./landing-phone";

const categoryRows = [
  { label: "Alimentação", value: "R$ 648,00", width: "w-[78%]", color: "bg-[#00c853]" },
  { label: "Moradia", value: "R$ 510,00", width: "w-[62%]", color: "bg-[#087d3c]" },
  { label: "Transporte", value: "R$ 286,00", width: "w-[35%]", color: "bg-[#80d89b]" },
];

const appointments = [
  { time: "09:30", title: "Reunião de planejamento", tag: "Trabalho" },
  { time: "14:00", title: "Consulta", tag: "Pessoal" },
  { time: "17:00", title: "Lembrete: pagar fatura", tag: "Finanças" },
];

export function LandingProductShowcases() {
  return (
    <div className="overflow-hidden bg-[#f8fcf9] py-20 sm:py-28">
      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10" id="financas" aria-labelledby="financas-title">
        <div className="grid gap-12 rounded-[2rem] bg-white p-6 shadow-[0_28px_80px_-48px_rgba(6,61,36,.58)] sm:p-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:p-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f9ed] px-3 py-1.5 text-xs font-bold text-[#087d3c]"><CircleDollarSign aria-hidden="true" className="size-4" />Finanças</span>
            <h2 className="mt-6 text-balance text-4xl font-semibold tracking-[-.055em] text-[#063d24]" id="financas-title">O retrato do mês, sem montar planilha.</h2>
            <p className="mt-5 text-lg leading-relaxed text-[#5e806d]">Veja lançamentos, categorias e o que entrou ou saiu. A informação fica disponível no mesmo espaço em que você conversa com o WhatSpent.</p>
            <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-[#087d3c]"><CheckCircle2 aria-hidden="true" className="size-4" />Painel privado para sua conta</div>
          </div>
          <div className="rounded-[1.6rem] border border-[#dcefe2] bg-[#f7fcf8] p-4 sm:p-6">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#749486]">Agosto de 2026</p><h3 className="mt-1 text-xl font-semibold text-[#063d24]">Visão financeira</h3></div><MoreHorizontal aria-hidden="true" className="size-5 text-[#769487]" /></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3"><Metric label="Entradas" tone="text-[#087d3c]" value="R$ 4.820,00" /><Metric label="Saídas" tone="text-[#cd5c51]" value="R$ 2.436,00" /><Metric label="Saldo do mês" tone="text-[#063d24]" value="R$ 2.384,00" /></div>
            <div className="mt-5 rounded-2xl bg-white p-4"><p className="text-sm font-semibold text-[#063d24]">Para onde foi o seu mês</p><div className="mt-4 space-y-3">{categoryRows.map((row) => <div key={row.label}><div className="flex justify-between text-xs text-[#5e806d]"><span>{row.label}</span><strong className="font-semibold text-[#315a41]">{row.value}</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e5f2e9]"><div className={`h-full rounded-full ${row.color} ${row.width}`} /></div></div>)}</div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-28 sm:px-8 lg:px-10" id="cartoes" aria-labelledby="cartoes-title">
        <div className="grid gap-12 lg:grid-cols-[1.14fr_.86fr] lg:items-center">
          <div className="relative min-h-[500px] rounded-[2rem] bg-[#063d24] p-6 sm:p-10"><div aria-hidden="true" className="absolute right-0 top-0 size-80 rounded-full border border-[#72e99b]/15" /><p className="relative text-xs font-bold uppercase tracking-[.18em] text-[#7ce6a1]">Cartões e faturas</p><div className="relative mt-8 grid gap-4 sm:grid-cols-2"><CardPreview className="bg-[linear-gradient(135deg,#0c8a46,#06482c)]" name="Cartão principal" number="•••• 2860" /><CardPreview className="bg-[linear-gradient(135deg,#254a88,#15294c)] sm:translate-y-10" name="Cartão extra" number="•••• 5515" /></div><div className="relative mt-8 rounded-2xl border border-white/10 bg-white/[.08] p-4 backdrop-blur-sm"><div className="flex items-center justify-between text-sm"><span className="text-[#bce9ca]">Limite acompanhado</span><strong className="text-white">R$ 8.500,00 disponíveis</strong></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full w-[42%] rounded-full bg-[#00c853]" /></div></div></div>
          <div><span className="inline-flex items-center gap-2 rounded-full bg-[#e7f9ed] px-3 py-1.5 text-xs font-bold text-[#087d3c]"><WalletCards aria-hidden="true" className="size-4" />Cartões</span><h2 className="mt-6 text-balance text-4xl font-semibold tracking-[-.055em] text-[#063d24]" id="cartoes-title">Cada compra no mês que importa.</h2><p className="mt-5 text-lg leading-relaxed text-[#5e806d]">Compras e parcelas aparecem na fatura correspondente. Assim, você enxerga as próximas cobranças antes do fechamento.</p><div className="mt-8 rounded-[1.5rem] border border-[#d8efdf] bg-white p-5 shadow-[0_22px_50px_-38px_rgba(6,61,36,.65)]"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.13em] text-[#00a646]">Fatura projetada</p><h3 className="mt-2 text-lg font-semibold text-[#063d24]">Setembro de 2026</h3><p className="mt-1 text-sm text-[#6c8d7a]">Vence em 17/09</p></div><strong className="text-xl text-[#063d24]">R$ 1.248,30</strong></div><div className="mt-5 space-y-3 border-t border-[#e5f1e8] pt-4 text-sm"><StatementRow name="Mercado" meta="Compra no cartão" value="R$ 82,00" /><StatementRow name="Farmácia" meta="Parcela 2 de 3" value="R$ 64,50" /><StatementRow name="Curso" meta="Parcela 4 de 10" value="R$ 118,90" /></div></div></div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-28 sm:px-8 lg:px-10" id="agenda" aria-labelledby="agenda-title">
        <div className="grid gap-10 rounded-[2rem] border border-[#d8efdf] bg-white p-6 sm:p-10 lg:grid-cols-[.83fr_.72fr_.7fr] lg:p-12"><div><span className="inline-flex items-center gap-2 rounded-full bg-[#e7f9ed] px-3 py-1.5 text-xs font-bold text-[#087d3c]"><CalendarClock aria-hidden="true" className="size-4" />Agenda</span><h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-.05em] text-[#063d24]" id="agenda-title">Seu próximo compromisso não precisa ficar na cabeça.</h2><p className="mt-5 leading-relaxed text-[#5e806d]">Registre e consulte compromissos no mesmo contexto em que cuida das finanças.</p></div><div className="rounded-[1.5rem] bg-[#f5fcf7] p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#749486]">Próximos compromissos</p><div className="mt-5 space-y-4">{appointments.map(({ tag, time, title }) => <div className="flex gap-3" key={title}><span className="pt-0.5 text-sm font-bold text-[#087d3c]">{time}</span><div className="border-l border-[#bde5ca] pl-3"><p className="text-sm font-semibold text-[#173d2a]">{title}</p><p className="mt-1 text-xs text-[#70907d]">{tag}</p></div></div>)}</div></div><div className="flex items-center justify-center rounded-[1.5rem] bg-[#eafaf0] p-5"><LandingPhone compact scenario="agenda" /></div></div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:mt-28 sm:px-8 lg:px-10" id="organizacao" aria-labelledby="organizacao-title">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><span className="inline-flex items-center gap-2 rounded-full bg-[#e7f9ed] px-3 py-1.5 text-xs font-bold text-[#087d3c]"><ListChecks aria-hidden="true" className="size-4" />Organização</span><h2 className="mt-6 text-balance text-4xl font-semibold tracking-[-.055em] text-[#063d24]" id="organizacao-title">Projetos, tarefas, notas e arquivos no mesmo espaço.</h2><p className="mt-5 text-lg leading-relaxed text-[#5e806d]">Nem tudo que importa é uma conta. Reúna pendências, referências e planos para transformar rotina em acompanhamento.</p><a className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#087d3c]" href="#como-funciona">Conheça o fluxo completo <ArrowUpRight aria-hidden="true" className="size-4" /></a></div><div className="grid gap-4 sm:grid-cols-2"><OrganizeCard icon={ListChecks} label="Projeto" title="Casa em ordem" detail="4 tarefas em andamento" tone="bg-[#eafaf0]" /><OrganizeCard icon={CheckCircle2} label="Tarefa" title="Revisar orçamento" detail="Hoje · prioridade alta" tone="bg-[#f7f3ff]" /><OrganizeCard icon={FileText} label="Nota" title="Lista de prioridades" detail="Atualizada agora" tone="bg-[#fff8e8]" /><OrganizeCard icon={ReceiptText} label="Arquivo" title="comprovante.pdf" detail="Anexado ao lançamento" tone="bg-[#edf5ff]" /></div></div>
      </section>
    </div>
  );
}

function Metric({ label, tone, value }: { label: string; tone: string; value: string }) { return <div className="rounded-2xl bg-white p-4"><p className="text-xs font-semibold text-[#749486]">{label}</p><p className={`mt-2 text-lg font-semibold ${tone}`}>{value}</p></div>; }
function CardPreview({ className, name, number }: { className: string; name: string; number: string }) { return <div className={`min-h-[172px] rounded-[1.5rem] p-5 text-white shadow-xl ${className}`}><div className="flex size-9 items-center justify-center rounded-lg border border-white/30"><span className="h-3 w-5 rounded-sm border border-white/80" /></div><p className="mt-9 text-sm text-white/70">{name}</p><p className="mt-1 text-lg font-semibold tracking-[.15em]">{number}</p><p className="mt-6 text-xs text-white/70">WhatSpent</p></div>; }
function StatementRow({ meta, name, value }: { meta: string; name: string; value: string }) { return <div className="flex items-center justify-between gap-4"><div><p className="font-medium text-[#315a41]">{name}</p><p className="text-xs text-[#789487]">{meta}</p></div><strong className="text-[#173d2a]">{value}</strong></div>; }
function OrganizeCard({ detail, icon: Icon, label, title, tone }: { detail: string; icon: typeof ListChecks; label: string; title: string; tone: string }) { return <article className={`min-h-[180px] rounded-[1.5rem] p-6 ${tone}`}><Icon aria-hidden="true" className="size-5 text-[#087d3c]" /><p className="mt-7 text-xs font-bold uppercase tracking-[.15em] text-[#55906a]">{label}</p><h3 className="mt-2 text-lg font-semibold text-[#173d2a]">{title}</h3><p className="mt-2 text-sm text-[#62806f]">{detail}</p></article>; }
