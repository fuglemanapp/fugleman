import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";

import { SignOutButton } from "@/components/account/sign-out-button";
import { WhatsAppLinkCard } from "@/components/account/whatsapp-link-card";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { getCurrentUser } from "@/lib/current-user";
import { ensureWhatsappLinkCode } from "@/lib/whatsapp-link";
import { buildWhatsappLinkUrl } from "@/lib/whatsapp-link-code";

export default async function ContaPage() {
  const user = await getCurrentUser();
  const whatsappLinkCode = user ? await ensureWhatsappLinkCode(user.id) : null;
  const whatsappLinkUrl = whatsappLinkCode ? buildWhatsappLinkUrl(whatsappLinkCode) : null;
  const displayName = user?.name?.trim() || "Sua conta";
  const initial = displayName.charAt(0).toUpperCase() || "W";

  return (
    <div className="min-h-[100dvh] bg-[#f4f8f5] text-[#17372b]">
      <DashboardNav activePath="/dashboard/conta" />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
        <header className="rounded-[2rem] border border-[#dcebe2] bg-white px-6 py-7 shadow-[0_20px_50px_-38px_rgba(12,100,53,.38)] sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#079347]">Minha conta</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#17372b]">Seu espaço no WhatSpent.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#678176]">Gerencie sua identidade, o número que conversa com seu agente e a segurança da sua sessão.</p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <section className="rounded-[1.75rem] border border-[#dcebe2] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(12,100,53,.36)] sm:p-7">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#087d3c] text-lg font-bold text-white shadow-[0_12px_26px_-16px_rgba(8,125,60,.85)]">{initial}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#799187]">Seu perfil</p>
                <h2 className="mt-1 truncate text-xl font-semibold tracking-[-0.03em]">{displayName}</h2>
                <p className="mt-1 truncate text-sm text-[#678176]">{user?.email || "E-mail não disponível"}</p>
              </div>
            </div>

            <div className="mt-7 space-y-3 border-t border-[#e4eee7] pt-5 text-sm">
              <div className="flex items-center gap-3 rounded-2xl bg-[#f6faf7] px-4 py-3 text-[#315f48]"><UserRound className="h-4 w-4 shrink-0 text-[#087d3c]" /><span className="min-w-0 truncate">{displayName}</span></div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#f6faf7] px-4 py-3 text-[#315f48]"><Mail className="h-4 w-4 shrink-0 text-[#087d3c]" /><span className="min-w-0 truncate">{user?.email || "E-mail não disponível"}</span></div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#f6faf7] px-4 py-3 text-[#315f48]"><CalendarDays className="h-4 w-4 shrink-0 text-[#087d3c]" /><span>Conta pessoal do WhatSpent</span></div>
            </div>
          </section>

          <WhatsAppLinkCard initialPhone={user?.phone || null} linkCode={whatsappLinkCode} linkUrl={whatsappLinkUrl} />
        </div>

        <section className="mt-6 flex flex-col gap-5 rounded-[1.75rem] border border-[#dcebe2] bg-white p-6 shadow-[0_20px_50px_-40px_rgba(12,100,53,.36)] sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#edf9f1] text-[#087d3c]"><ShieldCheck className="h-5 w-5" /></span>
            <div>
              <h2 className="font-semibold tracking-[-0.02em]">Segurança da sessão</h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#678176]">Para proteger seus dados financeiros, encerre a sessão ao usar um dispositivo compartilhado.</p>
            </div>
          </div>
          <SignOutButton />
        </section>
      </main>
    </div>
  );
}
