import { expect, it } from "vitest";

import { buildAccountUrl } from "./account-email";

it("builds a public account link without accepting an external host", () => {
  expect(buildAccountUrl("/verificar-email", "opaque-token", "https://whatspent.com").toString())
    .toBe("https://whatspent.com/verificar-email?token=opaque-token");
});
