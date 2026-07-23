"use client"

import { ChevronDown, HelpCircle, Bell, ArrowUpRight, ArrowDownRight, Folder, CreditCard, ListTodo, Calendar, Plus, Wallet, CheckCircle2, Tags, Building2, Link2, PieChart, Receipt, FileText, Users, Mail, Zap, Send, Briefcase, ShieldCheck, MessageSquare, UserPlus, FileSearch, DownloadCloud, AlertTriangle, Copy, ExternalLink, Trash2, ArrowRightLeft, Search, Filter, Check, Info, BarChart3, RotateCw, Edit2, Lock, X, Landmark, Keyboard, Layers, RefreshCw, ArrowRight, MessageCircle, Clock, CircleDollarSign, Percent, Calendar as CalendarIcon, Tag, Edit, Maximize2, MoreHorizontal, FileText as FileTextIcon, History, Grid3X3, List, Share2, Upload, FolderOpen, Home, ThumbsUp, ThumbsDown, BookOpen, HeadphonesIcon, ArrowLeft, TrendingUp, Bot, Shield } from "lucide-react"

export default function AjudaArtigoBancosPage() {
  return (
    <div className="flex flex-col min-h-screen theme-bg-main font-sans theme-text-primary transition-colors duration-300">

      {/* Top Navbar */}
      <header className="theme-bg-header border-b theme-border-strong transition-colors duration-300 h-14 flex items-center px-4 md:px-6 justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-6 h-6 bg-gradient-to-tr from-[#0A1A44] to-[#C084FC] rounded flex items-center justify-center text-white">
              <span className="font-bold text-xs italic">F</span>
            </div>
            <span className="font-bold theme-text-primary tracking-tight">Fugleman</span>
          </a>

          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium theme-text-secondary relative">
            <div className="group relative">
              <button className="theme-text-secondary hover:theme-text-primary flex items-center gap-1 py-4">Visão Geral <ChevronDown className="w-3 h-3"/></button>
            </div>
            <div className="group relative">
              <button className="theme-text-secondary hover:theme-text-primary flex items-center gap-1 py-4">Financeiro <ChevronDown className="w-3 h-3"/></button>
            </div>
            <div className="group relative">
              <button className="theme-text-secondary hover:theme-text-primary flex items-center gap-1 py-4">Agenda <ChevronDown className="w-3 h-3"/></button>
            </div>
            <div className="group relative">
              <button className="theme-text-secondary hover:theme-text-primary flex items-center gap-1 py-4">Organização <ChevronDown className="w-3 h-3"/></button>
            </div>
            <div className="group relative">
              <button className="theme-text-secondary hover:theme-text-primary flex items-center gap-1 py-4">Cadastros <ChevronDown className="w-3 h-3"/></button>
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
              if(moon && sun) {
                if(isDark) { moon.style.display = 'none'; sun.style.display = 'block'; }
                else { moon.style.display = 'block'; sun.style.display = 'none'; }
              }
            }} 
            className="p-1 theme-text-secondary hover:theme-text-primary transition-colors"
            title="Alternar Tema"
          >
            <svg className="w-5 h-5 moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <svg className="w-5 h-5 sun-icon" style={{display: 'none'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 flex flex-col items-center">
        
        <div className="w-full max-w-4xl flex flex-col gap-6">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 theme-text-secondary text-xs font-medium px-2 py-4 mb-2">
            <a href="/dashboard/ajuda" className="hover:theme-text-primary flex items-center gap-1 transition-colors"><Home className="w-3.5 h-3.5" /> Central de Ajuda</a>
            <span>{'>'}</span>
            <span className="hover:theme-text-primary cursor-pointer transition-colors">Finanças</span>
            <span>{'>'}</span>
            <span className="theme-text-primary font-bold">Como funcionam as contas bancárias?</span>
          </div>

          {/* Artigo Principal */}
          <div className="theme-bg-card rounded-[2rem] p-8 md:p-12 shadow-sm border theme-border transition-colors duration-300">
            
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#1E1B4B]/60 dark:bg-indigo-900/30 text-indigo-400 text-[10px] font-bold rounded-md uppercase tracking-wider border border-indigo-500/20">
                <TrendingUp className="w-3.5 h-3.5" /> FINANÇAS
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 theme-bg-elevated theme-text-secondary text-[10px] font-bold rounded-md">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 3
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold theme-text-primary mb-12 tracking-tight">Como funcionam as contas bancárias?</h1>

            <div className="space-y-8 theme-text-secondary text-[15px] leading-relaxed">
              <p>Como funcionam as contas bancárias?</p>

              <div>
                <p className="font-bold theme-text-primary text-base mb-1">Resposta rápida:</p>
                <p>As contas servem para separar e controlar saldos e transações (ex: pessoal, empresa, projetos).</p>
              </div>

              <div>
                <p className="mb-2">O que você pode fazer</p>
                <p><span className="font-bold theme-text-primary">Criar nova conta</span></p>
                <p>Ex: conta pessoal, empresa, caixa, projeto específico</p>
                <p><span className="font-bold theme-text-primary">Editar conta</span></p>
                <p>Alterar nome e definir como <span className="font-bold theme-text-primary">conta padrão</span></p>
                <p><span className="font-bold theme-text-primary">Definir conta padrão</span></p>
                <p>Novos lançamentos vão automaticamente para essa conta</p>
              </div>

              <div>
                <p className="mb-2">Funções dentro da conta</p>
                <p><span className="font-bold theme-text-primary">Saldo atual</span></p>
                <p>Mostra o valor atualizado da conta</p>
                <p><span className="font-bold theme-text-primary">Ajustar saldo</span></p>
                <p>Corrige o valor manualmente (use quando o saldo estiver errado)</p>
                <p><span className="font-bold theme-text-primary">Transferir</span></p>
                <p>Move valores entre contas</p>
                <p><span className="font-bold theme-text-primary">Extrato</span></p>
                <p>Abre a tela de transações filtrada por essa conta</p>
                <p><span className="font-bold theme-text-primary">Editar / Excluir</span></p>
                <p>Altera ou remove a conta</p>
              </div>

              <div>
                <p className="mb-2">Contas com Open Finance</p>
                <p><span className="font-bold theme-text-primary">Auto Sync</span></p>
                <p>Atualiza automaticamente saldo e transações do banco</p>
                <p>Não é necessário lançar manualmente o que já vem do banco</p>
              </div>

              <div>
                <p className="mb-2">Erros comuns (evite)</p>
                <p>Ajustar saldo sem entender a origem do erro</p>
                <p>Usar a conta errada como padrão</p>
                <p>Duplicar lançamentos em contas sincronizadas</p>
              </div>

              <div>
                <p className="mb-2">Resultado esperado</p>
                <p>Saldos separados por conta</p>
                <p>Controle claro de onde o dinheiro está</p>
                <p>Transações organizadas corretamente</p>
              </div>

              <div>
                <p className="mb-2">Se algo estiver errado</p>
                <p>Verifique se está usando a conta correta</p>
                <p>Revise o extrato da conta</p>
                <p>Evite misturar lançamentos manuais com automáticos</p>
              </div>

              <div className="pt-4">
                <p>Se persistir: WhatsApp (47) 99292-1005 ou contato@meuassessor.com</p>
              </div>
            </div>

            {/* Feedback Block */}
            <div className="mt-16 pt-8 border-t theme-border-strong flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-bold theme-text-primary text-lg mb-1">Este artigo foi útil?</h3>
                <p className="text-sm theme-text-secondary">Seu feedback nos ajuda a melhorar nossa base.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-12 h-12 rounded-2xl theme-bg-elevated theme-text-secondary hover:theme-text-primary border theme-border-strong flex items-center justify-center transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-2xl theme-bg-elevated theme-text-secondary hover:theme-text-primary border theme-border-strong flex items-center justify-center transition-colors">
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

          {/* Artigos Relacionados */}
          <div className="theme-bg-card rounded-[2rem] p-8 md:p-12 shadow-sm border theme-border transition-colors duration-300 mt-2 mb-8">
            <h2 className="text-xl font-bold theme-text-primary flex items-center gap-3 mb-8">
              <BookOpen className="w-5 h-5 theme-text-secondary" /> Artigos Relacionados
            </h2>
            
            <div className="flex flex-col gap-3">
              <a href="/dashboard/ajuda/artigo-categorias" className="theme-bg-elevated p-5 rounded-2xl flex flex-col border border-transparent hover:theme-border-strong transition-colors group">
                <span className="text-[10px] font-bold theme-text-secondary tracking-wider uppercase flex items-center gap-1.5 mb-2"><TrendingUp className="w-3 h-3"/> FINANÇAS</span>
                <span className="font-semibold theme-text-primary group-hover:text-indigo-400 transition-colors">Como criar categorias personalizadas</span>
              </a>

              <a href="/dashboard/ajuda/artigo-conciliacao" className="theme-bg-elevated p-5 rounded-2xl flex flex-col border border-transparent hover:theme-border-strong transition-colors group">
                <span className="text-[10px] font-bold theme-text-secondary tracking-wider uppercase flex items-center gap-1.5 mb-2"><TrendingUp className="w-3 h-3"/> FINANÇAS</span>
                <span className="font-semibold theme-text-primary group-hover:text-indigo-400 transition-colors">Conciliação Bancária: O que é e como fazer</span>
              </a>

              <a href="/dashboard/ajuda/artigo-cartoes" className="theme-bg-elevated p-5 rounded-2xl flex flex-col border border-transparent hover:theme-border-strong transition-colors group">
                <span className="text-[10px] font-bold theme-text-secondary tracking-wider uppercase flex items-center gap-1.5 mb-2"><TrendingUp className="w-3 h-3"/> FINANÇAS</span>
                <span className="font-semibold theme-text-primary group-hover:text-indigo-400 transition-colors">Gerenciando Cartões de Crédito</span>
              </a>
            </div>

            <button className="w-full mt-6 py-4 theme-bg-elevated theme-text-primary hover:bg-slate-200 dark:hover:bg-[#2A2A44] font-medium text-sm rounded-xl transition-colors border theme-border flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Ver Todos os Tópicos
            </button>
          </div>

        </div>
      </main>

    </div>
  )
}
