import React from "react";
import Link from "next/link";
import { ArrowRight, LockKeyhole, MessageCircleMore, Sparkles } from "lucide-react";
import { LandingPhone } from "./landing-phone";

const proofPoints = [
  { icon: MessageCircleMore, text: "Conversa natural" },
  { icon: LockKeyhole, text: "Painel privado" },
  { icon: Sparkles, text: "Gratuito em validação" },
];

export function LandingHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#dff1e5] bg-[#f7fcf8] pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pb-32 lg:pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_85%_15%,rgba(0,200,83,.27),transparent_30%),radial-gradient(circle_at_12%_17%,rgba(122,233,167,.31),transparent_31%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[4%] top-24 -z-10 size-[520px] rounded-full border border-[#91e5ac]/50" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:gap-20 lg:px-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#bce9ca] bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#087d3c] shadow-sm">
            <span className="size-2 rounded-full bg-[#00c853] shadow-[0_0_0_4px_rgba(0,200,83,.12)]" />
            Seu assistente no WhatsApp
          </div>
          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[.99] tracking-[-.065em] text-[#063d24] sm:text-6xl lg:text-7xl">
            Dinheiro e rotina, <span className="text-[#00a646]">organizados em uma conversa.</span>
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-[#527461] sm:text-xl">
            Fale do seu jeito sobre gastos, cartões e compromissos. O WhatSpent organiza a informação e deixa tudo claro no seu painel.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#087d3c] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_38px_-18px_rgba(8,125,60,.8)] transition hover:-translate-y-0.5 hover:bg-[#063d24]" href="/cadastro">
              Criar conta grátis <ArrowRight className="size-5" />
            </Link>
            <a className="inline-flex items-center justify-center rounded-2xl border border-[#ccebd6] bg-white px-6 py-4 text-base font-semibold text-[#087d3c] transition hover:border-[#8cdca9] hover:bg-[#f1fbf4]" href="#como-funciona">
              Entender como funciona
            </a>
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-[#416a51] sm:grid-cols-3">
            {proofPoints.map(({ icon: Icon, text }) => (
              <li className="flex items-center gap-2" key={text}><Icon aria-hidden="true" className="size-4 shrink-0 text-[#00a646]" />{text}</li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[460px] py-3 sm:py-6">
          <div aria-hidden="true" className="absolute -left-5 top-24 hidden rounded-2xl border border-white/90 bg-white/85 p-3 shadow-[0_22px_50px_-28px_rgba(6,61,36,.6)] sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#67937a]">No painel</p>
            <p className="mt-1 text-sm font-bold text-[#063d24]">Tudo no mesmo lugar</p>
          </div>
          <LandingPhone scenario="finance" />
        </div>
      </div>
    </section>
  );
}
