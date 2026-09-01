import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the WhatSpent public experience with a clear signup path", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("Dinheiro e rotina");
    expect(html).toContain("Criar conta grátis");
    expect(html).toContain('alt="WhatSpent"');
  });
});
