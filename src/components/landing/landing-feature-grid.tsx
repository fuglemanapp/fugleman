import React from "react";
import Link from "next/link";
import { CalendarDays, CreditCard, MessageCircle, ArrowUpRight } from "lucide-react";
import { PUBLIC_BRAND_NAME } from "../../lib/public-brand";

const features = [
  {
    id: "funcionalidades",
    icon: MessageCircle,
    eyebrow: "Conversa que trabalha por você",
    title: "Fale naturalmente. O painel organiza.",
    text: `Registre uma despesa ou faça uma pergunta como você falaria com alguém de confiança. O ${PUBLIC_BRAND_NAME} transforma sua intenção em organização.`,
  },
  {
    id: "cartoes",
    icon: CreditCard,
    eyebrow: "Visão de cartões",
    title: "Enxergue as próximas faturas com antecedência.",
    text: "Cada compra e parcela fica organizada no mês certo para que seus cartões deixem de ser uma surpresa no fim do ciclo.",
  },
  {
    id: "agenda",
    icon: CalendarDays,
    eyebrow: "Rotina em ordem",
    title: "Compromissos importantes não ficam esquecidos.",
    text: "Crie e acompanhe sua agenda no mesmo espaço em que você cuida do dinheiro e das decisões do dia a dia.",
  },
] as const;

export function LandingFeatureGrid() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#00a646]">Menos atrito, mais clareza</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-.055em] text-[#063d24] sm:text-5xl">Uma rotina mais leve começa com o que você já usa todos os dias.</h2>
        </div>
        <div className="mt-14 grid gap-12 border-t border-[#dff1e5] pt-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <p className="max-w-sm text-lg leading-relaxed text-[#5e806d]">O {PUBLIC_BRAND_NAME} foi desenhado para reduzir as pequenas pendências que consomem sua atenção ao longo do dia.</p>
          <div>
            {features.map(({ eyebrow, icon: Icon, id, text, title }, index) => (
              <article className="group grid gap-4 border-b border-[#dff1e5] py-7 first:pt-0 sm:grid-cols-[3.25rem_1fr_auto] sm:gap-6" id={id} key={id}>
                <div className="flex size-10 items-center justify-center rounded-full border border-[#ccebd6] text-[#087d3c] transition group-hover:border-[#087d3c] group-hover:bg-[#087d3c] group-hover:text-white"><Icon className="size-5" /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.15em] text-[#00a646]">0{index + 1} · {eyebrow}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-.04em] text-[#063d24]">{title}</h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-[#5e806d]">{text}</p>
                </div>
                <span className="hidden self-start text-sm font-semibold text-[#087d3c] sm:block">Explorar</span>
              </article>
            ))}
          </div>
        </div>
        <section className="relative mt-20 overflow-hidden rounded-[2rem] bg-[#063d24] px-7 py-10 text-white shadow-[0_30px_80px_-40px_rgba(6,61,36,.9)] sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between">
          <div className="pointer-events-none absolute -right-10 -top-20 size-72 rounded-full border border-[#71e99a]/20" />
          <div className="pointer-events-none absolute -right-2 top-7 size-48 rounded-full border border-[#71e99a]/10" />
          <div className="relative max-w-2xl" id="como-comecar">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#7ce6a1]">Comece em poucos minutos</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-.05em] sm:text-4xl">Crie sua conta, conecte seu número e comece a conversar.</h2>
            <p className="mt-4 max-w-xl text-[#c4ead1]">Você escolhe o que quer registrar. O {PUBLIC_BRAND_NAME} organiza o restante para você enxergar sua rotina com calma.</p>
          </div>
          <Link className="relative mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#00c853] px-6 py-4 font-semibold text-[#063d24] transition hover:-translate-y-0.5 hover:bg-[#72eb9c] lg:mt-0" href="/cadastro">Criar conta grátis <ArrowUpRight className="size-5" /></Link>
        </section>
      </div>
    </section>
  );
}
