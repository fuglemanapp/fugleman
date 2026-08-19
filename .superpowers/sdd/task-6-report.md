# Tarefa 6 — Histórico e ações de compras no cartão

## Implementado

- O histórico de cada compra agora é compacto: compras à vista exibem `À vista · 1/1` e compras parceladas mostram a parcela atual, o valor por parcela e quantas parcelas ainda faltam.
- As parcelas já pagas não são listadas como cronograma extenso nem transformadas em faturas antigas; o histórico usa a parcela ativa persistida, com compatibilidade para registros legados.
- Cada compra tem ações explícitas `Editar` (reutiliza o modal preenchido) e `Excluir compra`. A exclusão confirma o nome da compra, chama o endpoint de compras com contexto e mantém o cartão ativo.
- O arquivamento passou a ser a ação textual `Arquivar cartão`, com confirmação distinta que esclarece que a ação afeta o cartão inteiro, não uma compra.

## Verificação

- `npx tsc --noEmit` — aprovado.
- `npm run lint` — aprovado.
- `npm test -- src/lib/card-purchase-input.test.ts src/lib/credit-cards.test.ts src/app/api/financial/card-purchases/route.test.ts` — 27 testes aprovados.
- `git diff --check -- src/components/financial/credit-cards-workspace.tsx` — aprovado antes do commit.
- A verificação manual no navegador não pôde ser concluída: `npm run dev` iniciou processos, mas o servidor não ficou acessível em `localhost:3000`, e não havia banco/sessão autenticada disponível para criar os dados do roteiro.

## Correção de revisão

- O `DELETE /api/financial/card-purchases` passou a resolver o `context` recebido e só localiza a compra quando ela pertence ao usuário e seu cartão ativo pertence ao mesmo contexto. A exclusão continua removendo apenas a compra e a transação vinculada; nenhuma operação de remoção ou arquivamento de cartão foi adicionada.
- Foi adicionado teste de regressão para garantir que um contexto divergente retorna `404` e não exclui compra, transação ou cartão.
- `npm test -- src/app/api/financial/card-purchases/route.test.ts` — 4 testes aprovados.
- `npm run lint` — aprovado.
- `npx tsc --noEmit` segue bloqueado por declarações duplicadas pré-existentes em `.next/types` (`cache-life.d 2.ts`/`3.ts` e `routes.d 2.ts`/`3.ts`), fora deste escopo.
- `git diff --check -- src/app/api/financial/card-purchases/route.ts src/app/api/financial/card-purchases/route.test.ts` — aprovado.

Commit da correção: `316bf99` — `fix: validate card purchase delete context`.

## Commit

- `21e3e4b` — `feat: add card purchase actions`
