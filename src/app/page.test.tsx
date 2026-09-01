import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the WhatSpent public experience with a clear signup path", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("Dinheiro e rotina");
    expect(html).toContain("Finanças que você consegue enxergar");
    expect(html).toContain("Cartões sem surpresa no fechamento");
    expect(html).toContain("Agenda e organização no mesmo ritmo");
    expect(html).toContain("Como funciona o WhatSpent");
    expect(html).toContain("Tudo para começar com clareza.");
    expect(html).toContain("O WhatSpent está gratuito durante a fase de validação.");
    expect(html).toContain("Sua rotina cabe em uma conversa.");
    expect(html).toContain("Criar conta grátis");
    expect(html).toContain('alt="WhatSpent"');
  });
});
