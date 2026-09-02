import { describe, expect, it } from "vitest";
import { PUBLIC_BRAND_NAME } from "./public-brand";

describe("PUBLIC_BRAND_NAME", () => {
  it("uses the OAuth-approved public spelling", () => {
    expect(PUBLIC_BRAND_NAME).toBe("Whatspent");
  });
});
