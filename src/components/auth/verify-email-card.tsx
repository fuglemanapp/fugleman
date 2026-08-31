"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function VerifyEmailCard({ token }: { token?: string }) {
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirmando seu e-mail…");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("Este link de confirmação é inválido.");
      return;
    }
    void fetch("/api/auth/verify-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) })
      .then(async (response) => {
        const body = await response.json().catch(() => ({})) as { error?: string };
        if (!response.ok) throw new Error(body.error || "Não foi possível confirmar este e-mail.");
        setState("success");
        setMessage("E-mail confirmado. Agora você já pode entrar.");
      })
      .catch((reason) => {
        setState("error");
        setMessage(reason instanceof Error ? reason.message : "Não foi possível confirmar este e-mail.");
      });
  }, [token]);

  return <main className="grid min-h-[100dvh] place-items-center bg-[#f4f8f5] px-4 py-10 text-[#17372b]"><section className="w-full max-w-md rounded-[2rem] border border-[#dcebe2] bg-white p-8 text-center shadow-[0_24px_60px_-42px_rgba(12,100,53,.45)]"><Link href="/" className="text-sm font-bold text-[#087d3c]">WhatSpent</Link><h1 className="mt-7 text-3xl font-semibold tracking-[-0.04em]">Confirmação de e-mail</h1>{state === "loading" && <LoaderCircle className="mx-auto mt-6 h-7 w-7 animate-spin text-[#087d3c]" />}<p className={`mt-5 text-sm leading-relaxed ${state === "error" ? "text-[#a1453f]" : "text-[#4f7562]"}`}>{message}</p>{state !== "loading" && <Link href="/entrar" className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-[#087d3c] px-5 text-sm font-bold text-white">Entrar no WhatSpent</Link>}</section></main>;
}
