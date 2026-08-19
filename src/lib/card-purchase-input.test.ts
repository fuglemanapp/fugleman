import { describe, expect, it } from "vitest";

import { normalizeCardPurchaseInput } from "./card-purchase-input";

describe("normalizeCardPurchaseInput", () => {
  it("normaliza uma compra à vista para a primeira de uma parcela", () => {
    expect(
      normalizeCardPurchaseInput({
        mode: "CASH",
        amountPerInstallment: 90.5,
        installments: 24,
        currentInstallment: 12,
      }),
    ).toEqual({
      value: {
        mode: "CASH",
        amountPerInstallment: 90.5,
        installments: 1,
        currentInstallment: 1,
      },
    });
  });

  it("preserva o valor de cada parcela sem inferir um valor total", () => {
    expect(
      normalizeCardPurchaseInput({
        mode: "INSTALLMENT",
        amountPerInstallment: 272.4,
        installments: 21,
        currentInstallment: 20,
      }),
    ).toEqual({
      value: {
        mode: "INSTALLMENT",
        amountPerInstallment: 272.4,
        installments: 21,
        currentInstallment: 20,
      },
    });
  });

  it("não aceita a chave legada amount como valor de uma nova compra", () => {
    expect(
      normalizeCardPurchaseInput({
        mode: "CASH",
        amount: 90.5,
      }),
    ).toEqual({ error: "Informe um valor por parcela válido." });
  });

  it.each([0, -1, Number.POSITIVE_INFINITY, "invalido", 1_000_000_000.01])(
    "rejeita valor monetário inválido: %s",
    (amountPerInstallment) => {
      expect(
        normalizeCardPurchaseInput({ mode: "CASH", amountPerInstallment }),
      ).toEqual({ error: "Informe um valor por parcela válido." });
    },
  );

  it.each([0, 49, 1.5, "2.5"])('rejeita quantidade de parcelas fora de 1 a 48: %s', (installments) => {
    expect(
      normalizeCardPurchaseInput({
        mode: "INSTALLMENT",
        amountPerInstallment: 25,
        installments,
        currentInstallment: 1,
      }),
    ).toEqual({ error: "Informe uma quantidade de parcelas entre 1 e 48." });
  });

  it.each([0, 22, 1.5, "2.5"])('rejeita parcela atual fora do intervalo: %s', (currentInstallment) => {
    expect(
      normalizeCardPurchaseInput({
        mode: "INSTALLMENT",
        amountPerInstallment: 25,
        installments: 21,
        currentInstallment,
      }),
    ).toEqual({ error: "Informe a parcela atual entre 1 e 21." });
  });

  it("rejeita um modo de compra desconhecido", () => {
    expect(
      normalizeCardPurchaseInput({ mode: "TOTAL", amountPerInstallment: 25 }),
    ).toEqual({ error: "Informe um modo de compra válido." });
  });
});
