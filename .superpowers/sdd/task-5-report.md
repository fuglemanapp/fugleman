# Tarefa 5 — Formulário explícito de compras no cartão

## Implementado

- O formulário passou a usar o contrato `mode`, `amountPerInstallment`, `installments` e `currentInstallment` da API, removendo o payload legado com `amount`.
- Há escolhas acessíveis entre `À vista` e `Parcelada`; compras à vista enviam sempre `1/1`.
- Compras parceladas exibem valor por parcela, quantidade, parcela atual editável, total calculado e progresso.
- A sugestão de parcela atual usa `suggestCurrentInstallment` ao alterar data ou quantidade, sem sobrescrever uma alteração manual.
- O mesmo modal prepara criação e edição, incluindo o fallback seguro para valores de parcelas em compras legadas, e usa `PATCH` quando há uma compra em edição.

## Verificação

- `npm test -- src/lib/card-purchase-input.test.ts src/lib/credit-cards.test.ts src/app/api/financial/card-purchases/route.test.ts` — 27 testes aprovados.
- `npm run lint` — aprovado.
- `npx prisma generate && npx tsc --noEmit` — aprovado; regenerou o cliente Prisma local para reconhecer os campos adicionados na Tarefa 4.
- `npm run build` — compilação e checagem de tipos concluídas; a coleta de dados de páginas ficou bloqueada neste ambiente e os processos de build iniciados para a verificação foram encerrados.
- `git diff --check` — aprovado.

## Commit

- `820e119` — `feat: add card purchase form controls`
