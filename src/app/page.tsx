import React from "react";
import { LandingFeatureGrid } from "../components/landing/landing-feature-grid";
import { LandingFooter } from "../components/landing/landing-footer";
import { LandingHeader } from "../components/landing/landing-header";
import { LandingHero } from "../components/landing/landing-hero";
import { LandingProductOverview } from "../components/landing/landing-product-overview";
import { LandingProductShowcases } from "../components/landing/landing-product-showcases";
import { ArrowRight, Calendar, FolderOpen, Shield, Link2, CheckCircle2, Wallet, ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="landing-page min-h-screen">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingProductOverview />
        <LandingProductShowcases />
      </main>
      <LandingFooter />
    </div>
  );
}

function LegacyFuglemanLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">

      {/* HEADER / NAVBAR EM FORMATO DE PÍLULA FLUTUANTE */}
      <div className="absolute top-6 left-0 right-0 z-50 flex justify-center w-full px-4">
        <header className="w-full max-w-5xl bg-[#1A1A24]/40 backdrop-blur-md border border-white/10 rounded-full h-[72px] flex items-center justify-between px-6 shadow-2xl">
          <div className="flex items-center h-full">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center">
                  <div className="w-[85%] h-[85%] bg-[#0B0F19] rounded-full flex items-center justify-center translate-x-[1px] -translate-y-[1px]">
                    <span className="text-white font-black text-lg -translate-x-[1px] translate-y-[1px]">W</span>
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-white rotate-45 transform skew-x-12"></div>
              </div>
              <span className="text-xl font-medium tracking-tight text-white leading-none mt-0.5">WhatSpent</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[15px] font-normal text-slate-300">
            <a href="#funcionalidades" className="hover:text-white transition-colors">Finanças</a>
            <a href="#agenda" className="hover:text-white transition-colors">Agenda</a>
            <a href="#cartoes" className="hover:text-white transition-colors">Cartões</a>
            <a href="#como-comecar" className="hover:text-white transition-colors">Como começar</a>
          </nav>

          <div className="flex items-center">
            <Link href="/cadastro" className="inline-flex h-10 items-center rounded-full border border-white/10 px-5 py-4 text-[15px] font-medium text-white transition-all hover:border-white/20 hover:bg-white/5">
              Criar conta grátis <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1">

        {/* 1. HERO SECTION */}
        <section className="relative bg-black text-white pt-40 pb-20 lg:pt-48 lg:pb-24 px-6 overflow-hidden flex items-center">
          <div className="absolute top-1/2 right-1/4 w-[800px] h-[800px] bg-[#C084FC]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">

              {/* Coluna da Esquerda (Textos) */}
              <div className="lg:col-span-6 lg:pr-8 relative z-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium mb-10 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                  IA no WhatsApp para sua rotina
                </div>

                <h1 className="text-6xl lg:text-[5.5rem] font-bold tracking-tight mb-8 leading-[1.05]">
                  Suas finanças <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6ee7a0] to-[#5eead4]">organizadas</span>. Direto no seu bolso.
                </h1>

                <p className="text-xl text-slate-300 mb-10 leading-relaxed font-light max-w-lg">
                  Registre gastos e compromissos pelo WhatsApp.<br/>
                  Confira seus dados no painel do WhatSpent.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
                  <Link href="/cadastro" className="inline-flex w-full items-center justify-center rounded-2xl border border-white/20 bg-transparent px-12 py-4 text-lg font-medium text-white transition-all backdrop-blur-sm hover:bg-white/10 sm:w-auto">
                    Criar conta grátis
                  </Link>
                </div>

                <div className="flex flex-col gap-4 text-[15px] text-slate-300 font-light">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] shadow-[0_0_8px_rgba(192,132,252,0.8)]"></span> Registre por áudio
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] shadow-[0_0_8px_rgba(192,132,252,0.8)]"></span> Consulte em segundos
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] shadow-[0_0_8px_rgba(192,132,252,0.8)]"></span> Organize tudo no painel
                  </div>
                </div>
              </div>

              {/* Coluna da Direita (Órbitas e Mockup Celular) */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end relative h-[650px] w-full mt-12 lg:mt-0">

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-white/10 rounded-full pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-white/5 rounded-full pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] border border-white/[0.02] rounded-full pointer-events-none"></div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-10">
                  <div className="absolute top-[20%] left-[8%] w-12 h-12 animate-float">
                    <div className="w-full h-full bg-[#1A1025]/80 border border-[#C084FC]/40 rounded-full flex items-center justify-center text-[#C084FC] shadow-[0_0_20px_rgba(192,132,252,0.3)] backdrop-blur-md">
                      <span className="font-bold text-lg">$</span>
                    </div>
                  </div>
                  <div className="absolute top-[65%] left-[2%] w-12 h-12 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="w-full h-full bg-[#1A1025]/80 border border-[#C084FC]/40 rounded-full flex items-center justify-center text-[#C084FC] shadow-[0_0_20px_rgba(192,132,252,0.3)] backdrop-blur-md">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    </div>
                  </div>
                  <div className="absolute top-[35%] right-[2%] w-12 h-12 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="w-full h-full bg-[#1A1025]/80 border border-[#C084FC]/40 rounded-full flex items-center justify-center text-[#C084FC] shadow-[0_0_20px_rgba(192,132,252,0.3)] backdrop-blur-md">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="absolute top-[75%] right-[12%] w-12 h-12 animate-float" style={{ animationDelay: '1.5s' }}>
                    <div className="w-full h-full bg-[#1A1025]/80 border border-[#C084FC]/40 rounded-full flex items-center justify-center text-[#C084FC] shadow-[0_0_20px_rgba(192,132,252,0.3)] backdrop-blur-md">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* O Celular */}
                <div className="relative w-full max-w-[340px] z-20 animate-float-delayed">
                   <div className="absolute inset-0 bg-[#A78BFA] opacity-10 blur-[80px] rounded-[3rem]"></div>
                   <div className="relative bg-[#F3F4F6] rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-[#1E293B] aspect-[1/2.15] flex flex-col">
                      <div className="bg-[#F8FAFC] pt-3 px-6 flex justify-between items-center text-[12px] font-bold text-slate-800 z-30 pb-2">
                        <span>17:13</span>
                        <div className="w-24 h-7 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-2"></div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                        </div>
                      </div>
                      <div className="bg-[#F8FAFC] pb-3 px-4 flex items-center gap-3 relative z-20 border-b border-slate-200">
                        <div className="text-blue-500 font-bold text-xl px-1">{'<'}</div>
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                          <div className="w-[85%] h-[85%] bg-white rounded-full flex items-center justify-center">
                            <span className="text-black font-black text-sm italic translate-y-[1px]">F</span>
                          </div>
                        </div>
                        <div className="text-slate-900 flex-1">
                          <div className="font-semibold text-base leading-tight flex items-center gap-1">WhatSpent <span className="text-blue-500 text-xs">✓</span></div>
                          <div className="text-[11px] text-slate-500">digitando...</div>
                        </div>
                        <div className="flex items-center gap-4 text-blue-500">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        </div>
                      </div>
                      <div className="flex-1 bg-[#EBE5DE] p-4 flex flex-col gap-3 relative z-20 overflow-hidden">
                        <div className="bg-[#DCFCE7] rounded-2xl rounded-tr-none p-3 max-w-[85%] self-end shadow-sm border border-green-100 -mt-8">
                          <p className="text-slate-800 text-[14px]">Gastei 82 reais no iFood</p>
                          <div className="text-[10px] text-green-800/60 text-right mt-1">20:06 ✓✓</div>
                        </div>
                        <div className="bg-white rounded-2xl rounded-tl-none p-4 max-w-[95%] self-start shadow-sm border border-slate-100 mt-2">
                          <div className="font-semibold text-sm mb-1 text-slate-800 flex items-center gap-1">WhatSpent <span className="text-blue-500 text-xs">✓</span></div>
                          <p className="text-[14px] text-slate-800 leading-relaxed">
                            Anotado! 📝 <span className="font-bold">R$ 82,00</span> no iFood registrado em <span className="font-bold">Alimentação</span>.<br/><br/>
                            Você já gastou <span className="font-bold">R$ 340,00</span> nessa categoria este mês. Quer ver o resumo? 📊
                          </p>
                          <div className="text-[10px] text-slate-400 text-right mt-1">20:06</div>
                        </div>
                        <div className="flex gap-2 self-start ml-2 mb-2">
                           <span className="px-3 py-1 bg-[#D1FAE5] text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">Alimentação</span>
                           <span className="px-3 py-1 bg-[#D1FAE5] text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">Finanças</span>
                        </div>
                        <div className="bg-[#DCFCE7] rounded-2xl rounded-tr-none p-3 max-w-[85%] self-end shadow-sm border border-green-100">
                          <p className="text-slate-800 text-[14px]">Resume meu dia e mostra o que é prioridade.</p>
                          <div className="text-[10px] text-green-800/60 text-right mt-1">20:06 ✓✓</div>
                        </div>
                        <div className="bg-white rounded-2xl rounded-tl-none p-3 max-w-[85%] self-start shadow-sm border border-slate-100 mt-2">
                          <div className="font-semibold text-sm mb-1 text-slate-800 flex items-center gap-1">WhatSpent <span className="text-blue-500 text-xs">✓</span></div>
                          <p className="text-[14px] text-slate-400 font-bold tracking-widest leading-none">. . .</p>
                        </div>
                      </div>
                      <div className="bg-[#F3F4F6] p-2 flex items-center gap-3 z-20 border-t border-slate-200 pb-4">
                         <div className="text-slate-500 font-light text-2xl pl-1">+</div>
                         <div className="flex-1 bg-white rounded-full h-9 px-4 flex items-center justify-between border border-slate-200 shadow-sm">
                           <span className="text-slate-400 text-sm">Mensagem</span>
                           <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                         </div>
                         <div className="text-slate-500"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                         <div className="text-slate-500 pr-1"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg></div>
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Faixa Infinita (Marquee) CONSERTADA */}
        <div className="bg-[#050505] border-t border-white/5 py-6 overflow-hidden flex w-full">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16 shrink-0 pr-16 text-[15px] text-slate-500">
            <div className="flex items-center gap-3"><span className="text-white font-semibold">Acesso</span> gratuito em validação</div>
            <div className="flex items-center gap-3">Uma <span className="text-white font-semibold">conta</span> para cada pessoa</div>
            <div className="flex items-center gap-3"><span className="text-white font-semibold text-lg">$</span><span className="text-white font-semibold">Gastos e cartões</span> no painel</div>
            <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-slate-400"/> Número vinculado à sua conta</div>
            <div className="flex items-center gap-3"><span className="text-white font-semibold">Mensagens</span> em linguagem natural</div>
            <div className="flex items-center gap-3"><Link2 className="w-5 h-5 text-slate-400"/> Acompanhe <span className="text-white font-semibold">seu mês</span></div>
          </div>
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16 shrink-0 pr-16 text-[15px] text-slate-500" aria-hidden="true">
            <div className="flex items-center gap-3"><span className="text-white font-semibold">Acesso</span> gratuito em validação</div>
            <div className="flex items-center gap-3">Uma <span className="text-white font-semibold">conta</span> para cada pessoa</div>
            <div className="flex items-center gap-3"><span className="text-white font-semibold text-lg">$</span><span className="text-white font-semibold">Gastos e cartões</span> no painel</div>
            <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-slate-400"/> Número vinculado à sua conta</div>
            <div className="flex items-center gap-3"><span className="text-white font-semibold">Mensagens</span> em linguagem natural</div>
            <div className="flex items-center gap-3"><Link2 className="w-5 h-5 text-slate-400"/> Acompanhe <span className="text-white font-semibold">seu mês</span></div>
          </div>
        </div>

        {/* 2. FUNCIONALIDADES - CARDS ZIG ZAG RESTAURADOS */}
        <section id="funcionalidades" className="py-24 px-6 bg-[#FCFDFE] text-slate-900 relative">
          <div className="container mx-auto max-w-5xl space-y-32">

            {/* Finanças */}
            <div className="grid md:grid-cols-2 gap-12 items-center group">
              <div className="order-2 md:order-1 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-100 to-indigo-50 rounded-[2.5rem] transform -rotate-2 z-0 opacity-50 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-500"></div>
                <div className="glass-card p-10 rounded-[2rem] relative z-10 hover:-translate-y-1 transition-transform duration-500">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 text-purple-700 text-xs font-extrabold tracking-wider uppercase mb-6">Controle Financeiro</div>
                   <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-5 leading-tight tracking-tight">Anote seus gastos por áudio ou texto.</h3>
                   <p className="text-slate-500 mb-8 leading-relaxed text-lg">
                     Esqueça as planilhas complexas. Mande uma mensagem descrevendo o que gastou e o WhatSpent registra o lançamento para você acompanhar no painel.
                   </p>
                   <ul className="space-y-4">
                      <li className="flex items-center gap-3 font-medium text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" /> Categorização automática com IA
                      </li>
                      <li className="flex items-center gap-3 font-medium text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" /> Tira a dor de cabeça de lembrar os gastos
                      </li>
                   </ul>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center animate-float-delayed">
                 <div className="w-full max-w-sm glass-card rounded-3xl p-6 relative">
                   <div className="absolute -inset-0.5 bg-gradient-to-br from-white to-transparent rounded-3xl z-[-1] opacity-50 pointer-events-none"></div>
                   <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-xl">🛒</div>
                     <div>
                       <div className="font-bold">Mercado</div>
                       <div className="text-xs text-slate-500">Cartão de Crédito</div>
                     </div>
                     <div className="ml-auto font-bold text-red-500">-R$ 150,00</div>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-xl">💊</div>
                     <div>
                       <div className="font-bold">Farmácia</div>
                       <div className="text-xs text-slate-500">Pix</div>
                     </div>
                     <div className="ml-auto font-bold text-red-500">-R$ 80,00</div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Painel Web */}
            <div className="grid md:grid-cols-2 gap-12 items-center group">
              <div className="flex justify-center animate-float">
                <div className="w-full max-w-sm glass-card-dark rounded-3xl p-8 text-white relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
                  <div className="text-xs text-slate-400 mb-2 font-medium tracking-wide uppercase">Saldo Geral</div>
                  <div className="text-4xl font-extrabold mb-8 tracking-tight text-white">R$ 12.450,00</div>
                  <div className="space-y-4">
                    <div className="h-12 bg-white/5 rounded-xl w-full border border-white/5"></div>
                    <div className="h-12 bg-white/5 rounded-xl w-3/4 border border-white/5"></div>
                    <div className="h-12 bg-white/5 rounded-xl w-5/6 border border-white/5"></div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-l from-blue-100 to-indigo-50 rounded-[2.5rem] transform rotate-2 z-0 opacity-50 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-500"></div>
                <div className="glass-card p-10 rounded-[2rem] relative z-10 hover:-translate-y-1 transition-transform duration-500">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-extrabold tracking-wider uppercase mb-6">Dashboard Web</div>
                   <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-5 leading-tight tracking-tight">Seu dinheiro organizado em um só painel.</h3>
                   <p className="text-slate-500 mb-8 leading-relaxed text-lg">
                     A simplicidade do WhatsApp unida ao poder de um painel web completo. Acesse pelo computador para ver gráficos de despesas, metas e fluxos.
                   </p>
                   <ul className="space-y-4">
                      <li className="flex items-center gap-3 font-medium text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Visão consolidada de todas as contas
                      </li>
                      <li className="flex items-center gap-3 font-medium text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Gráficos de categorias em tempo real
                      </li>
                   </ul>
                </div>
              </div>
            </div>

            {/* Agenda */}
            <div id="agenda" className="grid md:grid-cols-2 gap-12 items-center group">
              <div className="order-2 md:order-1 relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-teal-50 rounded-[2.5rem] transform -rotate-2 z-0 opacity-50 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-500"></div>
                <div className="glass-card p-10 rounded-[2rem] relative z-10 hover:-translate-y-1 transition-transform duration-500">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-700 text-xs font-extrabold tracking-wider uppercase mb-6">Agenda Conectada</div>
                   <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-5 leading-tight tracking-tight">Nunca mais esqueça um compromisso.</h3>
                   <p className="text-slate-500 mb-8 leading-relaxed text-lg">
                     "Marca dentista amanhã às 9h". Depois de vincular sua conta, registre seus compromissos em uma conversa simples.
                   </p>
                   <ul className="space-y-4">
                      <li className="flex items-center gap-3 font-medium text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Lembretes diários no WhatsApp
                      </li>
                      <li className="flex items-center gap-3 font-medium text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Sincronização em tempo real com o Google Agenda
                      </li>
                   </ul>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center animate-float-delayed">
                 <div className="w-full max-w-sm glass-card rounded-full p-5 flex items-center justify-center gap-4 text-slate-700 font-medium">
                   <Calendar className="text-blue-500 w-5 h-5" /> Dentista amanhã das 09:00 às 10:00
                 </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. MULTIPLOS USUÁRIOS (SÓCIOS/FAMÍLIA) */}
        <section className="py-32 px-6 bg-white border-t border-slate-100 text-slate-900">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0A1A44] text-xs font-bold uppercase mb-6">Colaborativo</div>
                <h2 className="text-4xl font-bold mb-6 text-slate-900">Conecte a sua conta com quantas pessoas quiser.</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Sem logins difíceis. Adicione o número de celular da sua esposa, marido ou sócio. Eles alimentam os gastos pelo próprio WhatsApp deles, e tudo cai no mesmo painel para você gerenciar.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span className="font-bold text-slate-900 block mb-1">Cônjuge</span>
                    <span className="text-sm text-slate-500">Unifica as despesas da casa automaticamente.</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span className="font-bold text-slate-900 block mb-1">Sócio ou Equipe</span>
                    <span className="text-sm text-slate-500">Cada um registra os gastos da empresa pelo próprio celular.</span>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] bg-slate-50 rounded-3xl border flex items-center justify-center">
                {/* Mockup de fluxograma simples */}
                <div className="absolute top-1/4 left-8 bg-white p-3 rounded-xl shadow-md border text-sm font-medium flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-full text-center leading-6">👩</div> Esposa
                </div>
                <div className="absolute bottom-1/4 left-12 bg-white p-3 rounded-xl shadow-md border text-sm font-medium flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full text-center leading-6">👨</div> Você
                </div>
                <div className="absolute top-1/3 right-8 bg-white p-3 rounded-xl shadow-md border text-sm font-medium flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full text-center leading-6">👨‍💼</div> Sócio
                </div>
                <div className="w-24 h-24 bg-[#0A1A44] text-white rounded-3xl flex items-center justify-center font-bold text-3xl shadow-xl z-10 relative">
                  F
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. IA INTELIGENTE (Seção Roxa) */}
        <section className="py-24 px-6 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Fale tudo que está na sua cabeça. <br/>A IA anota, organiza e não esquece de nada.
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-16">
              Envie uma mensagem objetiva com seu gasto ou compromisso e confira o registro no painel.
            </p>

            <div className="bg-white text-slate-900 rounded-[2rem] p-8 shadow-2xl text-left transform rotate-1">
              <div className="bg-[#D9FDD3] rounded-2xl rounded-tr-none p-4 max-w-[85%] self-end shadow-sm ml-auto mb-6">
                <p className="text-slate-800 font-medium">
                  "Cara, lembrei agora... amanhã 14h tenho reunião com o fornecedor. Ah, e comprei aqueles cabos pro escritório, deu 120 reais no crédito. Depois me lembra de pagar o João sexta feira."
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-blue-500" /> <span className="font-semibold">Evento Criado</span>
                  </div>
                  <span className="text-sm text-slate-500">Amanhã, 14h</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Wallet className="text-red-500" /> <span className="font-semibold">Despesa: Cabos (Escritório)</span>
                  </div>
                  <span className="font-bold text-red-500">-R$ 120,00</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500" /> <span className="font-semibold">Lembrete: Pagar João</span>
                  </div>
                  <span className="text-sm text-slate-500">Sexta-feira</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DRIVE & DOCUMENTOS */}
        <section className="py-24 px-6 bg-slate-50 text-slate-900">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl grid md:grid-cols-2 gap-12 items-center">
              <div>
                <FolderOpen className="w-16 h-16 text-blue-500 mb-6" />
                <h2 className="text-4xl font-bold mb-4 text-slate-900">Seus documentos guardados. Encontrados por IA.</h2>
                <p className="text-slate-600 mb-8 text-lg">
                  Envie um PDF ou a foto de um comprovante pelo WhatsApp. Ele fica salvo na nuvem. Depois, peça: "Ache aquele comprovante de 500 reais do mês passado" e a IA traz ele na hora.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="w-5 h-5 text-green-500"/> Busca por significado</li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="w-5 h-5 text-green-500"/> OCR automático de imagens</li>
                </ul>
              </div>
              <div className="bg-slate-100 rounded-3xl p-6 h-[300px] flex flex-col justify-center items-center text-center border">
                 <div className="bg-white p-4 rounded-2xl shadow-sm max-w-xs w-full mb-4 text-left">
                   <p className="text-slate-500 text-sm mb-1">Você:</p>
                   <p className="font-medium text-slate-800">"Cadê o contrato da imobiliária?"</p>
                 </div>
                 <div className="bg-[#0A1A44] text-white p-4 rounded-2xl shadow-sm max-w-xs w-full text-left">
                   <p className="font-medium flex items-center gap-2"><FolderOpen className="w-4 h-4"/> contrato_aluguel_2026.pdf</p>
                   <p className="text-xs text-blue-200 mt-2">Aqui está o documento solicitado.</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CARTÕES (Tema Escuro) */}
        <section id="cartoes" className="py-32 px-6 bg-[#020617] text-white relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Acompanhe seus cartões em um só painel.</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16 font-light tracking-wide">
              Cadastre suas compras e acompanhe parcelas, limites e faturas nas datas corretas. Você continua no controle das informações que registra.
            </p>

            <div className="glass-card-dark p-10 max-w-3xl mx-auto hover:-translate-y-2 transition-transform duration-500 group">
               <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-white/10 pb-8 gap-6">
                 <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow">N</div>
                   <div className="text-left">
                     <h4 className="font-bold text-xl tracking-tight">Seu cartão</h4>
                     <p className="text-sm text-slate-400 font-medium">Compras e parcelas</p>
                   </div>
                 </div>
                 <div className="text-center md:text-right">
                   <p className="text-sm text-slate-400 font-medium mb-1">Próxima fatura</p>
                   <h4 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">Veja no painel</h4>
                 </div>
               </div>
               <div className="flex items-center justify-center gap-16 text-slate-300">
                 <div className="text-center group-hover:-translate-y-1 transition-transform delay-75">
                   <Shield className="w-10 h-10 mx-auto mb-3 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]"/>
                   <span className="text-sm font-semibold tracking-wide">Seu cartão, seu painel</span>
                 </div>
                 <div className="text-center group-hover:-translate-y-1 transition-transform delay-150">
                   <Link2 className="w-10 h-10 mx-auto mb-3 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]"/>
                   <span className="text-sm font-semibold tracking-wide">Compras e parcelas</span>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* 8. ACESSO GRATUITO */}
        <section id="como-comecar" className="py-32 px-6 bg-[#F8FAFC] text-slate-900 relative">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-[#0A1A44] text-xs font-extrabold tracking-wider uppercase mb-6">Validação gratuita</div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Comece gratuitamente. <br/>E acompanhe a evolução do produto.
            </h2>

            <div className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden max-w-md mx-auto mt-16 transform transition-all hover:scale-105 duration-500 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
              <div className="bg-gradient-to-br from-[#0A1A44] to-blue-900 p-8 text-center text-white relative">
                <h3 className="text-2xl font-bold mb-2">Acesso de validação</h3>
                <div className="flex items-baseline justify-center gap-1 mt-4">
                  <span className="text-4xl font-black">Gratuito</span>
                </div>
              </div>

              <div className="p-10">
                <ul className="space-y-5 text-left mb-10">
                  <li className="flex items-start gap-3"><Check className="text-blue-600 w-5 h-5 flex-shrink-0" /><span className="text-slate-700 font-medium">Conta pessoal no WhatSpent</span></li>
                  <li className="flex items-start gap-3"><Check className="text-blue-600 w-5 h-5 flex-shrink-0" /><span className="text-slate-700 font-medium">Painel para lançamentos e cartões</span></li>
                  <li className="flex items-start gap-3"><Check className="text-blue-600 w-5 h-5 flex-shrink-0" /><span className="text-slate-700 font-medium">Vínculo do seu número de WhatsApp</span></li>
                  <li className="flex items-start gap-3"><Check className="text-green-600 w-5 h-5 flex-shrink-0" /><span className="text-slate-700 font-medium">Ajude a validar e melhorar o produto</span></li>
                </ul>

                <Link href="/cadastro" className="inline-flex h-16 w-full items-center justify-center rounded-2xl bg-[#0A1A44] text-xl font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-900">
                  Criar conta grátis
                </Link>
                <p className="text-center text-sm text-slate-500 mt-6 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" /> Sem cobrança durante a validação
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. FAQ */}
        <section className="py-24 px-6 bg-slate-900 text-white border-t border-slate-800">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-16">Perguntas Frequentes</h2>

            <div className="space-y-4">
              {[
                {q: "Preciso baixar algum aplicativo?", a: "Não. Você cria sua conta no site, vincula seu número no painel e conversa com o WhatSpent pelo WhatsApp."},
                {q: "Como meu número é associado à conta?", a: "Depois de entrar no painel, você informa o seu número no formato internacional. As mensagens desse número passam a ser associadas à sua conta."},
                {q: "O serviço é pago?", a: "Não durante a fase de validação. O acesso está gratuito enquanto o produto é testado e aprimorado."},
                {q: "Meus dados são usados para quê?", a: "Para manter sua conta, registrar o que você solicitar e operar o painel e o agente. Consulte a Política de Privacidade para os detalhes."},
                {q: "Posso registrar gastos de forma simples?", a: "Sim. Envie uma mensagem natural, como 'gastei 50 no posto'. Sempre confira a resposta e o painel antes de tomar decisões importantes."}
              ].map((faq, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                  <div className="flex justify-between items-center cursor-pointer">
                    <h4 className="font-bold text-lg">{faq.q}</h4>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-slate-400 mt-4 leading-relaxed pr-8">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Faixa Infinita (Marquee) CONSERTADA */}
        <div className="relative flex overflow-x-hidden bg-[#050505] py-8 text-[15px] font-normal text-slate-500 border-t border-white/5">
          <div className="flex w-max">
            {/* Primeira faixa */}
            <div className="animate-marquee flex items-center gap-16 px-8">
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-white font-semibold">Acesso</span> gratuito em validação
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                Uma <span className="text-white font-semibold">conta</span> para cada pessoa
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-white font-semibold text-lg">$</span>
                <span className="text-white font-semibold">Gastos e cartões</span> no painel
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Shield className="w-5 h-5 text-slate-400"/>
                Número vinculado à sua conta
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                <span className="text-white font-semibold">Mensagens</span> em linguagem natural
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link2 className="w-5 h-5 text-slate-400"/>
                Acompanhe <span className="text-white font-semibold">seu mês</span>
              </div>
            </div>

            {/* Segunda faixa idêntica, colada logo atrás, também animada */}
            <div className="animate-marquee flex items-center gap-16 px-8" aria-hidden="true">
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-white font-semibold">Acesso</span> gratuito em validação
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                Uma <span className="text-white font-semibold">conta</span> para cada pessoa
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-white font-semibold text-lg">$</span>
                <span className="text-white font-semibold">Gastos e cartões</span> no painel
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Shield className="w-5 h-5 text-slate-400"/>
                Número vinculado à sua conta
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                <span className="text-white font-semibold">Mensagens</span> em linguagem natural
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link2 className="w-5 h-5 text-slate-400"/>
                Acompanhe <span className="text-white font-semibold">seu mês</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-slate-400 py-16 px-6">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            {/* Logo desenhado em puro HTML/CSS para o rodapé escuro */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center">
                  <div className="w-[85%] h-[85%] bg-[#050B14] rounded-full flex items-center justify-center translate-x-[2px] -translate-y-[2px]">
                    <span className="text-white font-black text-2xl -translate-x-[2px] translate-y-[1px]">W</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white rotate-45 transform skew-x-12"></div>
                <div className="absolute top-1 -right-3 flex flex-col gap-[3px]">
                  <div className="w-5 h-[7px] bg-[#22C55E] rounded-full"></div>
                  <div className="w-6 h-[7px] bg-[#3B82F6] rounded-full"></div>
                  <div className="w-5 h-[7px] bg-[#8B5CF6] rounded-full"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white leading-none">WhatSpent</span>
              </div>
            </div>
            <p className="text-sm max-w-xs leading-relaxed text-slate-400">
              Organize seus gastos, cartões e compromissos pelo WhatsApp e acompanhe tudo em um painel pessoal.
            </p>
          </div>
          <div className="md:col-span-2 md:col-start-8">
            <h4 className="text-white font-semibold mb-6">Produto</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#cartoes" className="hover:text-white transition-colors">Cartões</a></li>
              <li><a href="#como-comecar" className="hover:text-white transition-colors">Acesso gratuito</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-6">Empresa</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl mt-16 pt-8 border-t border-white/10 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 WhatSpent. Em validação gratuita.</p>
          <div className="flex items-center gap-2 text-slate-500">
             <Shield className="w-4 h-4"/> Leia nossos termos e política de privacidade.
          </div>
        </div>
      </footer>
    </div>
  );
}
