import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingLogo } from "./landing-logo";

const navigation = [
  ["Como funciona", "#como-funciona"],
  ["Finanças", "#financas"],
  ["Cartões", "#cartoes"],
  ["Agenda", "#agenda"],
  ["Organização", "#organizacao"],
] as const;

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dff1e5]/90 bg-[#f7fcf8]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link aria-label="Página inicial do WhatSpent" href="/">
          <LandingLogo priority />
        </Link>
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
          {navigation.map(([label, href]) => (
            <a className="inline-flex min-h-11 items-center text-sm font-medium text-[#47705a] transition-colors hover:text-[#087d3c]" href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-[#47705a] transition hover:text-[#087d3c] sm:px-3" href="/login">
            Entrar
          </Link>
          <Link className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#087d3c] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-14px_rgba(8,125,60,.7)] transition hover:-translate-y-0.5 hover:bg-[#063d24] sm:px-5" href="/cadastro">
            <span className="hidden sm:inline">Criar conta grátis</span><span className="sm:hidden">Criar conta</span><ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
