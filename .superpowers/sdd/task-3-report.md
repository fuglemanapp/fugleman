# Tarefa 3 — Parser de compra no cartão

## Resumo

- Criado o parser puro `normalizeCardPurchaseInput` com os modos `CASH` e `INSTALLMENT`.
- Compras à vista são normalizadas para `1/1` e compras parceladas validam valores, limites e parcela atual.
- A escrita exige `amountPerInstallment`; a chave legada ambígua `amount` não é aceita.
- O contrato preserva `amountPerInstallment` sem inferir ou substituir por `totalAmount`.

## Testes

- `npx vitest run src/lib/card-purchase-input.test.ts` — 17 testes aprovados.
- `npx tsc --noEmit` — aprovado.

## Commit

- `feat(financial): add card purchase input parser`
