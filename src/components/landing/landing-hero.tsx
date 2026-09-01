import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";

const proofPoints = ["Lançamentos pelo WhatsApp", "Painel privado e organizado", "Validação gratuita"];

export function LandingHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#dff1e5] bg-[#f7fcf8] pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pb-32 lg:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[540px] bg-[radial-gradient(circle_at_80%_10%,rgba(0,200,83,.2),transparent_33%),radial-gradient(circle_at_15%_20%,rgba(122,233,167,.28),transparent_30%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:gap-16 lg:px-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#bce9ca] bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#087d3c] shadow-sm">
            <span className="size-2 rounded-full bg-[#00c853] shadow-[0_0_0_4px_rgba(0,200,83,.12)]" />
            Seu assistente financeiro no WhatsApp
          </div>
          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[.99] tracking-[-.065em] text-[#063d24] sm:text-6xl lg:text-7xl">
            Organize sua vida financeira <span className="text-[#00a646]">sem mudar sua rotina.</span>
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-[#527461] sm:text-xl">
            Anote gastos, acompanhe cartões e organize compromissos em uma conversa natural. O WhatSpent transforma mensagens em clareza no seu painel.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#087d3c] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_38px_-18px_rgba(8,125,60,.8)] transition hover:-translate-y-0.5 hover:bg-[#063d24]" href="/cadastro">
              Criar conta grátis <ArrowRight className="size-5" />
            </Link>
            <a className="inline-flex items-center justify-center rounded-2xl border border-[#ccebd6] bg-white px-6 py-4 text-base font-semibold text-[#087d3c] transition hover:border-[#8cdca9] hover:bg-[#f1fbf4]" href="#como-comecar">
              Entender como funciona
            </a>
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-[#416a51] sm:grid-cols-3">
            {proofPoints.map((point) => (
              <li className="flex items-center gap-2" key={point}><Check className="size-4 shrink-0 text-[#00a646]" />{point}</li>
            ))}
          </ul>
        </div>

        <div aria-label="Prévia do WhatSpent no WhatsApp" className="relative mx-auto w-full max-w-[520px]">
          <div className="absolute -right-10 top-10 size-52 rounded-full bg-[#00c853]/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-[#8cecab]/35 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-[0_34px_90px_-35px_rgba(6,61,36,.45)] sm:p-5">
            <div className="rounded-[1.45rem] bg-[#eef9f1] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image alt="Ícone WhatSpent" className="size-11 rounded-xl shadow-sm" height={88} src="/brand/whatspent-icon.png" width={88} />
                  <div><p className="font-semibold text-[#063d24]">WhatSpent</p><p className="text-xs text-[#67937a]">sempre à mão</p></div>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#087d3c]">Hoje</span>
              </div>
              <div className="mt-8 space-y-4">
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#087d3c] px-4 py-3 text-sm leading-relaxed text-white shadow-sm">Gastei 82 reais no mercado com o cartão.</div>
                <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-white p-4 text-sm leading-relaxed text-[#315a41] shadow-sm">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-[#063d24]"><Sparkles className="size-4 text-[#00a646]" />Anotado</div>
                  Registrei R$ 82,00 em Alimentação. Você pode acompanhar esse gasto no painel quando quiser.
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#d6efdd] bg-white p-3"><p className="text-xs text-[#67937a]">Neste mês</p><p className="mt-1 text-lg font-semibold text-[#063d24]">R$ 1.284</p></div>
                <div className="rounded-2xl border border-[#d6efdd] bg-white p-3"><p className="text-xs text-[#67937a]">Organizado</p><p className="mt-1 flex items-center gap-1 text-lg font-semibold text-[#087d3c]"><ShieldCheck className="size-4" />Tudo em dia</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
