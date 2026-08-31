"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return <button type="button" onClick={() => void signOut({ callbackUrl: "/" })} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d6e5db] px-4 py-2.5 text-sm font-bold text-[#315f48] transition-colors hover:border-[#c6d9ce] hover:bg-[#f5faf6] hover:text-[#17372b]"><LogOut className="h-4 w-4" />Sair da conta</button>;
}
