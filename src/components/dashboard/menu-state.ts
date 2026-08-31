export type MenuAction =
  | { type: "TOGGLE"; label: string }
  | { type: "DISMISS" };

export function reduceOpenMenu(
  currentMenu: string | null,
  action: MenuAction,
) {
  if (action.type === "DISMISS") {
    return null;
  }

  return currentMenu === action.label ? null : action.label;
}
