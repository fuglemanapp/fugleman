"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle, Bell, ArrowUpRight, ArrowDownRight, Folder, CreditCard, ListTodo, Calendar, Plus, Wallet, CheckCircle2, Tags, Building2, Link2, PieChart, Receipt, FileText, Users, Mail, Zap, Send, Briefcase, ShieldCheck, MessageSquare, UserPlus, FileSearch, DownloadCloud, AlertTriangle, Copy, ExternalLink, Trash2, ArrowRightLeft, Search, Filter, Check, Info, BarChart3, RotateCw, Edit2, Lock, X, Landmark, Keyboard, Layers, RefreshCw, ArrowRight, MessageCircle, Clock, CircleDollarSign, Percent, Calendar as CalendarIcon, Tag, Edit, Maximize2, MoreHorizontal, FileText as FileTextIcon, History, Grid3X3, List, Share2, Upload, FolderOpen, Home, ThumbsUp, ThumbsDown, BookOpen, HeadphonesIcon, ArrowLeft, TrendingUp, Bot, Shield } from "lucide-react"

// Funções auxiliares para o calendário real
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];


    const toggleTheme = () => {
      document.documentElement.classList.toggle('dark');
    }

export default function TarefasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showCalendarPopup, setShowCalendarPopup] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1))
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date(2026, 6, 1))
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date(2026, 6, 31))

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const emptyDaysStart = Array.from({ length: firstDay }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  const formatDate = (date: Date | null) => date ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}` : ''
  const getDayDate = (day: number) => new Date(currentYear, currentMonth, day)
  const isSameDay = (date: Date | null, day: number) => date?.getFullYear() === currentYear && date.getMonth() === currentMonth && date.getDate() === day
  const dateRangeLabel = selectedStartDate && selectedEndDate
    ? `${formatDate(selectedStartDate)} até ${formatDate(selectedEndDate)}`
    : selectedStartDate
      ? `${formatDate(selectedStartDate)} até ...`
      : "Selecione um período"

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

  // Render do Pop-up do Calendário para não repetir código
  const CalendarPopup = () => (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-[320px] z-50 animate-in fade-in zoom-in duration-200">
      
      {/* Navegação de Meses Real */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors">{'<'}</button>
        <div className="font-bold text-slate-900 flex items-center gap-2">
          <select
            value={currentMonth}
            onChange={(event) => setCurrentDate((date) => new Date(date.getFullYear(), Number(event.target.value), 1))}
            className="bg-transparent cursor-pointer hover:text-purple-600 focus:outline-none"
          >
            {monthNames.map((month, index) => <option key={month} value={index}>{month}</option>)}
          </select>
          <select
            value={currentYear}
            onChange={(event) => setCurrentDate((date) => new Date(Number(event.target.value), date.getMonth(), 1))}
            className="bg-transparent cursor-pointer hover:text-purple-600 focus:outline-none"
          >
            {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors">{'>'}</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(d => (
          <div key={d} className="text-[10px] font-bold text-slate-400">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-sm text-slate-700">
        {/* Dias vazios do mês anterior */}
        {emptyDaysStart.map(i => (
          <div key={`empty-${i}`} className="py-1.5 text-slate-300 flex items-center justify-center">
             {new Date(currentYear, currentMonth, 0).getDate() - firstDay + i + 1}
          </div>
        ))}

        {/* Dias reais do mês interativos */}
        {days.map(day => {
          const selected = isSelected(day);
          const start = isStart(day);
          const end = isEnd(day);
          const middle = selected && !start && !end;

          return (
            <div 
              key={day} 
              onClick={() => handleDayClick(day)}
              className="py-1.5 flex justify-center relative group cursor-pointer"
            >
              {/* Fundos roxos para o range selecionado */}
              {selected && !start && !end && <div className="absolute inset-y-0 left-0 right-0 bg-[#8B5CF6]/10 -z-10"></div>}
              {start && selectedEndDate && selectedStartDate?.getTime() !== selectedEndDate.getTime() && <div className="absolute inset-y-0 right-0 w-1/2 bg-[#8B5CF6]/10 -z-10"></div>}
              {end && selectedStartDate && selectedStartDate.getTime() !== selectedEndDate?.getTime() && <div className="absolute inset-y-0 left-0 w-1/2 bg-[#8B5CF6]/10 -z-10"></div>}
              
              {/* O número do dia em si */}
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                start || end 
                  ? 'bg-[#8B5CF6] text-white font-bold shadow-sm' 
                  : middle 
                    ? 'font-medium text-purple-700' 
                    : 'hover:bg-slate-100'
              }`}>
                {day}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );

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
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">Gerenciador de Tarefas</h1>
            <p className="text-sm text-slate-500">Acompanhe seus afazeres, lembretes e projetos paralelos.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-[#F8F1FF] hover:bg-[#F3E8FF] text-[#9333EA] font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nova Tarefa
          </button>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[500px] flex flex-col">
          
          {/* Toolbar Interna */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-900">Minhas Tarefas</h2>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">
                  0 Tarefas
                </span>
              </div>
              <p className="text-xs text-slate-500">Foque nas prioridades!</p>
            </div>

            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 text-sm font-medium">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <List className="w-4 h-4" /> Lista
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Calendar className="w-4 h-4" /> Calendário
              </button>
            </div>
          </div>

          {/* O Botão de Datas e Filtros (Aparece em ambos os modos, como na sua foto 3) */}
          <div className="flex flex-col md:flex-row gap-4 mb-16 relative">
            <button
              onClick={() => setShowCalendarPopup(!showCalendarPopup)}
              className={`flex items-center border rounded-xl px-4 py-2.5 max-w-sm w-full transition-all text-left ${
                showCalendarPopup ? 'border-purple-300 ring-2 ring-purple-500/20 bg-purple-50 text-purple-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0 mr-3" />
              <span className="text-sm font-medium">{dateRangeLabel}</span>
            </button>

            {/* Calendário Popover Agora Funciona Em Ambos Modos */}
            {showCalendarPopup && <CalendarPopup />}

            <div className="flex gap-4 flex-1">
              <div className="flex items-center border border-slate-200 rounded-xl px-4 py-2.5 bg-white flex-1 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
                <input 
                  type="text" 
                  placeholder="Buscar tarefas..." 
                  className="w-full text-slate-700 text-sm font-medium focus:outline-none bg-transparent placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
              <button className="px-4 py-2.5 bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors shrink-0">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conteúdo Principal Dinâmico */}
          {viewMode === 'list' ? (
            <>
              {/* Empty State */}
              <div className="flex-1 flex flex-col items-center justify-center text-center pb-10">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                  <CheckCircle2 className="w-8 h-8" fill="currentColor" fillOpacity="0.2" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Nenhuma tarefa encontrada</h2>
                <p className="text-[14px] text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                  Cadastre suas tarefas e compromissos para manter sua rotina organizada.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2.5 bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-sm rounded-xl transition-colors"
                >
                  Nova Tarefa
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-[600px] flex items-center justify-center text-slate-400">
               {/* Aqui ficaria a grade do calendário grande (Gigante) - Oculto na visualização vazia */}
               <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8" fill="currentColor" fillOpacity="0.2" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Calendário Vazio</h2>
                  <p className="text-[14px] text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                    Você não possui tarefas agendadas para este mês.
                  </p>
               </div>
            </div>
          )}
        </div>

      </main>

      {/* MODAL NOVA TAREFA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[800px] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">

            {/* Modal Header */}
            <div className="p-8 pb-6 flex items-center gap-4 relative border-b border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-500 border border-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Nova Tarefa</h2>
                <p className="text-[13px] text-slate-500 mt-1">Adicione uma nova tarefa pendente ao seu painel.</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-8 flex flex-col md:flex-row gap-12 bg-[#FAFAFA]">

              {/* Coluna Esquerda: Informações Básicas */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">INFORMAÇÕES BÁSICAS</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">NOME DA TAREFA</label>
                  <input
                    type="text"
                    placeholder="Ex: Preparar relatório semanal"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">DESCRIÇÃO TÉCNICA</label>
                  <textarea
                    placeholder="Adicione links, notas extras ou orientações..."
                    className="w-full h-24 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">CATEGORIA</label>
                    <div className="relative">
                      <select className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white cursor-pointer">
                        <option>Nenhuma (Opcional)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">PROJETO</label>
                    <div className="relative">
                      <select className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white cursor-pointer">
                        <option>Nenhum (Opcional)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">PRAZO DE CONCLUSÃO</label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
                      <input
                        type="text"
                        placeholder="DD/MM/AAAA"
                        className="w-full text-slate-700 text-sm font-medium focus:outline-none bg-transparent placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">DATA DE LEMBRETE</label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                      <Bell className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
                      <input
                        type="text"
                        placeholder="DD/MM/AAAA"
                        className="w-full text-slate-700 text-sm font-medium focus:outline-none bg-transparent placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Coluna Direita: Opções Adicionais */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">ORGANIZAÇÃO & STATUS</span>
                </div>

                {/* Status da Tarefa (Card Verde) */}
                <div className="border border-emerald-100 rounded-2xl p-5 bg-white shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                      <ListTodo className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 text-[15px]">Andamento</span>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-2 uppercase">STATUS DA TAREFA</label>
                    <div className="relative">
                      <select defaultValue="⏳ Pendente" className="w-full appearance-none border border-emerald-500 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all bg-emerald-50/30 cursor-pointer">
                        <option value="⏳ Pendente">⏳ Pendente</option>
                        <option value="🎯 Prioridade">🎯 Prioridade</option>
                        <option value="🚧 Em andamento">🚧 Em andamento</option>
                        <option value="📦 Esperando dependência">📦 Esperando dependência</option>
                        <option value="🤝 Delegada">🤝 Delegada</option>
                        <option value="✅ Concluída">✅ Concluída</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-2 uppercase">NÍVEL DE PRIORIDADE</label>
                    <div className="relative">
                      <select defaultValue="Baixa / Normal" className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white cursor-pointer">
                        <option value="Baixa / Normal">✔️ Baixa / Normal</option>
                        <option value="Alta Prioridade 🔥">Alta Prioridade 🔥</option>
                        <option value="Urgente 🚨">Urgente 🚨</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Vincular Pessoas */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-[13px]">Vincular Pessoas</h4>
                      <p className="text-[10px] text-slate-400">Associe clientes ou equipe.</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 ml-11">Nenhuma pessoa vinculada.</p>
                  <div className="flex items-center border border-slate-100 rounded-xl px-4 py-2.5 bg-slate-50 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all focus-within:bg-white">
                    <input
                      type="text"
                      placeholder="Busque por nome..."
                      className="w-full text-slate-800 text-xs font-medium focus:outline-none bg-transparent placeholder:text-slate-400"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-8 pb-8 bg-[#FAFAFA] flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 bg-[#F8F1FF] hover:bg-[#F3E8FF] text-[#9333EA] font-semibold text-sm rounded-xl transition-colors shadow-sm"
              >
                Salvar Tarefa
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
