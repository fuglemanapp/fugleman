import Image from "next/image";
import Link from "next/link";
import { ChevronDown, CircleHelp, Menu } from "lucide-react";

type DashboardNavProps = { activePath?: string };

const sections = [
  { label: "Visão geral", links: [{ href: "/dashboard", label: "Dashboard", description: "Resumo do seu dia" }, { href: "/dashboard/conversas", label: "WhatSpent", description: "Seu assistente pessoal" }] },
  { label: "Financeiro", links: [
    { href: "/dashboard/financeiro/transacoes", label: "Transações", description: "Entradas e saídas" },
    { href: "/dashboard/financeiro/planejamento", label: "Planejamento", description: "Orçamentos, metas e recorrências" },
    { href: "/dashboard/financeiro/regras", label: "Automação", description: "Regras para categorizar lançamentos" },
    { href: "/dashboard/financeiro/cartoes", label: "Cartões", description: "Acompanhe seus cartões" },
    { href: "/dashboard/financeiro/bancos", label: "Bancos", description: "Suas contas bancárias" },
    { href: "/dashboard/financeiro/categorias", label: "Categorias", description: "Organize seus gastos" },
    { href: "/dashboard/financeiro/conciliacao", label: "Conciliação", description: "Confira seus lançamentos" },
    { href: "/dashboard/financeiro/cobrancas", label: "Cobranças", description: "Acompanhe recebimentos" },
    { href: "/dashboard/financeiro/integracoes", label: "Integrações", description: "Conecte instituições" },
    { href: "/dashboard/financeiro/notas-fiscais", label: "Notas fiscais", description: "Documentos fiscais" },
    { href: "/dashboard/financeiro/relatorios", label: "Relatórios", description: "Entenda seus números" },
  ] },
  { label: "Agenda", links: [
    { href: "/dashboard/agenda", label: "Minha agenda", description: "Compromissos e horários" },
    { href: "/dashboard/agenda/relatorios", label: "Relatórios", description: "Como seu tempo foi usado" },
    { href: "/dashboard/agenda/integracoes", label: "Integrações", description: "Conecte seus serviços" },
  ] },
  { label: "Organização", links: [
    { href: "/dashboard/organizacao/tarefas", label: "Tarefas", description: "Acompanhe pendências" },
    { href: "/dashboard/organizacao/projetos", label: "Projetos", description: "Planeje entregas" },
    { href: "/dashboard/organizacao/categorias", label: "Categorias", description: "Classifique demandas" },
    { href: "/dashboard/organizacao/notas", label: "Notas", description: "Guarde suas ideias" },
    { href: "/dashboard/organizacao/arquivos", label: "Arquivos", description: "Organize documentos" },
    { href: "/dashboard/organizacao/relatorios", label: "Relatórios", description: "Acompanhe resultados" },
  ] },
  { label: "Cadastros", links: [{ href: "/dashboard/cadastros/pessoas", label: "Pessoas", description: "Seus contatos" }] },
];

export function DashboardNav({ activePath }: DashboardNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dcebe2] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link href="/dashboard" className="flex shrink-0 items-center" aria-label="Ir para o dashboard do WhatSpent">
          <Image src="/logows-transparent.png" alt="WhatSpent" width={150} height={30} className="h-7 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {sections.map((section) => {
            const active = section.links.some((link) => link.href === activePath);
            return <details key={section.label} className="group relative"><summary className={`flex cursor-pointer list-none items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${active ? "bg-[#edf9f1] text-[#087d3c]" : "text-[#5d786a] hover:bg-[#f3f8f5] hover:text-[#17372b]"}`}>{section.label} <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" /></summary><div className="absolute left-0 top-[calc(100%+0.6rem)] w-64 rounded-2xl border border-[#dcebe2] bg-white p-2 shadow-[0_24px_48px_-28px_rgba(12,100,53,0.36)]">{section.links.map((link) => <Link key={link.href} href={link.href} className={`block rounded-xl px-3 py-2.5 transition-colors ${link.href === activePath ? "bg-[#edf9f1]" : "hover:bg-[#f5faf6]"}`}><span className="block text-sm font-semibold text-[#214235]">{link.label}</span><span className="mt-0.5 block text-xs text-[#789083]">{link.description}</span></Link>)}</div></details>;
          })}
        </nav>

        <div className="hidden items-center gap-3 sm:flex"><Link href="/dashboard/ajuda" className="grid h-9 w-9 place-items-center rounded-xl text-[#638072] transition-colors hover:bg-[#edf8f1] hover:text-[#087d3c]" aria-label="Ajuda"><CircleHelp className="h-5 w-5" /></Link><Link href="/dashboard/conta" className="rounded-xl bg-[#edf9f1] px-3 py-2 text-sm font-semibold text-[#087d3c] transition-colors hover:bg-[#dff5e7]">Minha conta</Link></div>

        <details className="relative lg:hidden"><summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-xl border border-[#dcebe2] text-[#315f48] hover:bg-[#f1faf4]" aria-label="Abrir menu"><Menu className="h-5 w-5" /></summary><nav className="absolute right-0 top-[calc(100%+0.6rem)] max-h-[75vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-[#dcebe2] bg-white p-3 shadow-[0_24px_48px_-28px_rgba(12,100,53,0.36)]" aria-label="Menu móvel">{sections.map((section) => <div key={section.label} className="border-b border-[#edf3ef] py-3 last:border-0"><p className="px-2 text-xs font-bold uppercase tracking-[0.1em] text-[#8ca297]">{section.label}</p>{section.links.map((link) => <Link key={link.href} href={link.href} className={`mt-1 block rounded-xl px-2 py-2 text-sm font-semibold ${link.href === activePath ? "bg-[#edf9f1] text-[#087d3c]" : "text-[#315f48] hover:bg-[#f5faf6]"}`}>{link.label}</Link>)}</div>)}<div className="flex gap-2 pt-3"><Link href="/dashboard/conta" className="rounded-xl bg-[#edf9f1] px-3 py-2 text-sm font-semibold text-[#087d3c]">Minha conta</Link><Link href="/dashboard/ajuda" className="rounded-xl px-3 py-2 text-sm font-semibold text-[#638072] hover:bg-[#f3f8f5]">Ajuda</Link></div></nav></details>
      </div>
    </header>
  );
}
