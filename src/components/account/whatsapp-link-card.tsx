"use client";

import { CheckCircle2, ExternalLink, LoaderCircle, MessageCircle, Smartphone } from "lucide-react";
import { useState } from "react";

type WhatsAppLinkCardProps = { initialPhone: string | null };

const WHATSPENT_WHATSAPP_URL = "https://wa.me/13218448741?text=Ol%C3%A1%2C%20acabei%20de%20criar%20minha%20conta%20no%20WhatSpent%20e%20quero%20come%C3%A7ar.";

export function WhatsAppLinkCard({ initialPhone }: WhatsAppLinkCardProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [draft, setDraft] = useState(initialPhone || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [canReplace, setCanReplace] = useState(false);
  const [editing, setEditing] = useState(!initialPhone);

  async function savePhone(replaceExisting = false) {
    if (!draft.trim() || saving) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/assistant/whatsapp-phone", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: draft, replaceExisting }),
      });
      const body = await response.json();
      if (!response.ok) {
        setCanReplace(body.canReplace === true);
        throw new Error(body.error || "Não foi possível vincular seu WhatsApp.");
      }

      setPhone(body.phone);
      setDraft(body.phone);
      setEditing(false);
      setCanReplace(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível vincular seu WhatsApp.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="rounded-[1.75rem] border border-[#dcebe2] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(12,100,53,.36)] sm:p-7">
    <div className="flex items-start gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf9f1] text-[#087d3c]"><Smartphone className="h-5 w-5" /></span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#079347]">WhatsApp pessoal</p>
        <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Seu número, seu agente.</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#678176]">Vincule o número do celular que você usará para falar com o WhatSpent. Assim, cada mensagem é associada somente à sua conta.</p>
      </div>
    </div>

    <a
      href={WHATSPENT_WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#087d3c] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#056c35] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087d3c]"
    >
      <MessageCircle className="h-4 w-4" /> Abrir WhatsApp do WhatSpent <ExternalLink className="h-3.5 w-3.5" />
    </a>
    <p className="mt-2 text-center text-xs leading-relaxed text-[#789083]">Converse com o WhatSpent pelo número oficial para registrar gastos, compromissos e pedidos.</p>

    {!editing && phone ? <div className="mt-6 rounded-2xl border border-[#d2eadb] bg-[#f1fbf4] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#087d3c]" /><div><p className="text-sm font-bold text-[#17372b]">WhatsApp vinculado</p><p className="mt-1 text-sm text-[#4f7562]">Mensagens de <span className="font-semibold">{phone}</span> chegam ao seu agente pessoal.</p></div></div>
        <button type="button" onClick={() => { setDraft(phone); setEditing(true); }} className="shrink-0 text-sm font-bold text-[#087d3c] hover:text-[#056c35]">Alterar</button>
      </div>
    </div> : <form onSubmit={(event) => { event.preventDefault(); void savePhone(); }} className="mt-6">
      <label className="block text-sm font-bold text-[#315f48]" htmlFor="whatsapp-phone">Número do seu WhatsApp</label>
      <p className="mt-1 text-xs leading-relaxed text-[#789083]">Use o formato internacional com DDI. Exemplo: +5511999999999.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row"><input id="whatsapp-phone" value={draft} onChange={(event) => setDraft(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="+5511999999999" className="h-11 min-w-0 flex-1 rounded-xl border border-[#cfe1d6] px-3 text-sm text-[#17372b] outline-none placeholder:text-[#91a59b] focus:border-[#69b783]" /><button disabled={saving || !draft.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#087d3c] px-4 text-sm font-bold text-white transition-colors hover:bg-[#056c35] disabled:cursor-not-allowed disabled:opacity-50">{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}{saving ? "Vinculando…" : "Vincular WhatsApp"}</button></div>
      {phone && <button type="button" onClick={() => setEditing(false)} className="mt-3 text-sm font-semibold text-[#638072] hover:text-[#315f48]">Cancelar</button>}
    </form>}

    {error && <div role="alert" className="mt-4 rounded-xl bg-[#fff0ed] p-3.5 text-sm text-[#a1453f]"><p>{error}</p>{canReplace && <div className="mt-3 border-t border-[#f3ccc6] pt-3"><p className="text-xs leading-relaxed text-[#9d514a]">Nenhum lançamento ou dado financeiro será apagado. Apenas o vínculo do WhatsApp será removido das outras contas e passará para esta.</p><button type="button" disabled={saving} onClick={() => void savePhone(true)} className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#087d3c] px-3.5 text-sm font-bold text-white transition-colors hover:bg-[#056c35] disabled:cursor-not-allowed disabled:opacity-50">{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}{saving ? "Vinculando…" : "Usar este número nesta conta"}</button></div>}</div>}
  </section>;
}
