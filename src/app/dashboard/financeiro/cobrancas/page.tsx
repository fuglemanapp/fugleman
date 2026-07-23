"use client"

import { ChevronDown, HelpCircle, Bell, ArrowUpRight, ArrowDownRight, Folder, CreditCard, ListTodo, Calendar, Plus, Wallet, CheckCircle2, Tags, Building2, Link2, PieChart, Receipt, FileText, Users, Mail, Zap, Send, Briefcase, ShieldCheck, MessageSquare, UserPlus, FileSearch, DownloadCloud, AlertTriangle, Copy, ExternalLink, Trash2, ArrowRightLeft, Search, Filter, Check, Info, BarChart3, RotateCw, Edit2, Lock, X, Landmark, Keyboard, Layers, RefreshCw, ArrowRight, MessageCircle, Clock, CircleDollarSign, Percent, Calendar as CalendarIcon, Tag, Edit, Maximize2, MoreHorizontal, FileText as FileTextIcon, History, Grid3X3, List, Share2, Upload, FolderOpen, Home, ThumbsUp, ThumbsDown, BookOpen, HeadphonesIcon, ArrowLeft, TrendingUp, Bot, Shield } from "lucide-react"


    const toggleTheme = () => {
      document.documentElement.classList.toggle('dark');
    }

export default function CobrancasPage() {

  return (
    <div className="flex flex-col min-h-screen bg-transparent transition-colors duration-300 dark:bg-[#0B0F19] font-sans text-slate-900">

      {/* Top Navbar */}
      <header className="bg-white dark:bg-[#151521] border-b border-slate-200 dark:border-slate-800 h-14 flex items-center px-4 md:px-6 justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-6 h-6 bg-gradient-to-tr from-[#0A1A44] to-[#C084FC] rounded flex items-center justify-center text-white">
              <span className="font-bold text-xs italic">F</span>
            </div>
            <span className="font-bold text-[#0A1A44] dark:text-white tracking-tight">Fugleman</span>
          </a>

          {/* Primary Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-slate-500 relative dark:text-slate-400">
            {/* Dropdown Visão Geral */}
            <div className="group relative">
              <button className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 py-4 text-slate-500 dark:text-slate-400">Visão Geral <ChevronDown className="w-3 h-3"/></button>
              <div className="absolute top-full left-0 mt-0 w-64 bg-white dark:bg-[#1E1E2E] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
                <a href="/dashboard" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center shrink-0"><BarChart3 className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Dashboard</div><div className="text-slate-400 text-xs font-normal">Visão geral do sistema</div></div>
                </a>
              </div>
            </div>

            {/* Dropdown Financeiro */}
            <div className="group relative">
              <button className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 py-4 text-slate-500 dark:text-slate-400">Financeiro <ChevronDown className="w-3 h-3"/></button>
              <div className="absolute top-full left-0 mt-0 w-64 bg-white dark:bg-[#1E1E2E] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
                <a href="/dashboard/financeiro/transacoes" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><Wallet className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Transações</div><div className="text-slate-400 text-xs font-normal">Entradas e saídas</div></div>
                </a>
                <a href="/dashboard/financeiro/conciliacao" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Conciliação</div><div className="text-slate-400 text-xs font-normal">Conferir extratos</div></div>
                </a>
                <a href="/dashboard/financeiro/cartoes" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><CreditCard className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Cartões</div><div className="text-slate-400 text-xs font-normal">Gerenciar cartões</div></div>
                </a>
                <a href="/dashboard/financeiro/categorias" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><Tags className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Categorias</div><div className="text-slate-400 text-xs font-normal">Organizar gastos</div></div>
                </a>
                <a href="/dashboard/financeiro/bancos" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><Building2 className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Bancos</div><div className="text-slate-400 text-xs font-normal">Contas bancárias</div></div>
                </a>
                <a href="/dashboard/financeiro/integracoes" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><Link2 className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Integrações</div><div className="text-slate-400 text-xs font-normal">Gerenciar conexões</div></div>
                </a>
                <a href="/dashboard/financeiro/relatorios" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><PieChart className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Relatórios</div><div className="text-slate-400 text-xs font-normal">Análise financeira</div></div>
                </a>
                <a href="/dashboard/financeiro/cobrancas" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><span className="font-bold text-sm">$</span></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Cobranças</div><div className="text-slate-400 text-xs font-normal">Links de pagamento</div></div>
                </a>
                <a href="/dashboard/financeiro/notas-fiscais" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><Receipt className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Notas fiscais</div><div className="text-slate-400 text-xs font-normal">Emissão fiscal</div></div>
                </a>
              </div>
            </div>

            {/* Dropdown Agenda */}
            <div className="group relative">
              <button className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 py-4 text-slate-500 dark:text-slate-400">Agenda <ChevronDown className="w-3 h-3"/></button>
              <div className="absolute top-full left-0 mt-0 w-60 bg-white dark:bg-[#1E1E2E] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
                <a href="/dashboard/agenda" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center shrink-0"><span className="font-bold">📅</span></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Minha Agenda</div><div className="text-slate-400 text-xs font-normal">Visualizar compromissos</div></div>
                </a>
                <a href="/dashboard/agenda/relatorios" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center shrink-0"><PieChart className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Relatórios</div><div className="text-slate-400 text-xs font-normal">Análise de agenda</div></div>
                </a>
                <a href="/dashboard/agenda/integracoes" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center shrink-0"><Link2 className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Integrações</div><div className="text-slate-400 text-xs font-normal">Conectar serviços</div></div>
                </a>
              </div>
            </div>

            {/* Dropdown Organização */}
            <div className="group relative">
              <button className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 py-4 text-slate-500 dark:text-slate-400">Organização <ChevronDown className="w-3 h-3"/></button>
              <div className="absolute top-full left-0 mt-0 w-60 bg-white dark:bg-[#1E1E2E] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
                <a href="/dashboard/organizacao/tarefas" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><ListTodo className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Gerenciador de Tarefas</div><div className="text-slate-400 text-xs font-normal">Acompanhe seus lembretes</div></div>
                </a>
                <a href="/dashboard/organizacao/projetos" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><Folder className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Projetos</div><div className="text-slate-400 text-xs font-normal">Acompanhe seus projetos</div></div>
                </a>
                <a href="/dashboard/organizacao/categorias" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><Tags className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Categorias</div><div className="text-slate-400 text-xs font-normal">Classifique suas demandas</div></div>
                </a>
                <a href="/dashboard/organizacao/arquivos" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><Folder className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Arquivos</div><div className="text-slate-400 text-xs font-normal">Organize em nuvem</div></div>
                </a>
                <a href="/dashboard/organizacao/notas" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><FileText className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Notas</div><div className="text-slate-400 text-xs font-normal">Anotações e briefings</div></div>
                </a>
                <a href="/dashboard/organizacao/relatorios" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><PieChart className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Relatórios</div><div className="text-slate-400 text-xs font-normal">Resultados de organização</div></div>
                </a>
              </div>
            </div>

            {/* Dropdown Cadastros */}
            <div className="group relative">
              <button className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 py-4 text-slate-500 dark:text-slate-400">Cadastros <ChevronDown className="w-3 h-3"/></button>
              <div className="absolute top-full left-0 mt-0 w-60 bg-white dark:bg-[#1E1E2E] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
                <a href="/dashboard/cadastros/pessoas" className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center shrink-0"><Users className="w-4 h-4"/></div>
                  <div><div className="text-slate-900 dark:text-white font-semibold text-sm">Pessoas</div><div className="text-slate-400 text-xs font-normal">Gerenciar contatos</div></div>
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4 text-slate-400">
          <a href="/dashboard/conta" className="flex items-center gap-2 bg-[#F8E8F8] text-[#C084FC] px-2 py-1 rounded-full text-xs font-bold mr-2 hover:bg-[#F3E8FF] transition-colors">
            <div className="w-5 h-5 rounded-full bg-[#C084FC] text-white flex items-center justify-center text-[10px]">MA</div>
            <span>Minha Conta</span>
          </a>
          <a href="/dashboard/ajuda" className="p-1 theme-text-secondary hover:theme-text-primary transition-colors">
            <HelpCircle className="w-5 h-5" />
          </a>
          <button 
            onClick={(e) => {
              const html = document.documentElement;
              const isDark = html.classList.toggle('dark');
              localStorage.setItem('fugleman-theme', isDark ? 'dark' : 'light');
              const moon = e.currentTarget.querySelector('.moon-icon') as HTMLElement;
              const sun = e.currentTarget.querySelector('.sun-icon') as HTMLElement;
              if(isDark) { moon.style.display = 'none'; sun.style.display = 'block'; }
              else { moon.style.display = 'block'; sun.style.display = 'none'; }
            }} 
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            title="Alternar Tema"
          >
            <svg className="w-5 h-5 moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <svg className="w-5 h-5 sun-icon" style={{display: 'none'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </button>
          <svg className="w-5 h-5 hover:text-slate-600 dark:hover:text-white cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 flex flex-col items-center">
        
        {/* Full Page Gradient Container */}
        <div className="w-full max-w-5xl rounded-[2.5rem] bg-gradient-to-br from-green-50/60 via-purple-50/50 to-blue-50/40 relative overflow-hidden shadow-sm">
          
          {/* Fundo quadriculado */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTAgMjRMIDI0IDI0IEwyNCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwwLDAsMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-60 pointer-events-none"></div>
          
          <div className="relative z-10 p-8 md:p-12 h-full w-full">
            
            {/* Header Content */}
            <div className="max-w-2xl mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="font-bold text-lg">$</span>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold tracking-wider rounded-full flex items-center gap-1.5 uppercase">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> EM BREVE
                </span>
              </div>
              
              <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">COBRANÇAS</p>
              <h2 className="text-[32px] md:text-4xl leading-tight font-extrabold text-slate-900 mb-6 tracking-tight">
                Receba sem fazer a parte chata
              </h2>
              
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Gere cobranças pelo painel ou pelo WhatsApp e receba direto na sua conta bancária por Pix, boleto ou cartão de crédito em até 12x, com recebimento na hora no cartão. O Fugleman envia o link, conversa com o pagador, acompanha o vencimento e conduz a cobrança por você com contexto e persistência.
              </p>
            </div>

            {/* Destaque Central */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border-l-4 border-purple-400 shadow-sm mb-6 flex gap-4 items-center">
              <div className="w-8 h-8 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                Não será só um lembrete: será uma cobrança conversada, acompanhada e registrada até o pagamento.
              </p>
            </div>

            {/* Grid de Features (4 Cards) */}
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-[13px] mb-1">Crie em segundos</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Pelo painel ou WhatsApp, sem montar mensagem manualmente.</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-[13px] mb-1">Fugleman cobra</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Ele envia o link, conversa com o pagador e acompanha o vencimento.</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-[13px] mb-1">Receba na sua conta</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">O pagamento cai direto para você por Pix, boleto ou cartão.</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-[13px] mb-1">Parcele em até 12x</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Ofereça cartão de crédito com recebimento na hora.</p>
                </div>
              </div>
            </div>

            {/* Bottom Card - Automação e Métricas */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-sm border border-white">
              
              {/* Automação List */}
              <div className="flex flex-col gap-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 mt-1">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-[15px] mb-1">Automação de cobrança</h3>
                    <p className="text-xs text-slate-500">Painel, WhatsApp e IA trabalhando juntos</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-2">
                  <div className="w-6 h-6 text-purple-400 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Você pede pelo painel ou WhatsApp e o Fugleman cria o link de cobrança.</p>
                </div>

                <div className="flex items-center gap-4 pl-2">
                  <div className="w-6 h-6 text-purple-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Ele envia ao pagador, conversa em seu nome e faz a parte chata com educação.</p>
                </div>

                <div className="flex items-center gap-4 pl-2">
                  <div className="w-6 h-6 text-purple-400 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">Receba direto na conta por Pix, boleto ou cartão em até 12x.</p>
                </div>
              </div>

              {/* Grid de Métricas 2x2 */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Em Aberto */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">EM ABERTO</span>
                    <div className="w-6 h-6 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center"><Clock className="w-3 h-3"/></div>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-700 relative z-10">R$ 18.600,00</h3>
                </div>

                {/* Recebido */}
                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-[10px] font-bold text-green-600 tracking-widest uppercase">RECEBIDO</span>
                    <div className="w-6 h-6 bg-green-100 text-green-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3"/></div>
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 relative z-10">R$ 42.980,00</h3>
                </div>

                {/* Em Atraso */}
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-[10px] font-bold text-red-600 tracking-widest uppercase">EM ATRASO</span>
                    <div className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center"><AlertTriangle className="w-3 h-3"/></div>
                  </div>
                  <h3 className="text-2xl font-bold text-red-700 relative z-10">R$ 4.250,00</h3>
                </div>

                {/* Total Previsto */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-6 flex flex-col relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-[10px] font-bold text-purple-600 tracking-widest uppercase">TOTAL PREVISTO</span>
                    <div className="w-6 h-6 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center"><BarChart3 className="w-3 h-3"/></div>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-700 relative z-10">R$ 65.830,00</h3>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Floating Action Button (WhatsApp Style) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 bg-[#25D366] hover:bg-[#20bd5a] rounded-full flex items-center justify-center shadow-lg text-white transition-transform hover:scale-105">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </button>
      </div>

    </div>
  )
}
