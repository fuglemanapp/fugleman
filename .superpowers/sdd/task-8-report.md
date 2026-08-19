# Task 8 — Isolamento de cartões por contexto financeiro

## Escopo

- Consultas pessoais de cartões, compras e faturas agora exigem `teamId: null`.
- Consultas familiares usam exclusivamente o `teamId` do contexto financeiro ativo.
- Atualização e arquivamento de cartão também resolvem e validam o contexto solicitado.

## Cobertura de regressão

- Um cartão familiar do próprio usuário não pode ser listado, alterado, arquivado, nem usado para consultar ou registrar compras/faturas no contexto pessoal.
- O mesmo cartão continua disponível para as ações no contexto familiar correspondente.

## Verificação

- `npx vitest run src/app/api/financial/cards/route.test.ts src/app/api/financial/card-purchases/route.test.ts src/app/api/financial/card-statements/route.test.ts`
- `npm run lint`
- `git diff --check`

Não houve alteração no ledger.
