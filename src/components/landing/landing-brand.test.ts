import { describe, expect, it } from "vitest";
import { landingBrand } from "./landing-brand";

describe("landingBrand", () => {
  it("uses the official green family", () => {
    expect(landingBrand.primary).toBe("#00C853");
    expect(landingBrand.ink).toBe("#063D24");
  });
});
