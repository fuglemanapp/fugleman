"use client";

import { Check, Copy, ExternalLink, LoaderCircle, MessageCircle } from "lucide-react";
import { useState } from "react";

type WhatsAppLinkCardProps = { initialPhone: string | null; linkCode: string | null; linkUrl: string | null };

const WHATSPENT_WHATSAPP_URL = "https://wa.me/13218448741?text=Ol%C3%A1%2C%20acabei%20de%20criar%20minha%20conta%20no%20WhatSpent%20e%20quero%20come%C3%A7ar.";

export function WhatsAppLinkCard({ initialPhone, linkCode, linkUrl }: WhatsAppLinkCardProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [draft, setDraft] = useState(initialPhone || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [canReplace, setCanReplace] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    if (!linkCode) return;
    try {
      await navigator.clipboard.writeText(linkCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não foi possível copiar. Selecione o código manualmente.");
    }
  }

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
      setShowManual(false);
      setCanReplace(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível vincular seu WhatsApp.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="rounded-[1.75rem] border border-[#dcebe2] bg-white p-6 text-center shadow-[0_20px_50px_-40px_rgba(12,100,53,.36)] sm:p-8">
    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#087d3c] text-white shadow-[0_16px_30px_-18px_rgba(8,125,60,.9)]"><MessageCircle className="h-6 w-6" /></span>
    <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#17372b]">Conectar WhatsApp</h2>

    {linkCode ? <>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#678176]">Toque no botão pra abrir o WhatSpent no WhatsApp — ou mande <span className="font-bold text-[#315f48]">CONECTAR {linkCode}</span> pro nosso número.</p>

      <div className="mt-5 flex items-stretch justify-center gap-2">
        <div className="flex min-w-0 flex-1 items-center justify-center rounded-2xl border border-[#dcebe2] bg-[#f6faf7] px-4 py-4 font-mono text-2xl font-bold tracking-[0.35em] text-[#17372b] sm:text-3xl">{linkCode}</div>
        <button type="button" onClick={() => void copyCode()} aria-label="Copiar código" className="grid w-14 shrink-0 place-items-center rounded-2xl border border-[#dcebe2] bg-white text-[#087d3c] transition-colors hover:border-[#8dcfab] hover:bg-[#f5fcf7]">{copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}</button>
      </div>
      {copied && <p className="mt-2 text-xs font-semibold text-[#087d3c]">Código copiado!</p>}

      <a
        href={linkUrl || WHATSPENT_WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#16a34a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16a34a]"
      >
        <MessageCircle className="h-4 w-4" /> Abrir no WhatsApp <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </> : <a
      href={WHATSPENT_WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#16a34a]"
    >
      <MessageCircle className="h-4 w-4" /> Abrir no WhatsApp <ExternalLink className="h-3.5 w-3.5" />
    </a>}

    {phone && !showManual && <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-[#d2eadb] bg-[#f1fbf4] px-4 py-3 text-sm text-[#4f7562]"><Check className="h-4 w-4 shrink-0 text-[#087d3c]" /><span>Conectado: <span className="font-semibold text-[#17372b]">{phone}</span></span></div>}

    {!showManual ? <button type="button" onClick={() => { setDraft(phone || ""); setError(""); setShowManual(true); }} className="mt-4 text-sm font-semibold text-[#638072] underline decoration-[#c3d6cb] underline-offset-4 transition-colors hover:text-[#315f48]">Prefiro digitar o número manualmente</button> : <form onSubmit={(event) => { event.preventDefault(); void savePhone(); }} className="mt-5 text-left">
      <label className="block text-sm font-bold text-[#315f48]" htmlFor="whatsapp-phone">Número do seu WhatsApp</label>
      <p className="mt-1 text-xs leading-relaxed text-[#789083]">Use o formato internacional com DDI. Exemplo: +5511999999999.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row"><input id="whatsapp-phone" value={draft} onChange={(event) => setDraft(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="+5511999999999" className="h-11 min-w-0 flex-1 rounded-xl border border-[#cfe1d6] px-3 text-sm text-[#17372b] outline-none placeholder:text-[#91a59b] focus:border-[#69b783]" /><button disabled={saving || !draft.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#087d3c] px-4 text-sm font-bold text-white transition-colors hover:bg-[#056c35] disabled:cursor-not-allowed disabled:opacity-50">{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}{saving ? "Vinculando…" : "Vincular"}</button></div>
      <button type="button" onClick={() => { setShowManual(false); setError(""); setCanReplace(false); }} className="mt-3 text-sm font-semibold text-[#638072] hover:text-[#315f48]">Cancelar</button>
    </form>}

    {error && <div role="alert" className="mt-4 rounded-xl bg-[#fff0ed] p-3.5 text-left text-sm text-[#a1453f]"><p>{error}</p>{canReplace && <div className="mt-3 border-t border-[#f3ccc6] pt-3"><p className="text-xs leading-relaxed text-[#9d514a]">Nenhum lançamento ou dado financeiro será apagado. Apenas o vínculo do WhatsApp será removido das outras contas e passará para esta.</p><button type="button" disabled={saving} onClick={() => void savePhone(true)} className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#087d3c] px-3.5 text-sm font-bold text-white transition-colors hover:bg-[#056c35] disabled:cursor-not-allowed disabled:opacity-50">{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}{saving ? "Vinculando…" : "Usar este número nesta conta"}</button></div>}</div>}
  </section>;
}
