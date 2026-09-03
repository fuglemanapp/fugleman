"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { safeCallbackPath } from "@/lib/auth-navigation";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackPath(searchParams.get("callbackUrl"));
  const [name, setName] = useState("");
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const body = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) {
        setError(body?.error || "Não foi possível criar sua conta agora.");
        return;
      }

      const result = await signIn("credentials", { redirect: false, email, password, callbackUrl });
      if (!result?.ok) {
        router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setError("Não foi possível criar sua conta agora. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#079347]">Comece gratuitamente</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#17372b]">Crie sua conta</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#678176]">Depois, no painel, vincule o número pelo qual você falará com o WhatSpent.</p>

      <div className="mt-7">
        <GoogleAuthButton callbackUrl={callbackUrl} label="Criar conta com Google" />
        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#9bb0a3]">
          <span className="h-px flex-1 bg-[#e0ece5]" />
          ou
          <span className="h-px flex-1 bg-[#e0ece5]" />
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-[#315f48]" htmlFor="name">
          Seu nome
          <input id="name" name="name" type="text" autoComplete="name" minLength={2} maxLength={80} required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#cfe1d6] bg-white px-3 text-[#17372b] outline-none transition focus:border-[#079347] focus:ring-4 focus:ring-[#dff5e7]" />
        </label>
        <label className="block text-sm font-semibold text-[#315f48]" htmlFor="email">
          E-mail
          <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#cfe1d6] bg-white px-3 text-[#17372b] outline-none transition focus:border-[#079347] focus:ring-4 focus:ring-[#dff5e7]" />
        </label>
        <label className="block text-sm font-semibold text-[#315f48]" htmlFor="password">
          Crie uma senha
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#cfe1d6] bg-white px-3 text-[#17372b] outline-none transition focus:border-[#079347] focus:ring-4 focus:ring-[#dff5e7]" />
          <span className="mt-1.5 block text-xs font-normal leading-relaxed text-[#789083]">Use pelo menos 10 caracteres, com letras e números.</span>
        </label>
        {error && <p role="alert" className="rounded-xl bg-[#fff0ed] px-3.5 py-3 text-sm text-[#a1453f]">{error}</p>}
        <button type="submit" disabled={submitting} className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#087d3c] px-4 text-sm font-bold text-white shadow-[0_14px_26px_-16px_rgba(8,125,60,.75)] transition hover:bg-[#056c35] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Criando sua conta…" : "Criar conta grátis"}</button>
      </form>

      <p className="mt-5 text-xs leading-relaxed text-[#789083]">Ao criar a conta, você concorda com os <Link href="/termos" className="font-semibold text-[#087d3c] hover:text-[#056c35]">Termos de uso</Link> e a <Link href="/privacidade" className="font-semibold text-[#087d3c] hover:text-[#056c35]">Política de privacidade</Link>.</p>
      <p className="mt-5 text-sm text-[#678176]">Já tem conta? <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-bold text-[#087d3c] hover:text-[#056c35]">Entrar</Link></p>
    </div>
  );
}
