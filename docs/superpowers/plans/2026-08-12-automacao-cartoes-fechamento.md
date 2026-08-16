# Automação, Cartões e Fechamento Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir categorizar lançamentos automaticamente, controlar cartões e parcelas sem duplicar despesas e consultar um fechamento mensal pessoal ou familiar.

**Architecture:** O Prisma guarda regras pessoais, cartões do proprietário e, quando compartilhados, o vínculo com o time familiar. A compra de cartão cria uma única transação de saída e parcelas projetadas; as faturas são calculadas das parcelas e têm apenas um estado de pagamento. APIs resolvem o contexto financeiro antes de consultar ou gravar dados e componentes clientes reutilizam o seletor de contexto existente.

**Tech Stack:** Next.js 15 App Router, TypeScript, Prisma 5/PostgreSQL, React 19, Tailwind CSS, Lucide React.

## Global Constraints

- Uma compra no cartão é uma saída na data da compra; pagar a fatura não cria nova transação.
- Regras pertencem ao usuário que cria/importa o lançamento e não alteram o histórico existente.
- No contexto familiar os membros visualizam cartões e faturas, mas somente o proprietário altera cartões e compras.
- Não introduzir rateio individual, integração Open Finance ou pagamento Pix.
- Todas as rotas exigem autenticação, contexto válido e validação de entrada.
- Verificar cada tarefa com `npx tsc --noEmit`, `npm run lint` ou `npm run build` conforme aplicável.

---

### Task 1: Persistência e utilitários financeiros

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260812130000_add_cards_and_transaction_rules/migration.sql`
- Create: `src/lib/transaction-rules.ts`
- Create: `src/lib/credit-cards.ts`

**Interfaces:**
- Produces `applyTransactionRule(userId, description, fallback)` e `buildInstallments(...)`.
- Produces modelos `TransactionRule`, `CreditCard`, `CardPurchase`, `CardInstallment` e `CardStatementPayment` para as APIs posteriores.

- [ ] **Step 1:** Adicionar os modelos e relações Prisma, incluindo unicidade entre compra e transação, parcelas de uma compra e pagamento de uma fatura.
- [ ] **Step 2:** Escrever a migração SQL equivalente e gerar o cliente Prisma.
- [ ] **Step 3:** Implementar normalização de descrição e aplicação determinística da regra mais específica.
- [ ] **Step 4:** Implementar cálculo de ciclo, parcelas com arredondamento em centavos e total de fatura.
- [ ] **Step 5:** Rodar `npx prisma validate && npx prisma generate && npx tsc --noEmit` e corrigir erros.
- [ ] **Step 6:** Commitar somente os arquivos desta tarefa com `feat: adiciona base de cartoes e regras`.

### Task 2: APIs de regras, cartões e compras

**Files:**
- Create: `src/app/api/financial/rules/route.ts`
- Create: `src/app/api/financial/cards/route.ts`
- Create: `src/app/api/financial/card-purchases/route.ts`
- Create: `src/app/api/financial/card-statements/route.ts`
- Modify: `src/app/api/transactions/route.ts`
- Modify: `src/app/api/transactions/import/route.ts`

**Interfaces:**
- Consumes os modelos Prisma e `applyTransactionRule`, `buildInstallments`, `statementForPurchase` e `resolveFinancialContext`.
- Produces endpoints JSON autenticados para CRUD de regras/cartões, criação de compras e consulta/pagamento de faturas.

- [ ] **Step 1:** Implementar regras com GET/POST/PATCH/DELETE, validando propriedade pelo `userId` da sessão.
- [ ] **Step 2:** Implementar cartões com GET/POST/PATCH/DELETE e filtro por contexto pessoal/familiar.
- [ ] **Step 3:** Criar compra de cartão em transação Prisma, criando uma única saída, a compra e as parcelas na mesma transação do banco.
- [ ] **Step 4:** Implementar leitura de faturas e marcação de pagamento, sem inserir nova `Transaction`.
- [ ] **Step 5:** Aplicar regras de categoria nos lançamentos manuais e nos itens importados antes da prévia e gravação.
- [ ] **Step 6:** Verificar respostas 401/403, criação e leitura com um usuário autenticado localmente quando disponível; rodar `npx tsc --noEmit && npm run lint`.
- [ ] **Step 7:** Commitar somente arquivos desta tarefa com `feat: adiciona APIs de cartoes e automacao`.

### Task 3: Fechamento mensal e relatórios

**Files:**
- Create: `src/app/api/financial/monthly-close/route.ts`
- Modify: `src/components/financial/financial-reports-workspace.tsx`
- Modify: `src/app/api/dashboard/summary/route.ts`
- Modify: `src/components/dashboard/dashboard-overview.tsx`

**Interfaces:**
- Consumes `transactionContextWhere`, modelos de cartão/parcelas e dados existentes de orçamento/recorrência.
- Produces `GET /api/financial/monthly-close?context=&month=` e a seção visual de fechamento.

- [ ] **Step 1:** Agregar transações, mês anterior, orçamentos, recorrências e parcelas/vencimentos futuros no endpoint de fechamento.
- [ ] **Step 2:** Incluir recomendações objetivas para orçamento excedido, fatura próxima, recorrência próxima e ausência de movimentações.
- [ ] **Step 3:** Carregar fechamento junto ao relatório e renderizar métricas, comparação, faturas e ações.
- [ ] **Step 4:** Expor o próximo compromisso financeiro resumido no dashboard inicial.
- [ ] **Step 5:** Rodar `npx tsc --noEmit && npm run lint` e validar que o contexto familiar identifica autores.
- [ ] **Step 6:** Commitar somente arquivos desta tarefa com `feat: adiciona fechamento financeiro mensal`.

### Task 4: Experiência de regras e cartões

**Files:**
- Create: `src/components/financial/financial-rules-workspace.tsx`
- Create: `src/components/financial/credit-cards-workspace.tsx`
- Create: `src/app/dashboard/financeiro/regras/page.tsx`
- Modify: `src/app/dashboard/financeiro/cartoes/page.tsx`
- Modify: `src/components/dashboard/dashboard-nav.tsx`
- Modify: `src/components/financial/statement-import.tsx`

**Interfaces:**
- Consumes `/api/financial/rules`, `/api/financial/cards`, `/api/financial/card-purchases` e `/api/financial/card-statements`.
- Produces páginas funcionais para configurar regras, criar cartões, registrar compras parceladas e consultar/pagar faturas.

- [ ] **Step 1:** Criar tela de regras com lista, formulário, ativação/desativação e remoção.
- [ ] **Step 2:** Criar tela de cartões com seletor de contexto, cards de limite/fatura e formulário de criação.
- [ ] **Step 3:** Criar detalhe de cartão com compra à vista/parcelada, previsão de parcelas e ação de marcar fatura paga.
- [ ] **Step 4:** Destacar no importador que categorias foram sugeridas por automação quando aplicável.
- [ ] **Step 5:** Adicionar “Automação” à navegação financeira e substituir a rota antiga de cartões.
- [ ] **Step 6:** Rodar `npx tsc --noEmit && npm run lint && npm run build` e corrigir problemas de SSR, tipagem ou acessibilidade.
- [ ] **Step 7:** Commitar somente arquivos desta tarefa com `feat: conclui experiencia de cartoes`.

## Revisão do plano

- Cobertura da especificação: Tarefas 1–2 implementam regras, cartões, parcelas e autorização; tarefa 3 cobre fechamento, comparação e painel; tarefa 4 entrega os fluxos de interface e navegação.
- Sem placeholders: todos os arquivos, APIs e validações estão definidos.
- Consistência: os nomes dos modelos e endpoints coincidem com a especificação e são produzidos antes de serem consumidos.
