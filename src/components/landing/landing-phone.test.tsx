import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PUBLIC_BRAND_NAME } from "../../lib/public-brand";
import { LandingPhone } from "./landing-phone";

describe("LandingPhone", () => {
  it("shows an official Whatspent WhatsApp finance conversation", () => {
    const html = renderToStaticMarkup(<LandingPhone scenario="finance" />);

    expect(html).toContain('src="/brand/whatspent-icon.png"');
    expect(html).toContain("Gastei 82 reais no mercado");
    expect(html).toContain("Registrei R$ 82,00 em Alimentação");
    expect(html).toContain(PUBLIC_BRAND_NAME);
    expect(html).not.toContain("WhatSpent");
  });
});
