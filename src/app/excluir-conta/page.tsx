import Link from "next/link";

import { DeletionRequestCard } from "@/components/account/deletion-request-card";
import { getCurrentUser } from "@/lib/current-user";

export default async function DeleteAccountPage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-[#f6faf7] px-6 py-12 text-[#183b2e]">
      <article className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-emerald-100 md:p-12">
        <Link href="/" className="text-sm font-semibold text-emerald-700 hover:underline">← WhatSpent</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">Sua conta</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Excluir conta</h1>
        <p className="mt-4 text-sm leading-7 text-slate-700">Para impedir solicitações indevidas, verificamos sua identidade antes de concluir a exclusão. Esta ação não é instantânea.</p>

        {user ? <>
          <a href="/api/account/export" className="mt-8 inline-flex rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
            Baixar uma cópia dos meus dados
          </a>
          <DeletionRequestCard />
        </> : (
          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <p className="text-sm text-slate-700">Entre na sua conta para solicitar a exclusão.</p>
            <Link href="/entrar?next=/excluir-conta" className="mt-4 inline-flex rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Entrar</Link>
          </div>
        )}

        <p className="mt-8 text-sm text-slate-600">Se precisar de ajuda, fale com <a className="font-semibold text-emerald-700 hover:underline" href="mailto:suporte@whatspent.com">suporte@whatspent.com</a>. Leia a <Link href="/privacidade" className="font-semibold text-emerald-700 hover:underline">Política de Privacidade</Link>.</p>
      </article>
    </main>
  );
}
