import React from "react";
import Image from "next/image";
import { CheckCheck, ChevronLeft, Mic, Paperclip, Phone, Video } from "lucide-react";

type LandingPhoneProps = {
  scenario: "finance" | "agenda";
  compact?: boolean;
};

const scenarios = {
  finance: {
    outgoing: "Gastei 82 reais no mercado com o cartão.",
    response: "Registrei R$ 82,00 em Alimentação. Você acompanha esse gasto no painel quando quiser.",
    chip: "Lançamento organizado",
  },
  agenda: {
    outgoing: "Marca a consulta de quinta às 14h.",
    response: "Compromisso criado para quinta, 14h. Ele já aparece na sua agenda.",
    chip: "Agenda atualizada",
  },
} as const;

export function LandingPhone({ compact = false, scenario }: LandingPhoneProps) {
  const message = scenarios[scenario];

  return (
    <div aria-label="Conversa demonstrativa no WhatsApp" className={`relative mx-auto w-full ${compact ? "max-w-[282px]" : "max-w-[340px]"}`}>
      <div aria-hidden="true" className="absolute -inset-7 -z-10 rounded-[3.5rem] bg-[#00c853]/20 blur-3xl" />
      <div className="overflow-hidden rounded-[2.65rem] border-[7px] border-[#123a29] bg-[#123a29] shadow-[0_36px_80px_-26px_rgba(6,61,36,.65)]">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-[#efeae2]">
          <div className="flex items-center justify-between bg-white px-5 pb-1 pt-2 text-[10px] font-bold text-[#123a29]">
            <span>09:41</span>
            <span className="h-4 w-[86px] rounded-full bg-[#123a29]" />
            <span>●●●</span>
          </div>
          <div className="flex items-center gap-2.5 border-b border-black/5 bg-white px-3 py-2.5">
            <ChevronLeft aria-hidden="true" className="size-5 text-[#1d5c3e]" />
            <Image alt="Ícone WhatSpent" className="size-9 rounded-xl" height={72} src="/brand/whatspent-icon.png" unoptimized width={72} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-none text-[#173d2a]">WhatSpent</p>
              <p className="mt-1 text-[10px] text-[#658272]">Conta comercial</p>
            </div>
            <Video aria-hidden="true" className="size-4 text-[#1d5c3e]" />
            <Phone aria-hidden="true" className="size-4 text-[#1d5c3e]" />
          </div>
          <div className={`bg-[linear-gradient(135deg,#efeae2,#e8f4ec)] p-3 ${compact ? "min-h-[388px]" : "min-h-[444px]"}`}>
            <p className="mx-auto w-fit rounded-md bg-white/85 px-2 py-1 text-[9px] font-semibold text-[#658272] shadow-sm">Hoje</p>
            <div className="mt-5 ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#d6f8df] px-3 py-2.5 text-[13px] leading-relaxed text-[#173d2a] shadow-sm">
              {message.outgoing}
              <span className="mt-1 flex items-center justify-end gap-1 text-[9px] text-[#5e806d]">09:40 <CheckCheck aria-hidden="true" className="size-3 text-[#087d3c]" /></span>
            </div>
            <div className="mt-3 max-w-[93%] rounded-2xl rounded-tl-sm bg-white px-3 py-3 text-[13px] leading-relaxed text-[#315a41] shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Image alt="" aria-hidden="true" className="size-5 rounded-md" height={40} src="/brand/whatspent-icon.png" unoptimized width={40} />
                <p className="text-xs font-bold text-[#173d2a]">WhatSpent</p>
              </div>
              {message.response}
              <span className="mt-2 block text-right text-[9px] text-[#83a193]">09:41</span>
            </div>
            <span className="mt-3 inline-flex rounded-full border border-[#b9e8c9] bg-[#effbf2] px-2.5 py-1 text-[10px] font-semibold text-[#087d3c]">{message.chip}</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2.5">
            <Paperclip aria-hidden="true" className="size-4 text-[#789487]" />
            <div className="flex h-9 flex-1 items-center rounded-full bg-[#f3f7f4] px-3 text-[11px] text-[#92a99d]">Mensagem</div>
            <Mic aria-hidden="true" className="size-5 text-[#087d3c]" />
          </div>
        </div>
      </div>
    </div>
  );
}
