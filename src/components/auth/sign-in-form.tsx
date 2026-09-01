"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { safeCallbackPath } from "@/lib/auth-navigation";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackPath(searchParams.get("callbackUrl"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");
    try {
      const result = await signIn("credentials", { redirect: false, email, password, callbackUrl });
      if (!result?.ok) {
        setError("E-mail ou senha incorretos.");
        return;
      }

      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setError("Não foi possível entrar agora. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#079347]">Acesse sua conta</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#17372b]">Entre no WhatSpent</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#678176]">Use o e-mail e a senha cadastrados para abrir seu painel.</p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-[#315f48]" htmlFor="email">
          E-mail
          <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#cfe1d6] bg-white px-3 text-[#17372b] outline-none transition focus:border-[#079347] focus:ring-4 focus:ring-[#dff5e7]" />
        </label>
        <label className="block text-sm font-semibold text-[#315f48]" htmlFor="password">
          Senha
          <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#cfe1d6] bg-white px-3 text-[#17372b] outline-none transition focus:border-[#079347] focus:ring-4 focus:ring-[#dff5e7]" />
        </label>
        {error && <p role="alert" className="rounded-xl bg-[#fff0ed] px-3.5 py-3 text-sm text-[#a1453f]">{error}</p>}
        <button type="submit" disabled={submitting} className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#087d3c] px-4 text-sm font-bold text-white shadow-[0_14px_26px_-16px_rgba(8,125,60,.75)] transition hover:bg-[#056c35] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Entrando…" : "Entrar no painel"}</button>
      </form>

      <p className="mt-6 text-sm text-[#678176]">Ainda não tem conta? <Link href={`/cadastro?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-bold text-[#087d3c] hover:text-[#056c35]">Criar conta grátis</Link></p>
    </div>
  );
}
