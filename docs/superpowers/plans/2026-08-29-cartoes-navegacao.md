# Cartões e navegação Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar a fatura atual do Magalu, restaurar o logo do cabeçalho, ampliar a paleta dos cartões e dispensar o menu quando o usuário clicar fora.

**Architecture:** A rota de faturas passa a declarar respostas dinâmicas e sem cache; a tela solicita essa rota sem cache para que o cartão-resumo e o detalhe usem os mesmos dados atuais. Um pequeno módulo puro concentra o estado aberto/fechado da navegação, enquanto o componente de navegação aplica eventos de clique fora e Escape. A paleta passa a ser uma constante reutilizável.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Vitest.

## Global Constraints

- Não alterar lançamentos, parcelas ou valores já reconciliados.
- Não adicionar dependências.
- Manter o suporte a qualquer hexadecimal válido na API de cartões.
- Publicar somente depois de todos os testes definidos no plano passarem.

---

### Task 1: Resposta de fatura sempre atual

**Files:**
- Modify: `src/app/api/financial/card-statements/route.ts:1-46`
- Modify: `src/app/api/financial/card-statements/route.test.ts:1-115`
- Modify: `src/components/financial/credit-cards-workspace.tsx:159-202`

**Interfaces:**
- Produces: `GET /api/financial/card-statements` com cabeçalho `Cache-Control: no-store`.
- Consumes: `fetch(url, { cache: "no-store" })` na área de cartões.

- [ ] **Step 1: Escrever o teste que falha**

```ts
it("returns statement data without cache", async () => {
  const response = await route.GET(
    new Request("http://localhost/api/financial/card-statements?context=personal&from=2026-08&months=1"),
  );

  expect(response.headers.get("cache-control")).toBe("no-store");
});
```

- [ ] **Step 2: Executar o teste para confirmar a falha**

Run: `./node_modules/.bin/vitest run src/app/api/financial/card-statements/route.test.ts --pool=vmForks --maxWorkers=1 --minWorkers=1`

Expected: FAIL because the response has no `cache-control` header.

- [ ] **Step 3: Implementar a resposta dinâmica**

```ts
export const dynamic = "force-dynamic";

return NextResponse.json(
  { statements },
  { headers: { "Cache-Control": "no-store" } },
);
```

Use `fetch(..., { cache: "no-store" })` for both requests in `load` so no browser cache can retain the card preview.

- [ ] **Step 4: Executar os testes**

Run: `./node_modules/.bin/vitest run src/app/api/financial/card-statements/route.test.ts --pool=vmForks --maxWorkers=1 --minWorkers=1`

Expected: PASS with all route tests green.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/financial/card-statements/route.ts src/app/api/financial/card-statements/route.test.ts src/components/financial/credit-cards-workspace.tsx
git commit -m "fix: prevent stale card statements"
```

### Task 2: Logo versionado e paleta ampliada

**Files:**
- Create: `public/whatspent-logo.svg`
- Create: `src/lib/card-colors.ts`
- Create: `src/lib/card-colors.test.ts`
- Modify: `src/components/dashboard/dashboard-nav.tsx:1-75`
- Modify: `src/components/financial/credit-cards-workspace.tsx:1-125, 980-1010`

**Interfaces:**
- Produces: `CARD_COLORS: readonly string[]` com 12 valores hexadecimais.
- Consumes: `CARD_COLORS` no estado inicial e nos botões de escolha de cor.

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { expect, it } from "vitest";
import { CARD_COLORS } from "./card-colors";

it("offers twelve valid card colors without duplicates", () => {
  expect(CARD_COLORS).toHaveLength(12);
  expect(new Set(CARD_COLORS).size).toBe(12);
  expect(CARD_COLORS.every((color) => /^#[0-9A-F]{6}$/.test(color))).toBe(true);
});
```

- [ ] **Step 2: Executar o teste para confirmar a falha**

Run: `./node_modules/.bin/vitest run src/lib/card-colors.test.ts --pool=vmForks --maxWorkers=1 --minWorkers=1`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Criar os ativos e conectar a paleta**

```ts
export const CARD_COLORS = [
  "#0B9D4E", "#1D5D9B", "#8A4FFF", "#C25378",
  "#C56A27", "#2E7B7E", "#0F4C5C", "#A13D5A",
  "#B7791F", "#D05A3A", "#7560C8", "#475569",
] as const;
```

Crie `public/whatspent-logo.svg` como wordmark verde com marca simples, e troque a imagem em `DashboardNav` para `/whatspent-logo.svg`. Substitua a constante local `palette` por `CARD_COLORS`; apresente os botões em uma grade de seis colunas para comportar as doze escolhas. Abaixo deles, acrescente um `input[type=color]` e um campo hexadecimal controlado: qualquer hexadecimal válido atualiza a cor salva; valores parciais retornam à última cor válida ao perder o foco.

- [ ] **Step 4: Executar o teste e a compilação**

Run: `./node_modules/.bin/vitest run src/lib/card-colors.test.ts --pool=vmForks --maxWorkers=1 --minWorkers=1 && npm run build`

Expected: PASS; a compilação termina sem imagem ausente.

- [ ] **Step 5: Commit**

```bash
git add public/whatspent-logo.svg src/lib/card-colors.ts src/lib/card-colors.test.ts src/components/dashboard/dashboard-nav.tsx src/components/financial/credit-cards-workspace.tsx
git commit -m "feat: expand card color palette"
```

### Task 3: Fechamento previsível dos menus

**Files:**
- Create: `src/components/dashboard/menu-state.ts`
- Create: `src/components/dashboard/menu-state.test.ts`
- Modify: `src/components/dashboard/dashboard-nav.tsx:1-75`

**Interfaces:**
- Produces: `reduceOpenMenu(current: string | null, action: { type: "TOGGLE"; label: string } | { type: "DISMISS" }): string | null`.
- Consumes: `reduceOpenMenu` em eventos de botão, clique fora e Escape.

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { expect, it } from "vitest";
import { reduceOpenMenu } from "./menu-state";

it("closes the active menu when dismissed", () => {
  expect(reduceOpenMenu("Financeiro", { type: "DISMISS" })).toBeNull();
});

it("toggles only the requested menu", () => {
  expect(reduceOpenMenu(null, { type: "TOGGLE", label: "Financeiro" })).toBe("Financeiro");
  expect(reduceOpenMenu("Financeiro", { type: "TOGGLE", label: "Financeiro" })).toBeNull();
  expect(reduceOpenMenu("Financeiro", { type: "TOGGLE", label: "Agenda" })).toBe("Agenda");
});
```

- [ ] **Step 2: Executar o teste para confirmar a falha**

Run: `./node_modules/.bin/vitest run src/components/dashboard/menu-state.test.ts --pool=vmForks --maxWorkers=1 --minWorkers=1`

Expected: FAIL because the reducer module does not exist.

- [ ] **Step 3: Implementar estado e eventos**

```ts
export function reduceOpenMenu(current: string | null, action: MenuAction) {
  if (action.type === "DISMISS") return null;
  return current === action.label ? null : action.label;
}
```

Transforme `DashboardNav` em componente cliente. Guarde o cabeçalho em `useRef<HTMLElement>`; em um efeito, registre `pointerdown` e `keydown`. Quando o alvo estiver fora do cabeçalho ou a tecla for Escape, despache `DISMISS`. Substitua cada `details/summary` por botão com `aria-expanded` e painel condicional. Cada `Link` deve dispensar o menu antes da navegação.

- [ ] **Step 4: Executar o teste e validar o comportamento**

Run: `./node_modules/.bin/vitest run src/components/dashboard/menu-state.test.ts --pool=vmForks --maxWorkers=1 --minWorkers=1 && npm run build`

Expected: PASS. Em navegador: abrir Financeiro, clicar no conteúdo e pressionar Escape fecham o painel; abrir Agenda fecha Financeiro.

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/menu-state.ts src/components/dashboard/menu-state.test.ts src/components/dashboard/dashboard-nav.tsx
git commit -m "fix: dismiss dashboard menus on outside click"
```

### Task 4: Publicação e revisão visual

**Files:**
- Verify: `src/app/api/financial/card-statements/route.ts`
- Verify: `src/components/dashboard/dashboard-nav.tsx`
- Verify: `src/components/financial/credit-cards-workspace.tsx`

**Interfaces:**
- Consumes: build aprovado e credenciais já configuradas da Vercel.
- Produces: produção com cabeçalho, cartões e menu atualizados.

- [ ] **Step 1: Executar a suíte focada**

Run: `./node_modules/.bin/vitest run src/app/api/financial/card-statements/route.test.ts src/lib/card-colors.test.ts src/components/dashboard/menu-state.test.ts --pool=vmForks --maxWorkers=1 --minWorkers=1`

Expected: PASS.

- [ ] **Step 2: Verificar qualidade do diff**

Run: `git diff --check && npm run build`

Expected: sem erros de espaços e build concluído.

- [ ] **Step 3: Publicar**

```bash
npx vercel --prod --yes --force --scope lucas-1300s-projects
```

Expected: deployment Ready com alias `whatspent.com`.

- [ ] **Step 4: Revisar em produção**

Confirme que o logo aparece no topo, o Magalu mostra R$ 1.153,81, o Itaú continua em R$ 2.760,07, o formulário apresenta 12 cores e o menu fecha por clique fora/Escape.

- [ ] **Step 5: Registrar somente uma correção encontrada na revisão**

```bash
git add src/app/api/financial/card-statements/route.ts src/components/dashboard/dashboard-nav.tsx src/components/financial/credit-cards-workspace.tsx
git commit -m "fix: polish card and navigation updates"
```

Execute este passo apenas se a revisão visual exigir alteração em um desses três arquivos; se não houver alteração, não crie um commit vazio.
