"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle, Bell, ArrowUpRight, ArrowDownRight, Folder, CreditCard, ListTodo, Calendar, Plus, Wallet, CheckCircle2, Tags, Building2, Link2, PieChart, Receipt, FileText, Users, Mail, Zap, Send, Briefcase, ShieldCheck, MessageSquare, UserPlus, FileSearch, DownloadCloud, AlertTriangle, Copy, ExternalLink, Trash2, ArrowRightLeft, Search, Filter, Check, Info, BarChart3, RotateCw, Edit2, Lock, X, Landmark, Keyboard, Layers, RefreshCw, ArrowRight, MessageCircle, Clock, CircleDollarSign, Percent, Calendar as CalendarIcon, Tag, Edit, Maximize2, MoreHorizontal, FileText as FileTextIcon, History, Grid3X3, List, Share2, Upload, FolderOpen, Home, ThumbsUp, ThumbsDown, BookOpen, HeadphonesIcon, ArrowLeft, TrendingUp, Bot, Shield } from "lucide-react"


    const toggleTheme = () => {
      document.documentElement.classList.toggle('dark');
    }

export default function TransacoesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [type, setType] = useState<'despesa' | 'receita'>('despesa')

  // Estados dos switches
  const [paid, setPaid] = useState(true)
  const [useCreditCard, setUseCreditCard] = useState(false)
  const [useBankAccount, setUseBankAccount] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [installments, setInstallments] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1))
  const [startDate, setStartDate] = useState("2026-07-01")
  const [endDate, setEndDate] = useState("2026-07-31")

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const monthLabel = `${monthNames[currentMonth]} ${currentYear}`
  const changeMonth = (offset: number) => setCurrentDate(new Date(currentYear, currentMonth + offset, 1))

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

      <main className="flex-1 p-4 md:p-8 overflow-auto flex flex-col items-center">
        
        {/* Cabeçalho da Página */}
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Minhas Transações</h1>
          <p className="text-sm text-slate-500">Gerencie todas as suas receitas e despesas</p>
        </div>

        {/* Barra de Filtros e Data */}
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Seletor de Mês */}
            <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100 px-2 py-1">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <span className="font-bold text-slate-900 px-4">{monthLabel}</span>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            {/* Pílulas Semana/Mês/Hoje */}
            <div className="hidden md:flex bg-slate-50 p-1 rounded-xl border border-slate-100 text-xs font-medium">
              <button className="px-4 py-2 text-slate-500 hover:text-slate-800 rounded-lg transition-colors">Semana</button>
              <button className="px-4 py-2 bg-white text-purple-600 rounded-lg shadow-sm">Mês</button>
              <button className="px-4 py-2 text-slate-500 hover:text-slate-800 rounded-lg transition-colors">Hoje</button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Range de Datas */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="bg-transparent focus:outline-none"
              />
              <span>até</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="bg-transparent focus:outline-none"
              />
            </div>
            
            {/* Botão Filtro */}
            <button className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-transparent">
              <Filter className="w-4 h-4" />
            </button>
            
            {/* Botão Nova Transação */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#9333EA] font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 ml-2"
            >
              <Plus className="w-4 h-4" /> Nova Transação
            </button>
          </div>
        </div>

        {/* Barra de Busca */}
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3 mb-6 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-300" />
          <input
            type="text"
            placeholder="Buscar por descrição..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>

        {/* 4 Cards de Resumo */}
        <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {/* Entradas */}
          <div className="bg-gradient-to-br from-green-50/80 to-green-100/50 rounded-2xl p-6 border border-green-50 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-green-600 tracking-widest uppercase mb-1">ENTRADAS</p>
              <h3 className="text-2xl font-bold text-green-700">R$ 0,00</h3>
            </div>
          </div>

          {/* Saídas */}
          <div className="bg-gradient-to-br from-red-50/80 to-red-100/50 rounded-2xl p-6 border border-red-50 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-red-600 tracking-widest uppercase mb-1">SAÍDAS</p>
              <h3 className="text-2xl font-bold text-red-700">R$ 0,00</h3>
            </div>
          </div>

          {/* A Receber */}
          <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 rounded-2xl p-6 border border-blue-50 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mb-1">A RECEBER</p>
              <h3 className="text-2xl font-bold text-blue-700">R$ 0,00</h3>
            </div>
          </div>

          {/* A Pagar */}
          <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/50 rounded-2xl p-6 border border-orange-50 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-orange-600 tracking-widest uppercase mb-1">A PAGAR</p>
              <h3 className="text-2xl font-bold text-orange-700">R$ 0,00</h3>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="w-full max-w-5xl flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-6">
            <ArrowRightLeft className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Nenhuma transação encontrada</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            Cadastre suas receitas e despesas para acompanhar seu fluxo financeiro.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-sm rounded-xl transition-colors"
          >
            Nova Transação
          </button>
        </div>

      </main>

      {/* MODAL NOVA TRANSAÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">

            {/* Modal Header */}
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type === 'despesa' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                  {type === 'despesa' ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Nova Transação</h2>
                  <p className="text-sm text-slate-500">Preencha os detalhes abaixo</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 grid md:grid-cols-12 gap-10">

              {/* Coluna Esquerda (Principal) */}
              <div className="md:col-span-7 flex flex-col gap-6">

                {/* Tipo de Transação (Toggle) */}
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button
                    onClick={() => setType('despesa')}
                    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${type === 'despesa' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <ArrowDownRight className="w-4 h-4" /> Despesa
                  </button>
                  <button
                    onClick={() => setType('receita')}
                    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${type === 'receita' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <ArrowUpRight className="w-4 h-4" /> Receita
                  </button>
                </div>

                {/* Valor */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 tracking-wider mb-2">VALOR DA TRANSAÇÃO</label>
                  <div className="flex items-center border border-slate-100 rounded-2xl px-6 py-5 bg-slate-50 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all focus-within:bg-white">
                    <span className="text-3xl font-bold text-slate-400 mr-2">R$</span>
                    <input
                      type="text"
                      placeholder="0,00"
                      className="w-full text-4xl font-extrabold text-slate-800 placeholder:text-slate-300 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Descrição e Categoria */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider mb-2">DESCRIÇÃO</label>
                    <input
                      type="text"
                      placeholder="Ex: Mercado, Salário..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider mb-2">CATEGORIA</label>
                    <div className="relative">
                      <select defaultValue="" className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white cursor-pointer">
                        <option value="" disabled>Selecione uma categoria</option>
                        {type === 'receita' ? (
                          <>
                            <option value="cartao_credito">Cartão de crédito</option>
                            <option value="transferencia_titular">Transferência mesmo titular</option>
                            <option value="transferencia_terceiros">Transferência para terceiros</option>
                            <option value="tarifas">Tarifas bancárias</option>
                            <option value="recebimentos">Recebimentos</option>
                            <option value="resgate">Resgate aplicação</option>
                            <option value="deposito">Depósito aplicação</option>
                            <option value="outros">Outros</option>
                          </>
                        ) : (
                          <>
                            <option value="cartao_credito">Cartão de crédito</option>
                            <option value="transferencia_titular">Transferência mesmo titular</option>
                            <option value="transferencia_terceiros">Transferência para terceiros</option>
                            <option value="tarifas">Tarifas bancárias</option>
                            <option value="recebimentos">Recebimentos</option>
                            <option value="resgate">Resgate aplicação</option>
                            <option value="deposito">Depósito aplicação</option>
                            <option value="outros">Outros</option>
                            <option value="alimentacao">Alimentação</option>
                            <option value="casa">Casa</option>
                            <option value="cuidados_pessoais">Cuidados pessoais</option>
                            <option value="doacoes">Doações</option>
                            <option value="educacao">Educação</option>
                            <option value="impostos">Impostos</option>
                            <option value="investimentos">Investimentos</option>
                            <option value="lazer">Lazer e Entretenimento</option>
                            <option value="mercado">Mercado</option>
                            <option value="pets">Pets</option>
                            <option value="saude">Saúde</option>
                            <option value="transporte">Transporte</option>
                            <option value="utilidades">Utilidades</option>
                            <option value="vestuario">Vestuário</option>
                            <option value="viagem">Viagem</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Data e Pessoas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider mb-2">HOJE / DATA</label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3.5 bg-white focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
                      <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        defaultValue="13/07/2026"
                        className="w-full text-slate-800 font-medium focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 tracking-wider mb-2">PESSOAS (OPCIONAL)</label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3.5 bg-white focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
                      <UserPlus className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        placeholder="Buscar pessoa..."
                        className="w-full text-slate-800 font-medium focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Coluna Direita (Opções Adicionais) */}
              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">OPÇÕES ADICIONAIS</span>
                </div>

                {/* Switch Cartões de Crédito */}
                <div className="border border-slate-100 rounded-2xl p-5 flex items-center justify-between bg-white shadow-sm hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Cartões de Crédito</span>
                  </div>
                  <div
                    onClick={() => setUseCreditCard(!useCreditCard)}
                    className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors duration-300 ${useCreditCard ? 'bg-[#00C853]' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${useCreditCard ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </div>
                </div>

                {/* Switch Contas Bancárias */}
                <div className="border border-slate-100 rounded-2xl p-5 flex items-center justify-between bg-white shadow-sm hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Contas Bancárias</span>
                  </div>
                  <div
                    onClick={() => setUseBankAccount(!useBankAccount)}
                    className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors duration-300 ${useBankAccount ? 'bg-[#00C853]' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${useBankAccount ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </div>
                </div>

                {/* Switch Já foi pago / recebido? (Dinâmico) */}
                <div className="border border-green-100 rounded-2xl p-5 flex items-center justify-between bg-white shadow-sm hover:border-green-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {type === 'despesa' ? 'Já foi pago?' : 'Já foi recebido?'}
                      </h4>
                      <p className="text-[10px] text-slate-400">Marque se já foi realizado</p>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaid(!paid)}
                    className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors duration-300 ${paid ? 'bg-[#00C853]' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${paid ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </div>
                </div>

                {/* Switch Repetir */}
                <div className="border border-slate-100 rounded-2xl p-5 flex items-center justify-between bg-white shadow-sm hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
                      <ArrowRightLeft className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Repetir</span>
                  </div>
                  <div
                    onClick={() => setRepeat(!repeat)}
                    className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors duration-300 ${repeat ? 'bg-[#00C853]' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${repeat ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </div>
                </div>

                {/* Switch Parcelada */}
                <div className="border border-slate-100 rounded-2xl p-5 flex items-center justify-between bg-white shadow-sm hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <Folder className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Transação Parcelada</span>
                  </div>
                  <div
                    onClick={() => setInstallments(!installments)}
                    className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors duration-300 ${installments ? 'bg-[#00C853]' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${installments ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 md:px-8 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <button className="px-8 py-3.5 bg-[#F8F1FF] hover:bg-[#F3E8FF] text-[#9333EA] font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center gap-2">
                <Check className="w-4 h-4" /> Salvar Transação
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Action Button (WhatsApp Style) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 bg-[#25D366] hover:bg-[#20bd5a] rounded-full flex items-center justify-center shadow-lg text-white transition-transform hover:scale-105">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </button>
      </div>

    </div>
  )
}
