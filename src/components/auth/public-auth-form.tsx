"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import React, { FormEvent, useState } from "react";

type PublicAuthFormProps = {
  mode: "register" | "signin" | "reset" | "reset-confirm";
  token?: string | null;
};

type FormResponse = { ok?: boolean; error?: string; message?: string };

const copy = {
  register: { title: "Crie seu espaço", action: "Criar conta" },
  signin: { title: "Entre no WhatSpent", action: "Entrar" },
  reset: { title: "Recupere sua senha", action: "Enviar link" },
  "reset-confirm": { title: "Defina uma nova senha", action: "Salvar nova senha" },
} as const;

async function parseResponse(response: Response) {
  return response.json().catch(() => ({})) as Promise<FormResponse>;
}

export function PublicAuthForm({ mode, token = null }: PublicAuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const hasEmail = mode === "register" || mode === "signin" || mode === "reset";
  const hasPassword = mode === "register" || mode === "signin" || mode === "reset-confirm";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signin") {
        const result = await signIn("credentials", { redirect: false, email, password });
        if (result?.error) throw new Error("E-mail, senha ou confirmação de e-mail inválidos.");
        window.location.assign("/dashboard");
        return;
      }

      const endpoint = mode === "register"
        ? "/api/auth/register"
        : mode === "reset"
          ? "/api/auth/password-reset"
          : "/api/auth/password-reset/confirm";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "register"
          ? { name, email, password }
          : mode === "reset"
            ? { email }
            : { token, password }),
      });
      const body = await parseResponse(response);
      if (!response.ok) throw new Error(body.error || "Não foi possível concluir agora. Tente novamente.");

      if (mode === "register") setMessage(body.message || "Confira seu e-mail para ativar a conta.");
      if (mode === "reset") setMessage("Se houver uma conta com esse e-mail, enviaremos um link em instantes.");
      if (mode === "reset-confirm") setMessage("Senha atualizada. Você já pode entrar.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível concluir agora. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return <form onSubmit={(event) => void submit(event)} className="mt-7 space-y-4">
    {mode === "register" && <label className="block text-sm font-semibold text-[#315f48]">Nome
      <input aria-label="Nome" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required className="mt-1.5 h-11 w-full rounded-xl border border-[#cfe1d6] bg-white px-3 text-[#17372b] outline-none focus:border-[#087d3c]" />
    </label>}
    {hasEmail && <label className="block text-sm font-semibold text-[#315f48]">E-mail
      <input aria-label="E-mail" autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-1.5 h-11 w-full rounded-xl border border-[#cfe1d6] bg-white px-3 text-[#17372b] outline-none focus:border-[#087d3c]" />
    </label>}
    {hasPassword && <label className="block text-sm font-semibold text-[#315f48]">Senha
      <input aria-label="Senha" autoComplete={mode === "signin" ? "current-password" : "new-password"} type="password" minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} required className="mt-1.5 h-11 w-full rounded-xl border border-[#cfe1d6] bg-white px-3 text-[#17372b] outline-none focus:border-[#087d3c]" />
      {mode !== "signin" && <span className="mt-1.5 block text-xs font-normal text-[#678176]">Use pelo menos 12 caracteres.</span>}
    </label>}
    {mode === "reset-confirm" && !token && <p role="alert" className="rounded-xl bg-[#fff0ed] p-3 text-sm text-[#a1453f]">Este link de redefinição é inválido.</p>}
    {message && <p role="status" className="rounded-xl bg-[#edf9f1] p-3 text-sm text-[#087d3c]">{message}</p>}
    {error && <p role="alert" className="rounded-xl bg-[#fff0ed] p-3 text-sm text-[#a1453f]">{error}</p>}
    <button type="submit" disabled={pending || (mode === "reset-confirm" && !token)} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#087d3c] px-4 text-sm font-bold text-white transition-colors hover:bg-[#056c35] disabled:cursor-not-allowed disabled:opacity-60">
      {pending && <LoaderCircle className="h-4 w-4 animate-spin" />}{pending ? "Aguarde…" : copy[mode].action}
    </button>
  </form>;
}

export function PublicAuthCard({ mode, token }: PublicAuthFormProps) {
  return <main className="grid min-h-[100dvh] place-items-center bg-[#f4f8f5] px-4 py-10 text-[#17372b]">
    <section className="w-full max-w-md rounded-[2rem] border border-[#dcebe2] bg-white p-7 shadow-[0_24px_60px_-42px_rgba(12,100,53,.45)] sm:p-9">
      <Link href="/" className="text-sm font-bold text-[#087d3c]">← WhatSpent</Link>
      <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-[#079347]">Acesso gratuito</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{copy[mode].title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-[#678176]">Seu painel e seu agente pessoal, em uma conta protegida.</p>
      <PublicAuthForm mode={mode} token={token} />
      <div className="mt-6 text-sm text-[#678176]">
        {mode === "register" && <p>Já tem conta? <Link className="font-bold text-[#087d3c]" href="/entrar">Entrar</Link></p>}
        {mode === "signin" && <p><Link className="font-bold text-[#087d3c]" href="/recuperar-senha">Esqueci minha senha</Link> · <Link className="font-bold text-[#087d3c]" href="/cadastro">Criar conta</Link></p>}
        {mode === "reset" && <p><Link className="font-bold text-[#087d3c]" href="/entrar">Voltar para entrar</Link></p>}
      </div>
    </section>
  </main>;
}
