import React from "react";
import Link from "next/link";
import { ArrowRight, CircleHelp } from "lucide-react";
import { faqItems } from "./landing-data";

export function LandingFaq() {
  return (
    <section aria-labelledby="faq-title" className="border-y border-[#dcefe2] bg-[#f7fcf8] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00a94f]">Dúvidas frequentes</p>
          <h2 id="faq-title" className="mt-4 max-w-md text-4xl font-semibold tracking-[-0.055em] text-[#063d24] sm:text-5xl">
            Tudo para começar com clareza.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[#5f7b6d] sm:text-lg">
            Você cria a conta no site, vincula seu número uma única vez e segue a conversa pelo WhatsApp.
          </p>
          <Link href="/cadastro" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#087d3c] px-6 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(8,125,60,0.2)] transition hover:-translate-y-0.5 hover:bg-[#063d24]">
            Criar conta grátis <ArrowRight className="size-4" />
          </Link>
        </div>

        <dl className="overflow-hidden rounded-[2rem] border border-[#dcefe2] bg-white shadow-[0_20px_60px_rgba(6,61,36,0.06)]">
          {faqItems.map((item, index) => (
            <div key={item.question} className="grid gap-3 border-b border-[#e4f1e8] px-6 py-6 last:border-b-0 sm:grid-cols-[2.25rem_1fr] sm:gap-5 sm:px-8">
              <CircleHelp aria-hidden="true" className="size-6 text-[#00b956]" />
              <div>
                <dt className="text-base font-semibold text-[#063d24] sm:text-lg">{item.question}</dt>
                <dd className="mt-2 max-w-2xl text-sm leading-6 text-[#668174] sm:text-base">{item.answer}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
