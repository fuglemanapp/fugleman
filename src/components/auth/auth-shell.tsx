import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthShell({ children, eyebrow, title, description }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#f4f8f5] px-4 py-8 text-[#17372b] sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-[#dcebe2] bg-white shadow-[0_32px_100px_-52px_rgba(12,100,53,.42)] lg:grid-cols-[1fr_.92fr]">
        <section className="flex flex-col bg-[#0b4d2b] p-7 text-white sm:p-10 lg:p-12">
          <Link href="/" className="inline-flex w-fit items-center" aria-label="Voltar para a página inicial do WhatSpent">
            <Image src="/whatspent-logo.svg" alt="WhatSpent" width={184} height={36} className="h-9 w-auto brightness-0 invert" priority />
          </Link>
          <div className="my-auto max-w-md py-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9ee7b9]">{eyebrow}</p>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">{title}</h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-[#c7ebd4] sm:text-lg">{description}</p>
          </div>
          <p className="text-sm leading-relaxed text-[#a7d8b9]">Validação gratuita. Você controla o que registra e qual número conversa com seu agente.</p>
        </section>
        <section className="flex items-center p-6 sm:p-10 lg:p-12">{children}</section>
      </div>
    </main>
  );
}
