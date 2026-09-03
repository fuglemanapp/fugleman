import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleCheck,
  FileText,
  FolderOpen,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  MessageCircle,
  Sparkles,
  UsersRound,
  WalletCards,
} from "lucide-react";

const workflowItems = [
  {
    icon: WalletCards,
    eyebrow: "Finanças",
    title: "Fale como você fala. O WhatSpent organiza.",
    description:
      "Mande um áudio ou uma mensagem. A IA entende a despesa, a categoria e o contexto sem transformar sua rotina em planilha.",
    detail: "R$ 82,00 · Alimentação · iFood",
  },
  {
    icon: CalendarDays,
    eyebrow: "Agenda",
    title: "O que tem hora ganha espaço na sua agenda.",
    description:
      "Compromissos, lembretes e próximos passos saem da conversa já organizados para você acompanhar.",
    detail: "Dentista · amanhã, 09:00",
  },
  {
    icon: FolderOpen,
    eyebrow: "Organização",
    title: "Arquivos e projetos que você encontra pelo significado.",
    description:
      "Guarde comprovantes, documentos e ideias. Depois, peça o que precisa com suas próprias palavras.",
    detail: "Contrato de aluguel · encontrado",
  },
];

const faqs = [
  {
    question: "Preciso baixar um aplicativo?",
    answer:
      "Não. A rotina acontece no WhatsApp e o painel web reúne os detalhes, relatórios e configurações da sua conta.",
  },
  {
    question: "O WhatSpent entende áudios?",
    answer:
      "Sim. Você pode registrar uma despesa, pedir um lembrete ou descrever uma tarefa usando texto ou áudio.",
  },
  {
    question: "Posso compartilhar a conta?",
    answer:
      "Sim. A conta compartilhada permite reunir a rotina da família ou da equipe sem compartilhar senhas.",
  },
  {
    question: "Meus dados financeiros ficam protegidos?",
    answer:
      "As conexões de Open Finance são feitas para consulta e organização. O WhatSpent não executa transferências em seu nome.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fbfdfb] text-[#17372b] selection:bg-[#bdf4d2] selection:text-[#0d3422]">
      <a
        href="#conteudo"
        className="sr-only left-4 top-4 z-[60] rounded-lg bg-[#0e9d50] px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute"
      >
        Pular para o conteúdo
      </a>

      <header className="sticky top-0 z-50 border-b border-[#dcebe2]/80 bg-[#fbfdfb]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="WhatSpent - início" className="shrink-0">
            <Image
              src="/logows-transparent.png"
              alt="WhatSpent"
              width={184}
              height={36}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-sm font-medium text-[#557066] lg:flex">
            <a href="#funcionalidades" className="transition-colors hover:text-[#068842]">Como funciona</a>
            <a href="#agenda" className="transition-colors hover:text-[#068842]">Agenda</a>
            <a href="#open-finance" className="transition-colors hover:text-[#068842]">Open Finance</a>
            <a href="#projetos" className="transition-colors hover:text-[#068842]">Projetos</a>
            <a href="#precos" className="transition-colors hover:text-[#068842]">Planos</a>
          </nav>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-[#0b9d4e] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(0,157,78,0.7)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#078940] active:translate-y-0"
          >
            Entrar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main id="conteudo">
        <section className="relative isolate overflow-hidden px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
          <div className="pointer-events-none absolute -right-48 -top-44 -z-10 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,_rgba(33,214,111,0.20),_rgba(33,214,111,0)_67%)]" />
          <div className="pointer-events-none absolute -bottom-64 -left-32 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,_rgba(188,244,210,0.62),_rgba(188,244,210,0)_68%)]" />

          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.94fr_1.06fr] lg:gap-20">
            <div className="max-w-2xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#cdebd8] bg-white px-3.5 py-2 text-xs font-semibold text-[#167544] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#12bd62] shadow-[0_0_0_4px_rgba(18,189,98,0.12)]" />
                Sua rotina organizada pelo WhatsApp
              </div>

              <h1 className="max-w-xl text-balance text-[3.4rem] font-semibold leading-[0.96] tracking-[-0.065em] text-[#123126] sm:text-7xl lg:text-[5.25rem]">
                Menos controle manual. <span className="text-[#08a94f]">Mais clareza</span> para decidir.
              </h1>

              <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-[#557066] sm:text-xl">
                O WhatSpent transforma conversas em finanças organizadas, agenda em dia e próximos passos visíveis — sem tirar você do ritmo.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0b9d4e] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_38px_-18px_rgba(11,157,78,0.8)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#078940] active:translate-y-0"
                >
                  Começar agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#funcionalidades"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#cfe3d7] bg-white px-6 py-4 text-base font-semibold text-[#285043] transition-colors hover:border-[#8bcba5] hover:bg-[#f3fbf6]"
                >
                  Ver como funciona
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#547067]">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#09a94e]" /> Registro por texto ou áudio</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#09a94e]" /> Painel para enxergar o todo</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[640px]">
              <div className="absolute -inset-7 -z-10 rounded-[3rem] bg-[linear-gradient(135deg,rgba(232,250,239,0.95),rgba(255,255,255,0.2))]" />
              <div className="overflow-hidden rounded-[2.4rem] border border-[#d7ebe0] bg-white p-4 shadow-[0_38px_100px_-48px_rgba(12,92,49,0.46)] sm:p-5">
                <div className="flex items-center justify-between rounded-[1.5rem] border border-[#e1eee6] bg-[#f8fcf9] px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-3">
                    <Image src="/iconws-transparent.png" alt="Ícone WhatSpent" width={42} height={42} className="h-10 w-10" />
                    <div>
                      <p className="text-sm font-semibold text-[#17372b]">WhatSpent</p>
                      <p className="text-xs text-[#6c8579]">Organizando sua rotina</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#daf8e6] px-3 py-1.5 text-xs font-semibold text-[#11874a]">Hoje</span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1.06fr_.94fr]">
                  <div className="rounded-[1.6rem] bg-[#0e3b2a] p-5 text-white sm:p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#b8d9c5]">Resumo financeiro</p>
                      <WalletCards className="h-5 w-5 text-[#6de99e]" />
                    </div>
                    <p className="mt-9 text-xs font-medium uppercase tracking-[0.16em] text-[#9fc8ae]">Disponível no mês</p>
                    <p className="mt-1 text-4xl font-semibold tracking-[-0.05em]">R$ 4.860</p>
                    <div className="mt-8 flex items-end gap-1.5" aria-label="Evolução mensal positiva">
                      {[32, 48, 39, 66, 56, 81, 74, 96].map((height, index) => (
                        <span key={index} style={{ height }} className="w-full rounded-t-full bg-[#52d47f]" />
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-[#b8d9c5]">+12,4% de previsibilidade este mês</p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.6rem] border border-[#dcebe2] bg-[#fbfdfb] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789286]">Próximo compromisso</p>
                      <div className="mt-5 flex items-start gap-3">
                        <span className="rounded-xl bg-[#e3f9eb] p-2.5 text-[#099448]"><CalendarDays className="h-5 w-5" /></span>
                        <div>
                          <p className="font-semibold text-[#17372b]">Reunião de projeto</p>
                          <p className="mt-1 text-sm text-[#6c8579]">Hoje · 15:30</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[1.6rem] border border-[#dcebe2] bg-white p-5 shadow-[0_16px_38px_-30px_rgba(13,88,48,0.4)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#789286]">Último registro</p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="rounded-xl bg-[#e3f9eb] p-2.5 text-[#099448]"><MessageCircle className="h-5 w-5" /></span>
                          <div>
                            <p className="font-semibold text-[#17372b]">Alimentação</p>
                            <p className="mt-1 text-sm text-[#6c8579]">via WhatsApp</p>
                          </div>
                        </div>
                        <span className="font-semibold text-[#17372b]">R$ 82</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.6rem] border border-[#d9eddf] bg-[#effaf3] p-4 sm:flex sm:items-center sm:justify-between sm:px-5">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white p-2 text-[#0aa34e] shadow-sm"><Sparkles className="h-4 w-4" /></span>
                    <p className="text-sm font-medium text-[#2c5945]">“Resume o que preciso resolver hoje.”</p>
                  </div>
                  <span className="mt-3 inline-block text-xs font-semibold text-[#108849] sm:mt-0">Pronto em segundos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#dcebe2] bg-white px-5 py-5 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-4 text-sm text-[#5f7a6d]">
            <span className="font-medium text-[#315849]">Uma conversa pode cuidar da sua rotina inteira.</span>
            <span className="inline-flex items-center gap-2"><CircleCheck className="h-4 w-4 text-[#0aa34e]" /> Finanças</span>
            <span className="inline-flex items-center gap-2"><CircleCheck className="h-4 w-4 text-[#0aa34e]" /> Agenda</span>
            <span className="inline-flex items-center gap-2"><CircleCheck className="h-4 w-4 text-[#0aa34e]" /> Projetos</span>
            <span className="inline-flex items-center gap-2"><CircleCheck className="h-4 w-4 text-[#0aa34e]" /> Documentos</span>
          </div>
        </section>

        <section id="funcionalidades" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
              <div className="lg:pt-8">
                <p className="text-sm font-semibold text-[#079347]">Do WhatsApp para a sua vida real</p>
                <h2 className="mt-4 max-w-md text-balance text-4xl font-semibold leading-tight tracking-[-0.05em] text-[#123126] sm:text-5xl">
                  Menos abas abertas. Mais contexto onde importa.
                </h2>
                <p className="mt-6 max-w-md text-lg leading-8 text-[#5c766a]">
                  Cada mensagem vira uma ação clara. Você registra, consulta e acompanha sem precisar montar um sistema novo para cada parte da vida.
                </p>
                <Link href="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#078d45] transition-colors hover:text-[#056c35]">
                  Conhecer o WhatSpent <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {workflowItems.map(({ icon: Icon, eyebrow, title, description, detail }, index) => (
                  <article
                    key={eyebrow}
                    className={`group grid gap-5 rounded-[1.8rem] border border-[#dcebe2] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#a5ddba] hover:shadow-[0_24px_60px_-40px_rgba(12,109,57,0.45)] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7 ${index === 1 ? "lg:ml-10" : ""}`}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eafaf0] text-[#079347]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0b984a]">{eyebrow}</p>
                      <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#18382b]">{title}</h3>
                      <p className="mt-2 max-w-xl leading-7 text-[#668075]">{description}</p>
                    </div>
                    <span className="w-fit rounded-full bg-[#f0faf3] px-3 py-2 text-xs font-medium text-[#36805a] sm:max-w-36">{detail}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="agenda" className="scroll-mt-24 bg-[#effaf3] px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-20">
            <div className="rounded-[2.25rem] bg-[#12382a] p-6 text-white shadow-[0_32px_80px_-40px_rgba(6,75,37,0.6)] sm:p-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <p className="text-sm font-medium text-[#a6d9b8]">Sua terça-feira</p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">12 de agosto</p>
                </div>
                <span className="rounded-2xl bg-white/10 p-3 text-[#7bf0a9]"><CalendarDays className="h-6 w-6" /></span>
              </div>
              <div className="mt-7 space-y-3">
                {[
                  ["09:00", "Dentista", "Lembrete criado pelo WhatsApp"],
                  ["15:30", "Reunião de projeto", "Link do Meet e pauta prontos"],
                  ["18:00", "Revisar orçamento", "Prioridade do dia"],
                ].map(([time, title, detail]) => (
                  <div key={time} className="grid grid-cols-[4rem_1fr] gap-3 rounded-2xl bg-white/[0.07] p-4">
                    <span className="pt-0.5 text-sm font-semibold text-[#79eaa6]">{time}</span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="mt-1 text-sm text-[#a9d4b9]">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#079347]">Agenda que se atualiza com a conversa</p>
              <h2 className="mt-4 max-w-lg text-balance text-4xl font-semibold leading-tight tracking-[-0.05em] text-[#123126] sm:text-5xl">
                Seu tempo aparece organizado antes de virar urgência.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#5c766a]">
                Peça para marcar, lembrar ou resumir. O WhatSpent transforma uma frase solta em um compromisso que você realmente consegue acompanhar.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#d4eadb] bg-white p-5">
                  <p className="font-semibold text-[#193a2d]">Google Agenda</p>
                  <p className="mt-2 text-sm leading-6 text-[#698276]">Integre a agenda que você já usa.</p>
                </div>
                <div className="rounded-2xl border border-[#d4eadb] bg-white p-5">
                  <p className="font-semibold text-[#193a2d]">Resumos diários</p>
                  <p className="mt-2 text-sm leading-6 text-[#698276]">Veja prioridades sem vasculhar conversas.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projetos" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2.5rem] border border-[#dcebe2] bg-white p-6 sm:p-10 lg:p-12">
              <div className="grid gap-12 lg:grid-cols-[.88fr_1.12fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold text-[#079347]">Projetos, equipe e próximos passos</p>
                  <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-[-0.05em] text-[#123126] sm:text-5xl">
                    A visão do todo sem perder o detalhe.
                  </h2>
                  <p className="mt-6 max-w-lg text-lg leading-8 text-[#5c766a]">
                    Transforme notas, reuniões e pedidos em uma lista objetiva do que precisa acontecer — e deixe o painel mostrar onde sua atenção vale mais.
                  </p>
                  <div className="mt-8 flex items-center gap-3 text-sm font-medium text-[#3f6552]">
                    <UsersRound className="h-5 w-5 text-[#079347]" />
                    Compartilhe a mesma visão com sua família ou equipe.
                  </div>
                </div>

                <div className="rounded-[2rem] bg-[#f4faf6] p-4 sm:p-5">
                  <div className="rounded-[1.5rem] bg-white p-5 shadow-[0_22px_50px_-38px_rgba(12,99,51,0.5)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="rounded-xl bg-[#e6f9ed] p-2.5 text-[#089548]"><LayoutDashboard className="h-5 w-5" /></span>
                        <div>
                          <p className="font-semibold text-[#193a2d]">Lançamento do site</p>
                          <p className="text-sm text-[#70897d]">8 itens em acompanhamento</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-[#e8f9ee] px-3 py-1.5 text-xs font-semibold text-[#13864a]">Em andamento</span>
                    </div>
                    <div className="mt-7 space-y-3">
                      {[
                        ["Revisar identidade visual", "Concluído", "bg-[#0aad52]"],
                        ["Preparar página de login", "Em andamento", "bg-[#77c896]"],
                        ["Conectar Open Finance", "Próximo", "bg-[#d4e4d9]"],
                      ].map(([task, status, color]) => (
                        <div key={task} className="flex items-center gap-3 rounded-xl border border-[#e4eee8] px-4 py-3">
                          <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                          <span className="flex-1 text-sm font-medium text-[#294b3b]">{task}</span>
                          <span className="text-xs text-[#789084]">{status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="drive" className="scroll-mt-24 bg-[#f6fbf8] px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.95fr] lg:items-center lg:gap-20">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-semibold text-[#079347]">Drive inteligente</p>
              <h2 className="mt-4 max-w-xl text-balance text-4xl font-semibold leading-tight tracking-[-0.05em] text-[#123126] sm:text-5xl">
                Seus documentos não precisam de nomes perfeitos para serem encontrados.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#5c766a]">
                Envie o comprovante, contrato ou foto no WhatsApp. Depois, pergunte pelo que ele significa — não pelo nome do arquivo.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="rounded-[2.25rem] border border-[#d8e9df] bg-white p-6 shadow-[0_26px_65px_-42px_rgba(14,104,55,0.42)] sm:p-8">
                <div className="flex items-center gap-3 border-b border-[#e6eee9] pb-5">
                  <span className="rounded-2xl bg-[#e7f9ed] p-3 text-[#079347]"><FolderOpen className="h-6 w-6" /></span>
                  <div><p className="font-semibold text-[#193a2d]">Documentos</p><p className="text-sm text-[#749084]">Busca por contexto</p></div>
                </div>
                <div className="mt-6 rounded-2xl bg-[#f2faf5] p-4 text-sm text-[#315949]">
                  “Ache o comprovante do mecânico do mês passado.”
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#dcece2] p-4">
                  <span className="rounded-xl bg-[#e9f9ef] p-2.5 text-[#099448]"><FileText className="h-5 w-5" /></span>
                  <div className="flex-1"><p className="font-semibold text-[#244637]">comprovante_oficina.pdf</p><p className="mt-1 text-sm text-[#71897d]">Encontrado em Despesas · junho</p></div>
                  <CheckCircle2 className="h-5 w-5 text-[#0ba34e]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="open-finance" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#0e3b2a] px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
            <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
              <div>
                <span className="inline-flex rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-[#a6e8bd]">Open Finance</span>
                <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">Mais clareza sobre seus cartões. Menos troca de aplicativo.</h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-[#b7d5c2]">
                  Conecte as instituições que você usa para consultar saldo, cartões e faturas em um só lugar.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] bg-white p-6 text-[#17372b]">
                  <Landmark className="h-7 w-7 text-[#0b9d4e]" />
                  <p className="mt-8 text-sm text-[#678074]">Visão consolidada</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Tudo no mesmo painel</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-6">
                  <LockKeyhole className="h-7 w-7 text-[#74eaa2]" />
                  <p className="mt-8 text-sm text-[#b3d5bf]">Acesso para consulta</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Sem executar transferências</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="precos" className="scroll-mt-24 bg-[#effaf3] px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-semibold text-[#079347]">Plano de lançamento</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.055em] text-[#123126] sm:text-5xl">Tudo que você precisa para organizar o que importa.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5c766a]">Um único plano para finanças, agenda, projetos e organização no WhatsApp.</p>

            <div className="mx-auto mt-12 max-w-xl overflow-hidden rounded-[2.25rem] border border-[#cfe7d8] bg-white text-left shadow-[0_34px_80px_-45px_rgba(11,116,56,0.45)]">
              <div className="border-b border-[#dcebe2] bg-[#fbfefc] p-8 sm:p-10">
                <div className="flex items-center justify-between gap-4"><p className="text-lg font-semibold text-[#17372b]">WhatSpent Pro</p><span className="rounded-full bg-[#ddf7e6] px-3 py-1.5 text-xs font-semibold text-[#078d45]">Lançamento</span></div>
                <div className="mt-6 flex items-end gap-2"><span className="text-5xl font-semibold tracking-[-0.06em] text-[#123126]">R$ 49</span><span className="pb-1 text-[#668075]">/ mês</span></div>
              </div>
              <div className="p-8 sm:p-10">
                <ul className="space-y-4 text-[#436554]">
                  {["WhatSpent no WhatsApp", "Painel de gestão completo", "Agenda e lembretes", "Organização de arquivos", "Conta compartilhada"].map((item) => (
                    <li key={item} className="flex items-center gap-3"><Check className="h-5 w-5 text-[#0b9d4e]" />{item}</li>
                  ))}
                </ul>
                <Link href="/login" className="mt-9 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0b9d4e] px-6 py-4 font-semibold text-white shadow-[0_16px_30px_-16px_rgba(11,157,78,0.72)] transition-transform hover:-translate-y-0.5 hover:bg-[#078940] active:translate-y-0">Começar agora <ArrowRight className="h-4 w-4" /></Link>
                <p className="mt-5 text-center text-sm text-[#71897d]">7 dias de garantia para conhecer a rotina.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="text-center"><p className="text-sm font-semibold text-[#079347]">Perguntas frequentes</p><h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.05em] text-[#123126] sm:text-5xl">Antes de começar, vale saber.</h2></div>
            <div className="mt-12 divide-y divide-[#dcebe2] border-y border-[#dcebe2]">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-[#244637] [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf8f0] text-[#079347] transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-2xl pt-4 leading-7 text-[#698176]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#dcebe2] bg-white px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <Image src="/logows-transparent.png" alt="WhatSpent" width={184} height={36} className="h-8 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#698176]">Finanças, tempo e organização em um lugar que conversa com a sua rotina.</p>
          </div>
          <div className="text-sm text-[#698176] md:text-right"><p>© 2026 WhatSpent Tecnologia</p><p className="mt-2">Privacidade e segurança para a sua rotina.</p><p className="mt-3 flex gap-4 md:justify-end"><Link href="/privacidade" className="font-medium text-[#078d45] transition-colors hover:text-[#056c35]">Privacidade</Link><Link href="/termos" className="font-medium text-[#078d45] transition-colors hover:text-[#056c35]">Termos</Link></p></div>
        </div>
      </footer>
    </div>
  );
}
