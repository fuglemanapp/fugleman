"use client"

import { ChevronDown, HelpCircle, Bell, ArrowUpRight, ArrowDownRight, Folder, CreditCard, ListTodo, Calendar, Plus, Wallet, CheckCircle2, Tags, Building2, Link2, PieChart, Receipt, FileText, Users, Mail, Zap, Send, Briefcase, ShieldCheck, MessageSquare, UserPlus, FileSearch, DownloadCloud, AlertTriangle, Copy, ExternalLink, Trash2, ArrowRightLeft, Search, Filter, Check, Info, BarChart3, RotateCw, Edit2, Lock, X, Landmark, Keyboard, Layers, RefreshCw, ArrowRight, MessageCircle, Clock, CircleDollarSign, Percent, Calendar as CalendarIcon, Tag, Edit, Maximize2, MoreHorizontal, FileText as FileTextIcon, History, Grid3X3, List, Share2, Upload, FolderOpen, Home, ThumbsUp, ThumbsDown, BookOpen, HeadphonesIcon, ArrowLeft, TrendingUp, Bot, Shield } from "lucide-react"

export default function AjudaArtigoCartoesPage() {
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
          <svg className="w-5 h-5 theme-text-secondary hover:theme-text-primary cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
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
            <span className="theme-text-primary font-bold">Gerenciando Cartões de Crédito</span>
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

            <h1 className="text-3xl md:text-4xl font-extrabold theme-text-primary mb-12 tracking-tight">Gerenciando Cartões de Crédito</h1>

            <div className="space-y-8 theme-text-secondary text-[15px] leading-relaxed">
              <p>Como organizar corretamente seus cartões?</p>

              <div>
                <p>Configuração inicial (obrigatório)</p>
                <p>Cadastre cada cartão</p>
                <p>Informe:</p>
                <p>Dia de <span className="font-bold theme-text-primary">fechamento</span></p>
                <p>Dia de <span className="font-bold theme-text-primary">vencimento</span></p>
              </div>

              <div>
                <p className="font-bold theme-text-primary">Sem isso, a fatura será calculada errado.</p>
              </div>

              <div>
                <p>Ao lançar uma despesa</p>
                <p>Sempre selecione o <span className="font-bold theme-text-primary">cartão correto</span></p>
                <p>Verifique a <span className="font-bold theme-text-primary">data da compra</span></p>
              </div>

              <div>
                <p><span className="font-bold theme-text-primary">O sistema define automaticamente em qual fatura a compra entra</span>, com base na data e no fechamento.</p>
              </div>

              <div>
                <p className="mb-2">O que o sistema faz sozinho</p>
                <p>Calcula a fatura correta</p>
                <p>Organiza gastos por cartão</p>
                <p>Mostra valores atualizados das faturas</p>
              </div>

              <div>
                <p className="mb-2">Erros comuns (evite)</p>
                <p>Selecionar o cartão errado ao lançar a despesa</p>
                <p>Cadastrar fechamento/vencimento incorretos</p>
                <p>Registrar pagamento manual da fatura sem necessidade</p>
              </div>

              <div>
                <p className="mb-2">Sobre pagamento de fatura</p>
                <p className="font-bold theme-text-primary">Não registre manualmente algo como:</p>
                <p>"Paguei fatura do cartão X"</p>
                <p>Se os lançamentos estiverem corretos, o sistema já considera esse valor no controle financeiro.</p>
              </div>

              <div>
                <p className="mb-2">Integração com Open Finance</p>
                <p className="font-bold theme-text-primary mb-1">Recomendado:</p>
                <p>Conecte seus cartões via Open Finance</p>
                <p>As transações são importadas automaticamente</p>
              </div>

              <div>
                <p className="font-bold theme-text-primary mb-1">Resultado:</p>
                <p>Menos erro manual</p>
                <p>Dados mais consistentes</p>
              </div>

              <div>
                <p className="mb-2">Resultado esperado</p>
                <p>Faturas organizadas automaticamente</p>
                <p>Visão em tempo real dos gastos por cartão</p>
                <p>Menos retrabalho manual</p>
              </div>

              <div>
                <p className="mb-2">Se algo estiver errado</p>
                <p>Revise fechamento e vencimento do cartão</p>
                <p>Verifique se a despesa foi lançada no cartão correto</p>
                <p>Confirme se não há lançamentos duplicados</p>
              </div>

              <div className="pt-4">
                <p>Se ainda estiver incorreto: Entre em contato pelo e-mail contato@meuassessor.com</p>
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

              <a href="/dashboard/ajuda/artigo-openfinance" className="theme-bg-elevated p-5 rounded-2xl flex flex-col border border-transparent hover:theme-border-strong transition-colors group">
                <span className="text-[10px] font-bold theme-text-secondary tracking-wider uppercase flex items-center gap-1.5 mb-2"><TrendingUp className="w-3 h-3"/> FINANÇAS</span>
                <span className="font-semibold theme-text-primary group-hover:text-indigo-400 transition-colors">Como conectar sua conta ao Open Finance?</span>
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
