import { expect, it } from "vitest";

import { reduceOpenMenu } from "./menu-state";

it("opens one menu at a time and dismisses it", () => {
  const finance = reduceOpenMenu(null, { type: "TOGGLE", label: "Financeiro" });
  const agenda = reduceOpenMenu(finance, { type: "TOGGLE", label: "Agenda" });

  expect(finance).toBe("Financeiro");
  expect(agenda).toBe("Agenda");
  expect(reduceOpenMenu(agenda, { type: "DISMISS" })).toBeNull();
});

it("closes the open menu when its trigger is selected again", () => {
  expect(reduceOpenMenu("Financeiro", { type: "TOGGLE", label: "Financeiro" })).toBeNull();
});
