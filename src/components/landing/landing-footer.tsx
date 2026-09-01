import React from "react";
import Link from "next/link";
import { LandingLogo } from "./landing-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-[#dff1e5] bg-[#f7fcf8] py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <LandingLogo />
          <p className="mt-3 text-sm text-[#678176]">Organização financeira e rotina, direto no seu WhatsApp.</p>
        </div>
        <nav aria-label="Links institucionais" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#47705a]">
          <Link className="inline-flex min-h-[44px] items-center px-1 hover:text-[#087d3c]" href="/login">Entrar</Link>
          <Link className="inline-flex min-h-[44px] items-center px-1 hover:text-[#087d3c]" href="/termos">Termos</Link>
          <Link className="inline-flex min-h-[44px] items-center px-1 hover:text-[#087d3c]" href="/privacidade">Privacidade</Link>
          <a className="inline-flex min-h-[44px] items-center px-1 hover:text-[#087d3c]" href="mailto:suporte@whatspent.com">Suporte</a>
        </nav>
      </div>
    </footer>
  );
}
