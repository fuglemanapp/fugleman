import React from "react";
import Link from "next/link";
import { LandingLogo } from "./landing-logo";

export function LandingFooter() {
  return (
    <footer className="bg-[#04351f] px-5 pb-8 pt-16 text-white sm:px-8 lg:px-10 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_82%_16%,rgba(0,200,83,0.32),transparent_30%),linear-gradient(135deg,#087d3c,#04351f)] px-7 py-10 shadow-[0_24px_64px_rgba(0,0,0,0.2)] sm:px-10 sm:py-12">
          <div className="absolute -right-20 -top-24 size-64 rounded-full border border-white/10" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#98f2bd]">Comece durante a validação</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.055em] text-white sm:text-5xl">Sua rotina cabe em uma conversa.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#d7f4e2]">Crie sua conta, conecte seu número e acompanhe seu dinheiro e sua rotina no mesmo lugar.</p>
            </div>
            <Link className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#00c853] px-6 text-sm font-bold text-[#04351f] shadow-[0_16px_32px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-white" href="/cadastro">Criar conta grátis</Link>
          </div>
        </section>

        <div className="mt-14 flex flex-col gap-10 border-b border-white/10 pb-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
          <LandingLogo />
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#bad8c4]">Organização financeira e rotina, direto no seu WhatsApp.</p>
          </div>
          <nav aria-label="Navegação do produto" className="grid grid-cols-2 gap-x-10 gap-y-1 text-sm font-medium text-[#d7f4e2] sm:flex sm:flex-wrap sm:gap-x-7">
            <a className="inline-flex min-h-[40px] items-center transition hover:text-white" href="#financas">Finanças</a>
            <a className="inline-flex min-h-[40px] items-center transition hover:text-white" href="#cartoes">Cartões</a>
            <a className="inline-flex min-h-[40px] items-center transition hover:text-white" href="#agenda">Agenda</a>
            <a className="inline-flex min-h-[40px] items-center transition hover:text-white" href="#organizacao">Organização</a>
            <Link className="inline-flex min-h-[40px] items-center transition hover:text-white" href="/login">Entrar</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-4 py-7 text-xs text-[#a6c9b2] sm:flex-row sm:items-center sm:justify-between">
          <p>WhatSpent · gratuito durante a fase de validação.</p>
          <nav aria-label="Links institucionais" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="hover:text-white" href="/termos">Termos</Link>
            <Link className="hover:text-white" href="/privacidade">Privacidade</Link>
            <a className="hover:text-white" href="mailto:suporte@whatspent.com">suporte@whatspent.com</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
