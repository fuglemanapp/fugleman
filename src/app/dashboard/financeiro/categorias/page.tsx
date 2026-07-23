"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle, Bell, ArrowUpRight, ArrowDownRight, Folder, CreditCard, ListTodo, Calendar, Plus, Wallet, CheckCircle2, Tags, Building2, Link2, PieChart, Receipt, FileText, Users, Mail, Zap, Send, Briefcase, ShieldCheck, MessageSquare, UserPlus, FileSearch, DownloadCloud, AlertTriangle, Copy, ExternalLink, Trash2, ArrowRightLeft, Search, Filter, Check, Info, BarChart3, RotateCw, Edit2, Lock, X, Landmark, Keyboard, Layers, RefreshCw, ArrowRight, MessageCircle, Clock, CircleDollarSign, Percent, Calendar as CalendarIcon, Tag, Edit, Maximize2, MoreHorizontal, FileText as FileTextIcon, History, Grid3X3, List, Share2, Upload, FolderOpen, Home, ThumbsUp, ThumbsDown, BookOpen, HeadphonesIcon, ArrowLeft, TrendingUp, Bot, Shield } from "lucide-react"


    const toggleTheme = () => {
      document.documentElement.classList.toggle('dark');
    }

export default function CategoriasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const [type, setType] = useState<'despesa' | 'receita'>('despesa')
  const [categoryName, setCategoryName] = useState('')
  const [selectedColor, setSelectedColor] = useState('bg-orange-500')

  // Transformed into React State
  const [despesas, setDespesas] = useState([
    { name: "Alimentação", color: "bg-red-500" },
    { name: "Casa", color: "bg-orange-500" },
    { name: "Cuidados pessoais", color: "bg-cyan-400" },
    { name: "Doações", color: "bg-sky-500" },
    { name: "Educação", color: "bg-blue-600" },
    { name: "Impostos", color: "bg-neutral-500" },
    { name: "Investimentos", color: "bg-stone-600" },
    { name: "Lazer e Entretenimento", color: "bg-red-500" },
    { name: "Mercado", color: "bg-green-400" },
    { name: "Pets", color: "bg-orange-400" },
    { name: "Saúde", color: "bg-yellow-300" },
    { name: "Transporte", color: "bg-teal-700" },
    { name: "Utilidades", color: "bg-green-400" },
    { name: "Vestuário", color: "bg-purple-500" },
    { name: "Viagem", color: "bg-blue-500" }
  ]);

  const colorPalette = [
    { bg: 'bg-orange-500', hex: '#F97316' },
    { bg: 'bg-green-500', hex: '#22C55E' },
    { bg: 'bg-blue-600', hex: '#2563EB' },
    { bg: 'bg-purple-500', hex: '#A855F7' },
    { bg: 'bg-yellow-400', hex: '#FACC15' },
    { bg: 'bg-yellow-500', hex: '#EAB308' },
    { bg: 'bg-red-500', hex: '#EF4444' },
    { bg: 'bg-emerald-400', hex: '#34D399' },
    { bg: 'bg-black', hex: '#000000' },
    { bg: 'bg-cyan-400', hex: '#22D3EE' },
    { bg: 'bg-sky-500', hex: '#0EA5E9' },
    { bg: 'bg-neutral-500', hex: '#737373' },
    { bg: 'bg-stone-600', hex: '#57534E' },
    { bg: 'bg-teal-700', hex: '#0F766E' },
  ];

  const handleOpenCreate = () => {
    setModalMode('create')
    setCategoryName('')
    setSelectedColor('bg-orange-500')
    setType('despesa')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (index: number) => {
    const cat = despesas[index]
    setModalMode('edit')
    setEditingIndex(index)
    setCategoryName(cat.name)
    setSelectedColor(cat.color)
    setType('despesa')
    setIsModalOpen(true)
  }

  const handleDelete = (index: number) => {
    if (confirm(`Tem certeza que deseja excluir a categoria "${despesas[index].name}"?`)) {
      setDespesas(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleSave = () => {
    if (!categoryName.trim()) return;

    if (modalMode === 'create') {
      setDespesas(prev => [{ name: categoryName, color: selectedColor }, ...prev])
    } else if (modalMode === 'edit' && editingIndex !== null) {
      setDespesas(prev => {
        const newArr = [...prev]
        newArr[editingIndex] = { name: categoryName, color: selectedColor }
        return newArr
      })
    }
    setIsModalOpen(false)
  }

  const sistema = [
    { name: "Cartão de crédito", color: "bg-blue-500" },
    { name: "Transferência mesmo titular", color: "bg-yellow-500" },
    { name: "Transferência para terceiros", color: "bg-orange-500" },
    { name: "Tarifas bancárias", color: "bg-red-500" },
    { name: "Recebimentos", color: "bg-green-500" },
    { name: "Resgate aplicação", color: "bg-emerald-700" },
    { name: "Depósito aplicação", color: "bg-emerald-700" },
    { name: "Outros", color: "bg-black" }
  ];

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
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">Gerenciar Categorias</h1>
            <p className="text-sm text-slate-500">Personalize suas categorias para uma análise financeira precisa.</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-6 py-2.5 bg-[#F8F1FF] hover:bg-[#F3E8FF] text-[#9333EA] font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nova Categoria
          </button>
        </div>

        <div className="w-full max-w-5xl">
          {/* Seção: Minhas Categorias de Despesas */}
          <div className="mb-12">
            <h2 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-4 pl-2">Minhas categorias de despesas</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {despesas.map((cat, i) => (
                <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-24 hover:shadow-md transition-all relative overflow-hidden group`}>
                  {/* Borda Esquerda Colorida */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${cat.color}`}></div>

                  <div className="flex items-center gap-3 pl-2">
                    <div className={`w-5 h-5 rounded-full ${cat.color} shadow-sm shrink-0`}></div>
                    <span className="font-bold text-slate-900 text-[15px] truncate">{cat.name}</span>
                  </div>

                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(i)} className="text-slate-300 hover:text-slate-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(i)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção: Categorias do Sistema */}
          <div className="mb-12">
            <h2 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-4 pl-2 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Categorias do sistema
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sistema.map((cat, i) => (
                <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between h-24 relative overflow-hidden`}>
                  {/* Borda Esquerda Colorida */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${cat.color}`}></div>
                  
                  <div className="flex items-center gap-3 pl-2">
                    <div className={`w-5 h-5 rounded-full ${cat.color} shadow-sm shrink-0`}></div>
                    <span className="font-bold text-slate-900 text-[15px] truncate">{cat.name}</span>
                  </div>
                  
                  <div className="flex justify-end">
                    <span className="text-[10px] italic text-slate-300 font-medium">Sistema</span>
                  </div>
                </div>
              ))}
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

      {/* MODAL NOVA CATEGORIA */}
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
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-50 text-orange-500 border border-orange-100">
                  <Tags className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">Adicionar Categoria</h2>
                  <p className="text-sm text-slate-500 mt-1">Gerencie suas categorias</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 bg-white flex flex-col md:flex-row gap-12">

              {/* Coluna Esquerda: Dados da Categoria */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">DADOS DA CATEGORIA</span>
                </div>

                {/* Tipo de Categoria (Toggle) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">TIPO DE CATEGORIA</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <button
                      onClick={() => setType('despesa')}
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${type === 'despesa' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Despesa
                    </button>
                    <button
                      onClick={() => setType('receita')}
                      className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${type === 'receita' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Receita
                    </button>
                  </div>
                </div>

                {/* Nome da Categoria */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">NOME DA CATEGORIA</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Ex: Alimentação, Transporte..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                  />
                </div>

                {/* Palavras-Chave */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">PALAVRAS-CHAVE (PARA IDENTIFICAÇÃO AUTOMÁTICA)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Digite uma palavra-chave..."
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                    />
                    <button className="px-6 py-3 bg-slate-300/50 text-slate-500 font-semibold text-sm rounded-xl shrink-0 cursor-not-allowed">
                      + Adicionar
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Ex: "uber", "ifood" (ajuda a categorizar automaticamente).</p>
                </div>
              </div>

              {/* Coluna Direita: Aparência */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">APARÊNCIA</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 tracking-wider mb-2 uppercase">COR DA CATEGORIA</label>
                  <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 shadow-sm flex flex-col gap-6">
                    {/* Color Swatches Grid */}
                    <div className="flex flex-wrap gap-4">
                      {colorPalette.map((palette) => (
                        <div
                          key={palette.bg}
                          onClick={() => setSelectedColor(palette.bg)}
                          className={`w-10 h-10 rounded-full ${palette.bg} cursor-pointer shadow-sm hover:scale-110 transition-transform ${
                            selectedColor === palette.bg ? `ring-2 ring-offset-2 ${palette.bg.replace('bg-', 'ring-')}` : ''
                          }`}
                        ></div>
                      ))}
                    </div>

                    {/* Hex Input */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${selectedColor}`}></div>
                        <input
                          type="text"
                          readOnly
                          value={colorPalette.find(c => c.bg === selectedColor)?.hex || ''}
                          className={`w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 font-mono text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white ${selectedColor.replace('bg-', 'focus:ring-')}/20`}
                        />
                      </div>
                      <div className={`w-10 h-10 rounded-xl ${selectedColor} shrink-0 shadow-sm`}></div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-[#F8F1FF] hover:bg-[#F3E8FF] text-[#9333EA] font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Salvar Categoria
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
