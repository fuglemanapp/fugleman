"use client";

import { UsersRound, UserRound } from "lucide-react";

export type FinancialWorkspace = {
  key: string;
  label: string;
  type: "PERSONAL" | "FAMILY";
  role?: string;
};

type FinancialContextSwitcherProps = {
  workspaces: FinancialWorkspace[];
  value: string;
  onChange: (value: string) => void;
};

export function FinancialContextSwitcher({
  workspaces,
  value,
  onChange,
}: FinancialContextSwitcherProps) {
  if (workspaces.length < 2) {
    return null;
  }

  return (
    <label className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#cfe1d6] bg-white px-3 text-sm font-semibold text-[#315f48] shadow-sm">
      <span className="text-[#087d3c]">
        {value.startsWith("team:") ? (
          <UsersRound className="h-4 w-4" />
        ) : (
          <UserRound className="h-4 w-4" />
        )}
      </span>
      <select
        aria-label="Contexto financeiro"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="max-w-44 bg-transparent pr-1 outline-none"
      >
        <option value="personal">Meu espaço</option>
        {workspaces
          .filter((workspace) => workspace.type === "FAMILY")
          .map((workspace) => (
            <option key={workspace.key} value={workspace.key}>
              {workspace.label}
            </option>
          ))}
      </select>
    </label>
  );
}
