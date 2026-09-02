import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PUBLIC_BRAND_NAME } from "../lib/public-brand";
import Home from "./page";

describe("Home", () => {
  it("renders the Whatspent public experience with a clear signup path", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("Dinheiro e rotina");
    expect(html).toContain("Finanças que você consegue enxergar");
    expect(html).toContain("Cartões sem surpresa no fechamento");
    expect(html).toContain("Agenda e organização no mesmo ritmo");
    expect(html).toContain(`Como funciona o ${PUBLIC_BRAND_NAME}`);
    expect(html).toContain("Tudo para começar com clareza.");
    expect(html).toContain(`O ${PUBLIC_BRAND_NAME} está gratuito durante a fase de validação.`);
    expect(html).toContain("Sua rotina cabe em uma conversa.");
    expect(html).toContain("Criar conta grátis");
    expect(html).toContain(`alt="${PUBLIC_BRAND_NAME}"`);
    expect(html).not.toContain("WhatSpent");
  });
});
