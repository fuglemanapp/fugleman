"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle, Bell, ArrowUpRight, ArrowDownRight, Folder, CreditCard, ListTodo, Calendar, Plus, Wallet, CheckCircle2, Tags, Building2, Link2, PieChart, Receipt, FileText, Users, Mail, Zap, Send, Briefcase, ShieldCheck, MessageSquare, UserPlus, FileSearch, DownloadCloud, AlertTriangle, Copy, ExternalLink, Trash2, ArrowRightLeft, Search, Filter, Check, Info, BarChart3, RotateCw, Edit2, Lock, X, Landmark, Keyboard, Layers, RefreshCw, ArrowRight, MessageCircle, Clock, CircleDollarSign, Percent, Calendar as CalendarIcon, Tag, Edit, Maximize2, MoreHorizontal, FileText as FileTextIcon, History, Grid3X3, List, Share2, Upload, FolderOpen, Home, ThumbsUp, ThumbsDown, BookOpen, HeadphonesIcon, ArrowLeft, TrendingUp, Bot, Shield } from "lucide-react"


    const toggleTheme = () => {
      document.documentElement.classList.toggle('dark');
    }

export default function MinhaAgendaPage() {
  const [selectedDay, setSelectedDay] = useState(13)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1))
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [useGoogleAgenda, setUseGoogleAgenda] = useState(false)
  const [useGoogleMeet, setUseGoogleMeet] = useState(false)
  const [useRepeat, setUseRepeat] = useState(false)

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDaysStart = Array.from({ length: firstDay }, (_, i) => i)

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    setSelectedDay(1)
  }
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    setSelectedDay(1)
  }
  const handleHoje = () => {
    setCurrentDate(new Date(2026, 6, 1))
    setSelectedDay(13)
  }

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
        <div className="w-full max-w-[1200px] bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">Minha Agenda</h1>
            <p className="text-sm text-slate-500">Gerencie seus compromissos e recorrências.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-[#F8F1FF] hover:bg-[#F3E8FF] text-[#9333EA] font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Compromisso
          </button>
        </div>

        <div className="w-full max-w-[1200px] flex flex-col lg:flex-row gap-6">
          
          {/* Coluna Esquerda: O Calendário */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col">
            
            {/* Header do Calendário */}
            <div className="flex items-center justify-between mb-8">
              <button onClick={handlePrevMonth} className="w-10 h-10 bg-white border border-slate-100 hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-600 shadow-sm transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div className="flex items-center gap-2 text-[22px] font-extrabold text-slate-900 tracking-tight">
                <select
                  value={currentMonth}
                  onChange={(event) => {
                    setCurrentDate((date) => new Date(date.getFullYear(), Number(event.target.value), 1))
                    setSelectedDay(1)
                  }}
                  className="bg-transparent cursor-pointer focus:outline-none"
                >
                  {monthNames.map((month, index) => <option key={month} value={index}>{month}</option>)}
                </select>
                <select
                  value={currentYear}
                  onChange={(event) => setCurrentDate((date) => new Date(Number(event.target.value), date.getMonth(), 1))}
                  className="bg-transparent cursor-pointer focus:outline-none"
                >
                  {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleNextMonth} className="w-10 h-10 bg-white border border-slate-100 hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-600 shadow-sm transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
                <button onClick={handleHoje} className="px-5 py-2.5 bg-white border border-slate-100 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-full transition-colors shadow-sm">
                  Hoje
                </button>
              </div>
            </div>

            {/* Grid do Calendário */}
            <div className="flex-1 flex flex-col min-h-[500px]">
              {/* Dias da Semana */}
              <div className="grid grid-cols-7 mb-4">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
                  <div key={d} className="text-[10px] font-bold text-slate-400 text-center tracking-wider">{d}</div>
                ))}
              </div>

              {/* Dias Numerados */}
              <div className="grid grid-cols-7 flex-1 gap-y-4 gap-x-2">
                {/* Espaços vazios */}
                {emptyDaysStart.map(i => (
                  <div key={`empty-start-${i}`} className="flex justify-center"></div>
                ))}

                {/* Dias do mês */}
                {days.map(day => {
                  const isSelected = selectedDay === day;
                  return (
                    <div key={day} className="flex justify-center h-full min-h-[80px]">
                      <button 
                        onClick={() => setSelectedDay(day)}
                        className={`w-16 h-full flex items-start justify-center pt-3 rounded-2xl transition-all ${
                          isSelected 
                            ? 'bg-[#D8B4FE] text-white font-bold shadow-sm' 
                            : 'text-slate-600 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        {day}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Coluna Direita: Sidebar do Dia */}
          <div className="w-full lg:w-[380px] bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col shrink-0">
            <h2 className="text-xl font-extrabold text-slate-900 mb-8">{selectedDay} de {monthNames[currentMonth].toLowerCase()}</h2>

            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-pink-50 text-pink-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Calendar className="w-8 h-8" fill="currentColor" fillOpacity="0.2" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum evento neste dia</h3>
              <p className="text-[13px] text-slate-500 mb-8 leading-relaxed max-w-[250px]">
                Organize sua agenda e não perca seus prazos importantes.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-sm rounded-xl transition-colors"
              >
                Novo Compromisso
              </button>
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

      {/* MODAL NOVO COMPROMISSO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[800px] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">

            {/* Modal Header */}
            <div className="p-8 pb-6 flex flex-col relative border-b border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-500 border border-blue-100">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">Novo Compromisso</h2>
                  <p className="text-sm text-slate-500 mt-1">Agende um novo evento</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 bg-white flex flex-col md:flex-row gap-12">

              {/* Coluna Esquerda: Informações Básicas */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">INFORMAÇÕES BÁSICAS</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">DESCRIÇÃO</label>
                  <input
                    type="text"
                    placeholder="Ex: Reunião com cliente"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">DATA</label>
                  <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
                    <input
                      type="text"
                      defaultValue="13/07/2026"
                      className="w-full text-slate-700 font-medium focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">INÍCIO</label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      <input
                        type="text"
                        defaultValue="23:18"
                        className="w-full text-slate-700 font-medium focus:outline-none bg-transparent"
                      />
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">TÉRMINO</label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      <input
                        type="text"
                        defaultValue="00:18"
                        className="w-full text-slate-700 font-medium focus:outline-none bg-transparent"
                      />
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Coluna Direita: Opções Adicionais */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">OPÇÕES ADICIONAIS</span>
                </div>

                {/* Lembrete */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 text-[13px]">Lembrete</span>
                  </div>
                  <div className="relative">
                    <select defaultValue="30 minutos" className="w-full appearance-none border border-blue-500 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white cursor-pointer">
                      <option value="Sem lembrete">Sem lembrete</option>
                      <option value="15 minutos">15 minutos</option>
                      <option value="30 minutos">30 minutos</option>
                      <option value="45 minutos">45 minutos</option>
                      <option value="1 hora">1 hora</option>
                      <option value="2 horas">2 horas</option>
                      <option value="3 horas">3 horas</option>
                      <option value="4 horas">4 horas</option>
                      <option value="6 horas">6 horas</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Vincular Pessoas */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[13px]">Vincular pessoas</h4>
                      <p className="text-[10px] text-slate-400">Selecione uma ou mais pessoas para este compromisso.</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 ml-11">Nenhuma pessoa vinculada.</p>
                  <div className="flex items-center border border-slate-100 rounded-xl px-4 py-2.5 bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all focus-within:bg-white ml-11">
                    <input
                      type="text"
                      placeholder="Busque por nome ou documento"
                      className="w-full text-slate-800 text-xs font-medium focus:outline-none bg-transparent placeholder:text-slate-400"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  </div>
                </div>

                {/* Google Agenda */}
                <div className="border border-slate-100 rounded-2xl p-5 flex items-center justify-between bg-white shadow-sm hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[13px]">Google Agenda</h4>
                      <p className="text-[10px] text-slate-400">Sincronize este compromisso.</p>
                    </div>
                  </div>
                  <div
                    onClick={() => setUseGoogleAgenda(!useGoogleAgenda)}
                    className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors duration-300 ${useGoogleAgenda ? 'bg-blue-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${useGoogleAgenda ? 'translate-x-5.5' : 'translate-x-0.5'}`}></div>
                  </div>
                </div>

                {/* Google Meet */}
                <div className="border border-slate-100 rounded-2xl p-5 flex items-center justify-between bg-white shadow-sm hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect><path d="m15 9-3 3 3 3"></path><path d="M9 9v6"></path></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[13px]">Google Meet</h4>
                      <p className="text-[10px] text-slate-400">Gerar link de reunião.</p>
                    </div>
                  </div>
                  <div
                    onClick={() => setUseGoogleMeet(!useGoogleMeet)}
                    className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors duration-300 ${useGoogleMeet ? 'bg-blue-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${useGoogleMeet ? 'translate-x-5.5' : 'translate-x-0.5'}`}></div>
                  </div>
                </div>

                {/* Repetir */}
                <div className="border border-slate-100 rounded-2xl p-5 flex items-center justify-between bg-white shadow-sm hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center shrink-0">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-[13px]">Repetir</h4>
                  </div>
                  <div
                    onClick={() => setUseRepeat(!useRepeat)}
                    className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors duration-300 ${useRepeat ? 'bg-blue-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${useRepeat ? 'translate-x-5.5' : 'translate-x-0.5'}`}></div>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 bg-[#F8F1FF] hover:bg-[#F3E8FF] text-[#9333EA] font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Salvar Compromisso
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
