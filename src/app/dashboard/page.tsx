"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle, Bell, ArrowUpRight, ArrowDownRight, Folder, CreditCard, ListTodo, Calendar, Plus, Wallet, CheckCircle2, Tags, Building2, Link2, PieChart, Receipt, FileText, Users, Mail, Zap, Send, Briefcase, ShieldCheck, MessageSquare, UserPlus, FileSearch, DownloadCloud, AlertTriangle, Copy, ExternalLink, Trash2, ArrowRightLeft, Search, Filter, Check, Info, BarChart3, RotateCw, Edit2, Lock, X, Landmark, Keyboard, Layers, RefreshCw, ArrowRight, MessageCircle, Clock, CircleDollarSign, Percent, Calendar as CalendarIcon, Tag, Edit, Maximize2, MoreHorizontal, FileText as FileTextIcon, History, Grid3X3, List, Share2, Upload, FolderOpen, Home, ThumbsUp, ThumbsDown, BookOpen, HeadphonesIcon, ArrowLeft, TrendingUp, Bot, Shield } from "lucide-react"


    const toggleTheme = () => {
      document.documentElement.classList.toggle('dark');
    }

export default function DashboardPage() {
  
  const [period, setPeriod] = useState("Mês")
  const [showCalendarPopup, setShowCalendarPopup] = useState(false)
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1))
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date(2026, 6, 1))
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date(2026, 6, 31))

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const emptyDaysStart = Array.from({ length: firstDay }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const monthLabel = `${monthNames[currentMonth]} ${currentYear}`

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  const formatDate = (date: Date | null) => date ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}` : ''
  const getDayDate = (day: number) => new Date(currentYear, currentMonth, day)
  const isSameDay = (date: Date | null, day: number) => date?.getFullYear() === currentYear && date.getMonth() === currentMonth && date.getDate() === day
  const dateRangeLabel = selectedStartDate && selectedEndDate
    ? `${formatDate(selectedStartDate)} até ${formatDate(selectedEndDate)}`
    : selectedStartDate
      ? `${formatDate(selectedStartDate)} até ...`
      : 'Selecione um período'

  const handleDayClick = (day: number) => {
    const clickedDate = getDayDate(day)

    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(clickedDate)
      setSelectedEndDate(null)
      return
    }

    if (clickedDate < selectedStartDate) {
      setSelectedStartDate(clickedDate)
      setSelectedEndDate(selectedStartDate)
      return
    }

    setSelectedEndDate(clickedDate)
  }

  const isSelected = (day: number) => {
    const dayDate = getDayDate(day)
    const startTime = selectedStartDate?.getTime()
    const endTime = selectedEndDate?.getTime() ?? startTime

    return startTime !== undefined && endTime !== undefined && dayDate.getTime() >= startTime && dayDate.getTime() <= endTime
  }
  const isStart = (day: number) => isSameDay(selectedStartDate, day)
  const isEnd = (day: number) => isSameDay(selectedEndDate, day)

  const CalendarPopup = () => (
    <div className="absolute top-full right-0 mt-2 theme-bg-card rounded-2xl shadow-xl border theme-border p-4 w-[320px] z-50 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between mb-4 px-2">
        <button onClick={prevMonth} className="p-1 hover:theme-bg-elevated rounded theme-text-secondary transition-colors">{'<'}</button>
        <div className="font-bold theme-text-primary flex items-center gap-2">
          <select
            value={currentMonth}
            onChange={(event) => setCurrentDate((date) => new Date(date.getFullYear(), Number(event.target.value), 1))}
            className="bg-transparent cursor-pointer hover:text-purple-500 focus:outline-none"
          >
            {monthNames.map((month, index) => <option key={month} value={index}>{month}</option>)}
          </select>
          <select
            value={currentYear}
            onChange={(event) => setCurrentDate((date) => new Date(Number(event.target.value), date.getMonth(), 1))}
            className="bg-transparent cursor-pointer hover:text-purple-500 focus:outline-none"
          >
            {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <button onClick={nextMonth} className="p-1 hover:theme-bg-elevated rounded theme-text-secondary transition-colors">{'>'}</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
          <div key={d} className="text-[10px] font-bold theme-text-secondary">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-sm theme-text-primary">
        {emptyDaysStart.map(i => (
          <div key={`empty-${i}`} className="py-1.5 text-slate-300 dark:text-slate-600 flex items-center justify-center">
             {new Date(currentYear, currentMonth, 0).getDate() - firstDay + i + 1}
          </div>
        ))}
        {days.map(day => {
          const selected = isSelected(day)
          const start = isStart(day)
          const end = isEnd(day)
          const middle = selected && !start && !end
          return (
            <div key={day} onClick={() => handleDayClick(day)} className="py-1.5 flex justify-center relative group cursor-pointer">
              {selected && !start && !end && <div className="absolute inset-y-0 left-0 right-0 bg-purple-500/10 -z-10"></div>}
              {start && selectedStartDate?.getTime() !== selectedEndDate?.getTime() && <div className="absolute inset-y-0 right-0 w-1/2 bg-purple-500/10 -z-10"></div>}
              {end && selectedStartDate?.getTime() !== selectedEndDate?.getTime() && <div className="absolute inset-y-0 left-0 w-1/2 bg-purple-500/10 -z-10"></div>}
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                start || end ? 'bg-purple-500 text-white font-bold shadow-sm' : middle ? 'font-medium text-purple-600 dark:text-purple-400' : 'hover:theme-bg-elevated'
              }`}>
                {day}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const togglePeriod = (p: string) => setPeriod(p)


  return (
    <div className="flex flex-col min-h-screen theme-bg-main transition-colors duration-300 font-sans theme-text-primary ">

      {/* Top Navbar */}
      <header className="theme-bg-header border-b theme-border-strong transition-colors duration-300 h-14 flex items-center px-4 md:px-6 justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-6 h-6 bg-gradient-to-tr from-[#0A1A44] to-[#C084FC] rounded flex items-center justify-center text-white">
              <span className="font-bold text-xs italic">F</span>
            </div>
            <span className="font-bold text-[#0A1A44]  tracking-tight">Fugleman</span>
          </a>

          {/* Primary Nav with Hover Dropdowns */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium theme-text-secondary relative dark:text-slate-400">
            {/* Dropdown Visão Geral */}
            <div className="group relative">
              <button className="hover:theme-text-primary dark:hover:text-white flex items-center gap-1 py-4 theme-text-secondary">Visão Geral <ChevronDown className="w-3 h-3"/></button>
              <div className="absolute top-full left-0 mt-0 w-64 theme-bg-card  rounded-[1.5rem] shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
                <a href="/dashboard" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center shrink-0"><BarChart3 className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Dashboard</div><div className="text-slate-400 text-xs font-normal">Visão geral do sistema</div></div>
                </a>
              </div>
            </div>

            {/* Dropdown Financeiro */}
            <div className="group relative">
              <button className="hover:theme-text-primary dark:hover:text-white flex items-center gap-1 py-4 theme-text-secondary">Financeiro <ChevronDown className="w-3 h-3"/></button>
              <div className="absolute top-full left-0 mt-0 w-64 theme-bg-card  rounded-[1.5rem] shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
                <a href="/dashboard/financeiro/transacoes" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><Wallet className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Transações</div><div className="text-slate-400 text-xs font-normal">Entradas e saídas</div></div>
                </a>
                <a href="/dashboard/financeiro/conciliacao" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Conciliação</div><div className="text-slate-400 text-xs font-normal">Conferir extratos</div></div>
                </a>
                <a href="/dashboard/financeiro/cartoes" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><CreditCard className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Cartões</div><div className="text-slate-400 text-xs font-normal">Gerenciar cartões</div></div>
                </a>
                <a href="/dashboard/financeiro/categorias" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><Tags className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Categorias</div><div className="text-slate-400 text-xs font-normal">Organizar gastos</div></div>
                </a>
                <a href="/dashboard/financeiro/bancos" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><Building2 className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Bancos</div><div className="text-slate-400 text-xs font-normal">Contas bancárias</div></div>
                </a>
                <a href="/dashboard/financeiro/integracoes" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><Link2 className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Integrações</div><div className="text-slate-400 text-xs font-normal">Gerenciar conexões</div></div>
                </a>
                <a href="/dashboard/financeiro/relatorios" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><PieChart className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Relatórios</div><div className="text-slate-400 text-xs font-normal">Análise financeira</div></div>
                </a>
                <a href="/dashboard/financeiro/cobrancas" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><span className="font-bold text-sm">$</span></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Cobranças</div><div className="text-slate-400 text-xs font-normal">Links de pagamento</div></div>
                </a>
                <a href="/dashboard/financeiro/notas-fiscais" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-pink-50 dark:bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center shrink-0"><Receipt className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Notas fiscais</div><div className="text-slate-400 text-xs font-normal">Emissão fiscal</div></div>
                </a>
              </div>
            </div>

            {/* Dropdown Agenda */}
            <div className="group relative">
              <button className="hover:theme-text-primary dark:hover:text-white flex items-center gap-1 py-4 theme-text-secondary">Agenda <ChevronDown className="w-3 h-3"/></button>
              <div className="absolute top-full left-0 mt-0 w-60 theme-bg-card  rounded-[1.5rem] shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
                <a href="/dashboard/agenda" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center shrink-0"><span className="font-bold">📅</span></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Minha Agenda</div><div className="text-slate-400 text-xs font-normal">Visualizar compromissos</div></div>
                </a>
                <a href="/dashboard/agenda/relatorios" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center shrink-0"><PieChart className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Relatórios</div><div className="text-slate-400 text-xs font-normal">Análise de agenda</div></div>
                </a>
                <a href="/dashboard/agenda/integracoes" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center shrink-0"><Link2 className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Integrações</div><div className="text-slate-400 text-xs font-normal">Conectar serviços</div></div>
                </a>
              </div>
            </div>

            {/* Dropdown Organização */}
            <div className="group relative">
              <button className="hover:theme-text-primary dark:hover:text-white flex items-center gap-1 py-4 theme-text-secondary">Organização <ChevronDown className="w-3 h-3"/></button>
              <div className="absolute top-full left-0 mt-0 w-60 theme-bg-card  rounded-[1.5rem] shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
                <a href="/dashboard/organizacao/tarefas" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><ListTodo className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Gerenciador de Tarefas</div><div className="text-slate-400 text-xs font-normal">Acompanhe seus lembretes</div></div>
                </a>
                <a href="/dashboard/organizacao/projetos" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><Folder className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Projetos</div><div className="text-slate-400 text-xs font-normal">Acompanhe seus projetos</div></div>
                </a>
                <a href="/dashboard/organizacao/categorias" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><Tags className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Categorias</div><div className="text-slate-400 text-xs font-normal">Classifique suas demandas</div></div>
                </a>
                <a href="/dashboard/organizacao/arquivos" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><Folder className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Arquivos</div><div className="text-slate-400 text-xs font-normal">Organize em nuvem</div></div>
                </a>
                <a href="/dashboard/organizacao/notas" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><FileText className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Notas</div><div className="text-slate-400 text-xs font-normal">Anotações e briefings</div></div>
                </a>
                <a href="/dashboard/organizacao/relatorios" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center shrink-0"><PieChart className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Relatórios</div><div className="text-slate-400 text-xs font-normal">Resultados de organização</div></div>
                </a>
              </div>
            </div>

            {/* Dropdown Cadastros */}
            <div className="group relative">
              <button className="hover:theme-text-primary dark:hover:text-white flex items-center gap-1 py-4 theme-text-secondary">Cadastros <ChevronDown className="w-3 h-3"/></button>
              <div className="absolute top-full left-0 mt-0 w-60 theme-bg-card  rounded-[1.5rem] shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50 py-2">
                <a href="/dashboard/cadastros/pessoas" className="flex items-start gap-3 px-4 py-3 hover:theme-bg-elevated dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center shrink-0"><Users className="w-4 h-4"/></div>
                  <div><div className="theme-text-primary font-semibold text-sm">Pessoas</div><div className="text-slate-400 text-xs font-normal">Gerenciar contatos</div></div>
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6 text-slate-400">
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
            className="p-1 text-slate-400 hover:theme-text-secondary transition-colors"
            title="Alternar Tema"
          >
            <svg className="w-5 h-5 moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <svg className="w-5 h-5 sun-icon" style={{display: 'none'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </button>
          <svg className="w-5 h-5 hover:theme-text-secondary dark:hover:text-white cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </div>
      </header>

      {/* Secondary Toolbar */}
      <div className="theme-bg-card border-b border-slate-100 transition-colors duration-300 h-12 flex items-center px-4 md:px-6 justify-between shrink-0 relative z-40">
        <div className="flex items-center gap-2 text-sm font-medium">
          <button onClick={prevMonth} className="p-1 hover:theme-bg-elevated rounded text-slate-400">{'<'}</button>
          <span className="theme-text-primary w-28 text-center">{monthLabel.toUpperCase()}</span>
          <button onClick={nextMonth} className="p-1 hover:theme-bg-elevated rounded text-slate-400">{'>'}</button>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium relative">
          <div className="flex theme-bg-elevated  p-0.5 rounded-lg border border-slate-200 ">
            <button
              onClick={() => togglePeriod('Semana')}
              className={`px-3 py-1 rounded-md transition-colors ${period === 'Semana' ? 'theme-bg-card  shadow-sm text-purple-600 dark:text-purple-400' : 'theme-text-secondary hover:text-slate-700'}`}
            >
              Semana
            </button>
            <button
              onClick={() => togglePeriod('Mês')}
              className={`px-3 py-1 rounded-md transition-colors ${period === 'Mês' ? 'theme-bg-card  shadow-sm text-purple-600 dark:text-purple-400' : 'theme-text-secondary hover:text-slate-700'}`}
            >
              Mês
            </button>
            <button
              onClick={() => togglePeriod('Hoje')}
              className={`px-3 py-1 rounded-md transition-colors ${period === 'Hoje' ? 'theme-bg-card  shadow-sm text-purple-600 dark:text-purple-400' : 'theme-text-secondary hover:text-slate-700'}`}
            >
              Hoje
            </button>
          </div>

          {/* Calendar Button & Popover */}
          <div className="relative">
            <button
              onClick={() => setShowCalendarPopup(!showCalendarPopup)}
              className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors ${showCalendarPopup ? 'border-purple-300 ring-2 ring-purple-500/20 text-purple-700 bg-purple-50' : 'border-slate-200 theme-text-secondary theme-bg-card hover:theme-bg-elevated'}`}
            >
              <Calendar className="w-3 h-3" />
              {dateRangeLabel}
            </button>

            {/* Popover Content */}
            {showCalendarPopup && <CalendarPopup />}
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <main className="flex-1 p-6 md:p-6 overflow-auto dark:bg-[#0B0F19]">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* COLUNA ESQUERDA (Métricas Rápidas) */}
          <div className="md:col-span-4 flex flex-col gap-8">

            {/* Saldo do Período */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-6 relative overflow-hidden min-h-[180px] flex flex-col">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white dark:from-[#2E1A47] via-purple-50/50 dark:via-[#1D1B36] to-purple-100/40 dark:to-[#121727] pointer-events-none"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div>
                  <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase">SALDO DO PERÍODO</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Saldo (Receitas - Despesas) no período selecionado.</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center mt-2">
                  <BarChart3 className="w-6 h-6 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Sem dados</p>
                  <p className="text-[10px] text-slate-400 mb-3">Nenhum saldo registrado.</p>
                  <a href="/dashboard/financeiro/transacoes" className="text-xs font-medium theme-text-secondary border border-slate-200 px-3 py-1 rounded-md hover:theme-bg-elevated transition-colors">
                    Adicionar
                  </a>
                </div>
              </div>
            </div>

            {/* Saldo Bancário */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-6 flex flex-col justify-between">
              <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase flex items-center gap-2">
                <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                SALDO BANCÁRIO TOTAL
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5 mb-3">Soma de todas as contas cadastradas</p>
              <div className="text-2xl font-bold theme-text-primary mb-2">R$ 0,00</div>
              <a href="/dashboard/financeiro/bancos" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">Ver todas as contas &gt;</a>
            </div>

            {/* Grid 2x2 (Receitas, Despesas, etc) */}
            <div className="grid grid-cols-2 gap-6">
              {/* Receitas */}
              <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-6 h-28 flex flex-col relative">
                <div className="absolute top-6 left-4 w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                </div>
                <span className="text-[10px] font-bold text-green-500 absolute top-6 right-4">Receitas</span>
                <div className="flex-1 flex flex-col items-center justify-end text-center mt-auto pt-2">
                  <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                  <p className="text-[9px] text-slate-400">Sem receitas no período.</p>
                </div>
              </div>

              {/* Despesas */}
              <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-6 h-28 flex flex-col relative">
                <div className="absolute top-6 left-4 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center">
                  <ArrowDownRight className="w-3 h-3 text-red-500" />
                </div>
                <span className="text-[10px] font-bold text-red-500 absolute top-6 right-4">Despesas</span>
                <div className="flex-1 flex flex-col items-center justify-end text-center mt-auto pt-2">
                  <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                  <p className="text-[9px] text-slate-400">Sem despesas no período.</p>
                </div>
              </div>

              {/* Contas a Pagar (Atrasadas) */}
              <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-6 h-28 flex flex-col relative">
                <div className="absolute top-6 left-4 w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                </div>
                <span className="text-[10px] font-bold text-blue-500 absolute top-6 right-4">Parceladas</span>
                <div className="flex-1 flex flex-col items-center justify-end text-center mt-auto pt-2">
                  <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                  <p className="text-[9px] text-slate-400">Sem dados</p>
                </div>
              </div>

              {/* Contas a Receber */}
              <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-6 h-28 flex flex-col relative">
                <div className="absolute top-6 left-4 w-6 h-6 bg-purple-50 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                </div>
                <span className="text-[10px] font-bold text-purple-500 absolute top-6 right-4">Recorrentes</span>
                <div className="flex-1 flex flex-col items-center justify-end text-center mt-auto pt-2">
                  <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                  <p className="text-[9px] text-slate-400">Sem dados</p>
                </div>
              </div>

              <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-6 h-28 flex flex-col relative">
                <div className="absolute top-6 left-4 w-6 h-6 bg-orange-50 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                </div>
                <span className="text-[10px] font-bold text-orange-500 absolute top-6 right-4">Atrasado</span>
                <div className="flex-1 flex flex-col items-center justify-end text-center mt-auto pt-2">
                  <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                  <p className="text-[9px] text-slate-400">Tudo em dia! 🎉</p>
                </div>
              </div>

              <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-6 h-28 flex flex-col relative">
                <div className="absolute top-6 left-4 w-6 h-6 bg-emerald-50 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 absolute top-6 right-4">Atrasado</span>
                <div className="flex-1 flex flex-col items-center justify-end text-center mt-auto pt-2">
                  <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                  <p className="text-[9px] text-slate-400">Tudo recebido! 💰</p>
                </div>
              </div>
            </div>

            {/* Tarefas por status */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-8 min-h-[160px] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase flex items-center gap-2">
                  <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                  TAREFAS POR STATUS
                </h3>
                <div className="flex gap-2 text-[10px] text-emerald-500">
                  <span>0 tarefas</span>
                  <a href="/dashboard/organizacao/tarefas" className="hover:text-emerald-400 transition-colors">Ver tarefas &gt;</a>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mb-2">Distribuição no período</p>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <ListTodo className="w-5 h-5 text-slate-300 mb-1" />
                <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                <p className="text-[9px] text-slate-400">Nenhuma tarefa com prazo neste período.</p>
              </div>
            </div>

          </div>

          {/* COLUNA DO MEIO (Gráficos principais) */}
          <div className="md:col-span-4 flex flex-col gap-8">

            {/* Categorias */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-8 min-h-[260px] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase flex items-center gap-2">
                  <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                  CATEGORIAS
                </h3>
                <div className="flex theme-bg-elevated p-0.5 rounded border border-slate-100 dark:border-white/5 text-[9px]">
                  <button className="px-2 py-0.5 theme-bg-card  shadow-sm text-purple-600 dark:text-purple-400 rounded-sm">Pago</button>
                  <button className="px-2 py-0.5 theme-text-secondary">A Pagar</button>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <BarChart3 className="w-6 h-6 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                <p className="text-[10px] text-slate-400 mb-3">Nenhuma despesa categorizada neste período.</p>
                <a href="/dashboard/financeiro/categorias" className="text-[10px] font-medium theme-text-secondary border border-slate-200 px-3 py-1.5 rounded-md hover:theme-bg-elevated transition-colors inline-block">Adicionar Despesa</a>
              </div>
            </div>

            {/* Gastos por Cartão */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-8 min-h-[220px] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase flex items-center gap-2">
                  <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                  GASTOS POR CARTÃO
                </h3>
                <a href="/dashboard/financeiro/cartoes" className="text-xs font-medium text-purple-500 hover:text-purple-400 transition-colors">Ver todos &gt;</a>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <CreditCard className="w-6 h-6 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                <p className="text-[10px] text-slate-400 mb-3">Nenhum cartão de crédito cadastrado.</p>
                <a href="/dashboard/financeiro/cartoes" className="text-[10px] font-medium theme-text-secondary border border-slate-200 px-3 py-1.5 rounded-md hover:theme-bg-elevated transition-colors inline-block">Cadastrar Cartão</a>
              </div>
            </div>

            {/* Despesas por Usuário */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-8 min-h-[160px] flex flex-col justify-between">
              <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase flex items-center gap-2 mb-4">
                <div className="w-1 h-3 bg-red-500 rounded-full"></div>
                DESPESAS POR USUÁRIO
              </h3>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                <p className="text-[10px] text-slate-400 mb-3">Nenhuma despesa por usuário neste período.</p>
                <a href="/dashboard/cadastros/pessoas" className="text-[10px] font-medium theme-text-secondary border border-slate-200 px-3 py-1.5 rounded-md hover:theme-bg-elevated transition-colors inline-block">Gerenciar Usuários</a>
              </div>
            </div>

            {/* Tarefas por Projeto */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-8 min-h-[160px] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase flex items-center gap-2">
                  <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                  TAREFAS POR PROJETO
                </h3>
                <a href="/dashboard/organizacao/projetos" className="text-xs font-medium text-purple-500 hover:text-purple-400 transition-colors">Ver projetos &gt;</a>
              </div>
              <p className="text-[10px] text-slate-400 mb-2">Todas com tarefas vinculadas</p>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Folder className="w-5 h-5 text-slate-300 mb-1" />
                <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                <p className="text-[9px] text-slate-400 mb-3">Nenhum projeto com tarefa vinculada.</p>
                <a href="/dashboard/organizacao/projetos" className="text-[10px] font-medium theme-text-secondary border border-slate-200 px-3 py-1.5 rounded-md hover:theme-bg-elevated transition-colors inline-block">Ver projetos</a>
              </div>
            </div>

          </div>

          {/* COLUNA DIREITA (Fluxo, Faturas, Calendário) */}
          <div className="md:col-span-4 flex flex-col gap-8">

            {/* Fluxo de Caixa */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-8 min-h-[260px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase flex items-center gap-2">
                    <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                    FLUXO DE CAIXA
                  </h3>
                  <div className="text-xl font-bold theme-text-primary mt-1">R$ 0,00</div>
                </div>
                <div className="flex theme-bg-elevated p-0.5 rounded border border-slate-100 dark:border-white/5 text-[9px]">
                  <button className="px-2 py-0.5 theme-text-secondary">Realizado</button>
                  <button className="px-2 py-0.5 theme-bg-card  shadow-sm text-purple-600 dark:text-purple-400 rounded-sm">Projetado</button>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center mt-auto pt-4">
                <BarChart3 className="w-6 h-6 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                <p className="text-[10px] text-slate-400 mb-3">Nenhum fluxo de caixa registrado neste período.</p>
                <button className="text-[10px] font-medium theme-text-secondary border border-slate-200 px-3 py-1.5 rounded-md hover:theme-bg-elevated">Adicionar Transação</button>
              </div>
            </div>

            {/* Faturas dos Cartões */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-8 min-h-[220px] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase flex items-center gap-2">
                  <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                  FATURAS DOS CARTÕES
                </h3>
                <a href="/dashboard/financeiro/cartoes" className="text-xs font-medium text-purple-500 hover:text-purple-400 transition-colors">Ver cartões &gt;</a>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <CreditCard className="w-6 h-6 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                <p className="text-[10px] text-slate-400 mb-3 max-w-[200px] mx-auto">Adicione um cartão de crédito para acompanhar as faturas por aqui.</p>
                <a href="/dashboard/financeiro/cartoes" className="text-[10px] font-medium theme-text-secondary border border-slate-200 px-3 py-1.5 rounded-md hover:theme-bg-elevated transition-colors inline-block">Adicionar cartão</a>
              </div>
            </div>

            {/* Movimentação Diária */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-8 min-h-[160px] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase flex items-center gap-2">
                    <div className="w-1 h-3 bg-slate-400 rounded-full"></div>
                    MOVIMENTAÇÃO DIÁRIA
                  </h3>
                  <div className="text-lg font-bold theme-text-primary mt-1">R$ 0,00</div>
                </div>
                <div className="flex theme-bg-elevated p-0.5 rounded border border-slate-100 dark:border-white/5 text-[9px]">
                  <button className="px-2 py-0.5 theme-text-secondary">Realizado</button>
                  <button className="px-2 py-0.5 theme-bg-card  shadow-sm text-purple-600 dark:text-purple-400 rounded-sm">Projetado</button>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <BarChart3 className="w-6 h-6 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Sem dados</p>
                <p className="text-[10px] text-slate-400 mb-3">Nenhuma movimentação diária no período.</p>
                <button className="text-[10px] font-medium theme-text-secondary border border-slate-200 px-3 py-1.5 rounded-md hover:theme-bg-elevated">Registrar Movimentação</button>
              </div>
            </div>

            {/* Compromissos Hoje */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-8 h-[80px] flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase flex items-center gap-2">
                  <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                  COMPROMISSOS HOJE
                </h3>
                <a href="/dashboard/agenda" className="text-xs font-medium text-orange-500 hover:text-orange-400 transition-colors">Ver Agenda &gt;</a>
              </div>
              <div className="flex flex-col items-center justify-center text-center py-2">
                <BarChart3 className="w-4 h-4 text-slate-300 mb-1" />
                <p className="text-[10px] font-semibold text-slate-700 mb-1">Sem dados</p>
              </div>
            </div>

            {/* Compromissos da Semana */}
            <div className="theme-bg-card  rounded-[1.5rem] shadow-sm border border-slate-100  transition-colors duration-300 p-8 h-[80px] flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs font-bold theme-text-primary tracking-wide uppercase flex items-center gap-2">
                  <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                  COMPROMISSOS DA SEMANA
                </h3>
                <a href="/dashboard/agenda" className="text-xs font-medium text-emerald-500 hover:text-emerald-400 transition-colors">Ver Agenda &gt;</a>
              </div>
              <div className="flex flex-col items-center justify-center text-center py-2">
                <p className="text-[10px] font-semibold text-slate-700 mb-1">Sem dados</p>
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