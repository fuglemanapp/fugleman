import React from "react";
import { CalendarDays, Check, CreditCard, Layers3, MessageCircleMore, Wallet } from "lucide-react";
import { journeySteps, productCapabilities } from "./landing-data";

const icons = {
  wallet: Wallet,
  "credit-card": CreditCard,
  calendar: CalendarDays,
  layers: Layers3,
} as const;

export function LandingProductOverview() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#00a646]">Um lugar para a vida real</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-.055em] text-[#063d24] sm:text-5xl">Tudo o que você precisa acompanhar. Sem trocar de contexto.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#5e806d]">O WhatSpent reúne a conversa que você já usa com uma visão clara do que merece sua atenção.</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {productCapabilities.map(({ eyebrow, icon, id, text, title }) => {
            const Icon = icons[icon];

            return (
              <article className="group min-h-[248px] rounded-[1.75rem] border border-[#d8efdf] bg-[#fbfefc] p-6 shadow-[0_20px_48px_-40px_rgba(6,61,36,.65)] transition duration-300 hover:-translate-y-1 hover:border-[#8fe2aa] hover:bg-white" key={id}>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#e7f9ed] text-[#087d3c] transition group-hover:bg-[#087d3c] group-hover:text-white"><Icon aria-hidden="true" className="size-5" /></div>
                <p className="mt-8 text-xs font-bold uppercase tracking-[.15em] text-[#00a646]">{eyebrow}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-.04em] text-[#063d24]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5e806d]">{text}</p>
              </article>
            );
          })}
        </div>

        <section className="mt-24 rounded-[2rem] border border-[#d8efdf] bg-[#f5fcf7] p-6 sm:p-10 lg:p-12" id="como-funciona">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#087d3c] text-white"><MessageCircleMore aria-hidden="true" className="size-6" /></div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[#00a646]">Como funciona o WhatSpent</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-.05em] text-[#063d24] sm:text-4xl">Do que você fala ao que você enxerga.</h2>
              <p className="mt-5 max-w-md leading-relaxed text-[#5e806d]">A conversa abre a porta. O painel conserva o contexto para você consultar quando precisar.</p>
            </div>
            <ol className="grid gap-4 md:grid-cols-3">
              {journeySteps.map(({ number, text, title }) => (
                <li className="rounded-2xl border border-[#d6ecdd] bg-white p-5" key={number}>
                  <span className="text-xs font-extrabold tracking-[.18em] text-[#00a646]">{number}</span>
                  <h3 className="mt-6 text-lg font-semibold tracking-[-.03em] text-[#063d24]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5e806d]">{text}</p>
                  <Check aria-hidden="true" className="mt-5 size-4 text-[#00a646]" />
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </section>
  );
}
