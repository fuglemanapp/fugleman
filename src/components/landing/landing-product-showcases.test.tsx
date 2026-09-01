import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingProductShowcases } from "./landing-product-showcases";

describe("LandingProductShowcases", () => {
  it("renders real previews for all product areas", () => {
    const html = renderToStaticMarkup(<LandingProductShowcases />);

    expect(html).toContain('id="financas"');
    expect(html).toContain('id="cartoes"');
    expect(html).toContain("Fatura projetada");
    expect(html).toContain("Próximos compromissos");
    expect(html).toContain("Projetos, tarefas, notas e arquivos");
  });
});
