# Tarefa 4 — Compras no cartão

## Implementado

- POST normaliza o novo payload, grava o total real da compra e cria somente parcelas pendentes.
- PATCH valida usuário e contexto do cartão, atualiza a transação vinculada e recria somente as parcelas da compra.
- DELETE remove exclusivamente a compra e sua transação vinculada, retornando `{ success: true, purchaseId }`.

## Verificação

- `npm test -- src/lib/card-purchase-input.test.ts src/lib/credit-cards.test.ts src/app/api/financial/card-purchases/route.test.ts` — 27 testes aprovados.
- `npm run lint` — aprovado.
- `npm run build` — aprovado.
- `git diff --check` — aprovado para os arquivos da tarefa.
