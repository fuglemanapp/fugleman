"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");

    if (!name.trim() || !email.trim() || !password) {
      setFormMessage("Preencha seu nome, e-mail e senha para criar a conta.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFormMessage(body.error || "Não foi possível criar a conta. Tente novamente.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!result || result.error) {
        setFormMessage("Conta criada. Entre com seu e-mail e senha para continuar.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setFormMessage("Não foi possível criar a conta. Verifique sua conexão e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-[#fbfdfb] px-5 py-6 text-[#17372b] sm:px-8">
      <div className="pointer-events-none absolute -left-44 -top-48 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#dff7e8] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-56 right-0 -z-10 h-[32rem] w-[32rem] rounded-full bg-[#edf9f1] blur-3xl" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link href="/" aria-label="Voltar para a página inicial do WhatSpent">
          <Image src="/logows-transparent.png" alt="WhatSpent" width={184} height={36} priority className="h-8 w-auto sm:h-9" />
        </Link>
        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-[#5d786a] transition-colors hover:text-[#087d3c]">
          <ArrowLeft className="h-4 w-4" />
          Já tenho conta
        </Link>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-8 py-10 lg:min-h-[calc(100dvh-5.5rem)] lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-12 lg:py-14">
        <aside className="relative overflow-hidden rounded-[2.25rem] border border-[#d5eddf] bg-[#effaf3] p-8 sm:p-10 lg:p-12">
          <div className="absolute -right-16 top-7 h-48 w-48 rounded-full border-[18px] border-[#d7f2e1]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c4e8d1] bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#087d3c]">
              <Sparkles className="h-3.5 w-3.5" />
              Comece agora
            </span>
            <h1 className="mt-7 max-w-md text-4xl font-semibold tracking-[-0.055em] text-[#17372b] sm:text-5xl">
              Organize sua vida a partir de uma conversa.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#5b786a]">
              Crie sua conta em menos de um minuto e deixe o WhatSpent cuidar da organização do seu dia.
            </p>
            <ul className="mt-9 space-y-4 text-sm font-medium text-[#315f48]">
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#079347]" />Sem cartão de crédito.</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#079347]" />Comece pelo que importa para você.</li>
            </ul>
          </div>
        </aside>

        <section className="rounded-[2.25rem] border border-[#dcebe2] bg-white p-7 shadow-[0_32px_90px_-48px_rgba(12,100,53,0.42)] sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#079347]">Sua conta WhatSpent</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#17372b] sm:text-4xl">Crie sua conta</h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#678176] sm:text-base">Use Google ou cadastre seus dados para começar.</p>

          <GoogleSignInButton className="mt-8 h-[3.25rem] w-full rounded-2xl border border-[#cfe5d8] bg-white px-5 text-base font-semibold text-[#214235] shadow-sm transition-colors hover:border-[#8dcfab] hover:bg-[#f5fcf7] focus-visible:ring-4 focus-visible:ring-[#dff6e7]">
            Criar conta com Google <ArrowRight className="ml-2 h-4 w-4" />
          </GoogleSignInButton>

          <div className="my-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#91a89a]"><span className="h-px flex-1 bg-[#e0ece5]" />ou<span className="h-px flex-1 bg-[#e0ece5]" /></div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[#315f48]">Seu nome</label>
              <div className="relative"><UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d9889]" /><input id="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Como prefere ser chamado?" className="h-[3.25rem] w-full rounded-2xl border border-[#d6e7dd] bg-[#fbfdfb] pl-11 pr-4 text-sm text-[#17372b] outline-none transition-colors placeholder:text-[#9aafa3] focus:border-[#079347] focus:ring-4 focus:ring-[#dff6e7]" /></div>
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#315f48]">E-mail</label>
              <div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d9889]" /><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" className="h-[3.25rem] w-full rounded-2xl border border-[#d6e7dd] bg-[#fbfdfb] pl-11 pr-4 text-sm text-[#17372b] outline-none transition-colors placeholder:text-[#9aafa3] focus:border-[#079347] focus:ring-4 focus:ring-[#dff6e7]" /></div>
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#315f48]">Crie uma senha</label>
              <div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d9889]" /><input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 8 caracteres" className="h-[3.25rem] w-full rounded-2xl border border-[#d6e7dd] bg-[#fbfdfb] pl-11 pr-12 text-sm text-[#17372b] outline-none transition-colors placeholder:text-[#9aafa3] focus:border-[#079347] focus:ring-4 focus:ring-[#dff6e7]" /><button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#718b7e] transition-colors hover:bg-[#edf8f1] hover:text-[#087d3c]" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
            </div>
            <button type="submit" disabled={isSubmitting} className="h-[3.25rem] w-full rounded-2xl bg-[#0b9d4e] text-sm font-semibold text-white shadow-[0_14px_28px_-14px_rgba(11,157,78,0.7)] transition-colors hover:bg-[#078940] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? "Criando sua conta..." : "Criar minha conta"}</button>
            <p className="flex items-start gap-2 text-xs leading-relaxed text-[#718b7e]" role="status"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#079347]" />{formMessage || "Ao criar a conta, você poderá entrar com este e-mail e senha."}</p>
          </form>

          <p className="mt-7 border-t border-[#e0ece5] pt-6 text-center text-sm text-[#678176]">Já tem uma conta? <Link href="/login" className="font-semibold text-[#078d45] transition-colors hover:text-[#056c35]">Entrar</Link></p>
          <p className="mt-4 flex justify-center gap-4 text-xs text-[#91a89a]"><Link href="/privacidade" className="transition-colors hover:text-[#078d45]">Privacidade</Link><Link href="/termos" className="transition-colors hover:text-[#078d45]">Termos</Link></p>
        </section>
      </div>
    </main>
  );
}
