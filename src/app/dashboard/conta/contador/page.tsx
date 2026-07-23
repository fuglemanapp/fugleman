"use client"

import { ChevronDown, HelpCircle, Bell, ArrowUpRight, ArrowDownRight, Folder, CreditCard, ListTodo, Calendar, Plus, Wallet, CheckCircle2, Tags, Building2, Link2, PieChart, Receipt, FileText, Users, Mail, Zap, Send, Briefcase, ShieldCheck, MessageSquare, UserPlus, FileSearch, DownloadCloud, AlertTriangle, Copy, ExternalLink, Trash2, ArrowRightLeft, Search, Filter, Check, Info, BarChart3, RotateCw, Edit2, Lock, X, Landmark, Keyboard, Layers, RefreshCw, ArrowRight, MessageCircle, Clock, CircleDollarSign, Percent, Calendar as CalendarIcon, Tag, Edit, Maximize2, MoreHorizontal, FileText as FileTextIcon, History, Grid3X3, List, Share2, Upload, FolderOpen, Home, ThumbsUp, ThumbsDown, BookOpen, HeadphonesIcon, ArrowLeft, TrendingUp, Bot, Shield } from "lucide-react"

export default function ContadorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent transition-colors duration-300 dark:bg-[#0B0F19] font-sans text-slate-900">

      {/* Top Navbar */}
      <header className="bg-white dark:bg-[#151521] border-b border-slate-200 dark:border-slate-800 h-14 flex items-center px-4 md:px-6 justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-6 h-6 bg-gradient-to-tr from-[#0A1A44] to-[#C084FC] rounded flex items-center justify-center text-white">
              <span className="font-bold text-xs italic">F</span>
            </div>
            <span className="font-bold text-[#0A1A44] dark:text-white tracking-tight">Fugleman</span>
          </a>

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

      <main className="flex-1 p-4 md:p-8 overflow-auto flex flex-col items-center">
        
        {/* Cabeçalho da Página */}
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Minha Conta</h1>
          <p className="text-sm text-slate-500">Gerencie suas informações, preferências e assinatura.</p>
        </div>

        {/* Abas de Navegação */}
        <div className="w-full max-w-5xl flex justify-center mb-8">
          <div className="bg-white rounded-full p-1.5 shadow-sm border border-slate-100 flex items-center text-sm font-medium overflow-x-auto max-w-full hide-scrollbar">
            <a href="/dashboard/conta" className="px-6 py-2 text-slate-500 hover:text-slate-800 whitespace-nowrap transition-colors">Perfil</a>
            <a href="/dashboard/conta/aplicativos" className="px-6 py-2 text-slate-500 hover:text-slate-800 whitespace-nowrap transition-colors">Conectar aplicativos</a>
            <a href="/dashboard/conta/contador" className="px-6 py-2 bg-[#F3E8FF] text-[#9333EA] rounded-full whitespace-nowrap transition-colors">Área do contador</a>
            <a href="/dashboard/conta/personalizar" className="px-6 py-2 text-slate-500 hover:text-slate-800 whitespace-nowrap transition-colors">Personalizar</a>
            <a href="/dashboard/conta/plano" className="px-6 py-2 text-slate-500 hover:text-slate-800 whitespace-nowrap transition-colors">Plano</a>
            <a href="/dashboard/conta/dados" className="px-6 py-2 text-slate-500 hover:text-slate-800 whitespace-nowrap transition-colors">Meus Dados</a>
            <a href="/dashboard/conta/agenda" className="px-6 py-2 text-slate-500 hover:text-slate-800 whitespace-nowrap transition-colors">Agenda</a>
          </div>
        </div>

        {/* Área do Contador (Em breve) - Layout Empilhado Correto */}
        <div className="w-full max-w-5xl rounded-[2rem] bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col mb-8">

          {/* Topo com Fundo Quadriculado e Gradiente */}
          <div className="relative p-8 md:p-12 pb-16 bg-gradient-to-br from-green-50/80 via-blue-50/50 to-purple-50/30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTAgMj4tMjQgMjRMMjQgMEwyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-80 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-50">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="px-3 py-1.5 bg-purple-50 text-purple-600 text-[11px] font-bold tracking-wider rounded-full flex items-center gap-1.5 uppercase">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> EM BREVE
                </span>
              </div>

              <h2 className="text-[32px] md:text-4xl leading-tight font-extrabold text-slate-900 mb-4 tracking-tight max-w-2xl">
                Seu contador com contexto, documentos e IA na mesma rotina.
              </h2>

              <p className="text-base text-slate-500 mb-10 max-w-2xl leading-relaxed">
                Convide seu contador para revisar suas finanças em modo seguro, com dados organizados, relatórios fiscais, documentos e pendências em um só lugar.
              </p>

              {/* Destaque Central */}
              <div className="bg-white rounded-2xl p-6 border-l-4 border-emerald-400 shadow-sm mb-6 flex gap-4 items-start relative z-20">
                <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <p className="text-sm font-medium text-slate-800 leading-relaxed pt-1.5">
                  Em vez de interpretar extratos soltos, o contador verá transações com categoria, descrição, arquivos e histórico. <span className="font-bold">O Fugleman ajuda a transformar seus dados financeiros em uma base muito mais clara para as declarações.</span>
                </p>
              </div>

              {/* Grid 2x2 de Features Menores */}
              <div className="grid md:grid-cols-2 gap-4 relative z-20">
                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Acesso por convite</h4>
                    <p className="text-xs text-slate-500">Permissões e revogação pelo usuário.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Dossiê fiscal</h4>
                    <p className="text-xs text-slate-500">IR, documentos, relatórios e pendências.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Ponte com IA</h4>
                    <p className="text-xs text-slate-500">O agente conversa com cliente e contador.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Revisão guiada</h4>
                    <p className="text-xs text-slate-500">Transações revisadas, dúvidas e comprovantes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Inferior: Benefícios para você e Lista */}
          <div className="bg-white px-8 md:px-12 py-8 border-t border-slate-100 flex flex-col gap-8 relative z-30 w-full">
            <div className="grid lg:grid-cols-12 gap-10">

              <div className="lg:col-span-5 relative">
                {/* Linha vertical de conexão */}
                <div className="absolute left-[19px] top-6 bottom-6 w-px bg-slate-200 z-0"></div>

                <div className="flex flex-col gap-8 relative z-10">
                  <div className="flex gap-5 items-start">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-white">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Convide o contador</h4>
                      <p className="text-xs text-slate-500">Ele entra com login próprio e vê apenas o que você liberar.</p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="w-10 h-10 bg-purple-50 text-purple-500 border border-purple-100 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-white">
                      <FileSearch className="w-4 h-4" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">IA organiza a conversa</h4>
                      <p className="text-xs text-slate-500">Solicita documentos, tira dúvidas e registra o histórico.</p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 border border-blue-100 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-white">
                      <DownloadCloud className="w-4 h-4" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Relatórios prontos</h4>
                      <p className="text-xs text-slate-500">Dossiê de IR, exportações e visão fiscal por cliente.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">BENEFÍCIOS PARA VOCÊ</p>
                      <h3 className="text-[17px] font-extrabold text-slate-900">Menos retrabalho na hora de declarar</h3>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5 flex gap-4 items-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">Dados com contexto</h4>
                        <p className="text-xs text-slate-500">Categorias, descrições e arquivos ajudam o contador a entender cada movimentação.</p>
                      </div>
                    </div>

                    <div className="bg-purple-50/30 border border-purple-100 rounded-2xl p-5 flex gap-4 items-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-500 shadow-sm shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">Menos vai e vem</h4>
                        <p className="text-xs text-slate-500">A IA faz a ponte entre você e o contador para reduzir dúvidas soltas no WhatsApp.</p>
                      </div>
                    </div>

                    <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-5 flex gap-4 items-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">Você no controle</h4>
                        <p className="text-xs text-slate-500">O acesso será por convite, com permissões e revogação quando quiser.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 bg-[#25D366] hover:bg-[#20bd5a] rounded-full flex items-center justify-center shadow-lg text-white transition-transform hover:scale-105">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </button>
      </div>

    </div>
  )
}
