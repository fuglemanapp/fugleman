import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PUBLIC_BRAND_NAME } from "../../lib/public-brand";
import { LandingHeader } from "./landing-header";

describe("LandingHeader", () => {
  it("uses the official Whatspent wordmark, full navigation and account paths", () => {
    const html = renderToStaticMarkup(<LandingHeader />);

    expect(html).toContain(`alt="${PUBLIC_BRAND_NAME}"`);
    expect(html).toContain("whatspent-wordmark");
    expect(html).toContain('href="#como-funciona"');
    expect(html).toContain('href="#organizacao"');
    expect(html).toContain('href="/login"');
    expect(html).toContain('href="/cadastro"');
    expect(html).not.toContain("WhatSpent");
  });
});
