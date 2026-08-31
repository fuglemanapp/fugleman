"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";

export function PublicOnboarding({ userId }: { userId: string }) {
  const storageKey = `whatspent:onboarding:${userId}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(storageKey) !== "dismissed");
  }, [storageKey]);

  if (!visible) return null;

  return <section className="mb-6 rounded-[1.5rem] border border-[#bde3c9] bg-[#edf9f1] p-5 text-[#17372b] shadow-[0_16px_36px_-28px_rgba(12,100,53,.45)]"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#087d3c]" /><div className="min-w-0 flex-1"><p className="font-semibold">Sua conta está pronta.</p><p className="mt-1 text-sm leading-relaxed text-[#4f7562]">Vincule seu WhatsApp na conta, registre seu primeiro lançamento e use o painel para acompanhar sua rotina.</p></div><button type="button" aria-label="Fechar boas-vindas" onClick={() => { window.localStorage.setItem(storageKey, "dismissed"); setVisible(false); }} className="rounded-lg p-1 text-[#4f7562] hover:bg-white"><X className="h-4 w-4" /></button></div></section>;
}
