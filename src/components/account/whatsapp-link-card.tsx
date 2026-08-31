"use client";

import { CheckCircle2, Copy, LoaderCircle, RefreshCw, Smartphone } from "lucide-react";
import { useState } from "react";

type WhatsAppLinkCardProps = { initialPhone: string | null };
type Verification = { phone: string; code: string; expiresAt: string };

export function WhatsAppLinkCard({ initialPhone }: WhatsAppLinkCardProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [draft, setDraft] = useState(initialPhone || "");
  const [verification, setVerification] = useState<Verification | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(!initialPhone);

  async function refreshPhone() {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/assistant/whatsapp-phone", { cache: "no-store" });
      const body = await response.json() as { phone?: string | null; error?: string };
      if (!response.ok) throw new Error(body.error || "Não foi possível atualizar o status do WhatsApp.");
      if (!body.phone) throw new Error("Ainda não recebemos a confirmação. Envie o código pelo WhatsApp e tente novamente.");
      setPhone(body.phone);
      setDraft(body.phone);
      setVerification(null);
      setEditing(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível atualizar o status do WhatsApp.");
    } finally {
      setSaving(false);
    }
  }

  async function startVerification() {
    if (!draft.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/assistant/whatsapp-phone", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: draft }),
      });
      const body = await response.json() as { phone?: string; code?: string; expiresAt?: string; verified?: boolean; error?: string };
      if (!response.ok) throw new Error(body.error || "Não foi possível iniciar a confirmação do WhatsApp.");
      if (body.verified && body.phone) {
        setPhone(body.phone);
        setDraft(body.phone);
        setVerification(null);
        setEditing(false);
        return;
      }
      if (!body.phone || !body.code || !body.expiresAt) throw new Error("Não foi possível gerar o código de confirmação.");
      setDraft(body.phone);
      setVerification({ phone: body.phone, code: body.code, expiresAt: body.expiresAt });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível iniciar a confirmação do WhatsApp.");
    } finally {
      setSaving(false);
    }
  }

  async function copyCode() {
    if (verification) await navigator.clipboard?.writeText(`VINCULAR ${verification.code}`);
  }

  return <section className="rounded-[1.75rem] border border-[#dcebe2] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(12,100,53,.36)] sm:p-7">
    <div className="flex items-start gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf9f1] text-[#087d3c]"><Smartphone className="h-5 w-5" /></span>
      <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#079347]">WhatsApp pessoal</p><h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Seu número, seu agente.</h2><p className="mt-2 text-sm leading-relaxed text-[#678176]">Confirmamos que o número é seu antes de associá-lo ao agente. Isso protege seus lançamentos e sua agenda.</p></div>
    </div>

    {!editing && phone ? <div className="mt-6 rounded-2xl border border-[#d2eadb] bg-[#f1fbf4] p-4"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#087d3c]" /><div><p className="text-sm font-bold text-[#17372b]">WhatsApp confirmado</p><p className="mt-1 text-sm text-[#4f7562]">Mensagens de <span className="font-semibold">{phone}</span> chegam ao seu agente pessoal.</p></div></div><button type="button" onClick={() => { setDraft(phone); setEditing(true); }} className="shrink-0 text-sm font-bold text-[#087d3c] hover:text-[#056c35]">Alterar</button></div></div> : verification ? <div className="mt-6 rounded-2xl border border-[#c9dfef] bg-[#f0f8ff] p-4"><p className="text-sm font-bold text-[#17372b]">Confirme pelo seu WhatsApp</p><p className="mt-1 text-sm leading-relaxed text-[#4f7562]">Envie esta mensagem para o WhatSpent pelo número <span className="font-semibold">{verification.phone}</span>. O código expira às {new Date(verification.expiresAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}.</p><div className="mt-4 flex flex-wrap items-center gap-2"><code className="rounded-xl bg-white px-3 py-2 text-sm font-bold tracking-[0.12em] text-[#17372b]">VINCULAR {verification.code}</code><button type="button" onClick={() => void copyCode()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#b9d4e8] px-3 text-sm font-bold text-[#176f9b] hover:bg-white"><Copy className="h-4 w-4" />Copiar</button><button type="button" onClick={() => void refreshPhone()} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#087d3c] px-3 text-sm font-bold text-white disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${saving ? "animate-spin" : ""}`} />Já enviei</button></div></div> : <form onSubmit={(event) => { event.preventDefault(); void startVerification(); }} className="mt-6"><label className="block text-sm font-bold text-[#315f48]" htmlFor="whatsapp-phone">Número do seu WhatsApp</label><p className="mt-1 text-xs leading-relaxed text-[#789083]">Use o formato internacional com DDI. Exemplo: +5511999999999.</p><div className="mt-3 flex flex-col gap-2 sm:flex-row"><input id="whatsapp-phone" value={draft} onChange={(event) => setDraft(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="+5511999999999" className="h-11 min-w-0 flex-1 rounded-xl border border-[#cfe1d6] px-3 text-sm text-[#17372b] outline-none placeholder:text-[#91a59b] focus:border-[#69b783]" /><button disabled={saving || !draft.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#087d3c] px-4 text-sm font-bold text-white transition-colors hover:bg-[#056c35] disabled:cursor-not-allowed disabled:opacity-50">{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}{saving ? "Gerando código…" : "Gerar código"}</button></div>{phone && <button type="button" onClick={() => setEditing(false)} className="mt-3 text-sm font-semibold text-[#638072] hover:text-[#315f48]">Cancelar</button>}</form>}

    {error && <div role="alert" className="mt-4 rounded-xl bg-[#fff0ed] p-3.5 text-sm text-[#a1453f]"><p>{error}</p></div>}
  </section>;
}
