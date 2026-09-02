"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PUBLIC_BRAND_NAME } from "../../../lib/public-brand";

type InvitePreview = { name?: string; error?: string };

export default function InvitePage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    void fetch(`/api/financial/invites/preview?token=${encodeURIComponent(params.token)}`).then(async (response) => {
      const body = (await response.json()) as InvitePreview;

      if (!response.ok) {
        setError(body.error || "Convite indisponível.");
      } else {
        setName(body.name || "Família");
      }

      setLoading(false);
    });
  }, [params.token]);

  async function accept() {
    setAccepting(true);
    setError("");

    const response = await fetch("/api/financial/invites/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: params.token }),
    });
    const body = (await response.json()) as InvitePreview;

    if (!response.ok) {
      setError(body.error || "Não foi possível aceitar o convite.");
      setAccepting(false);
      return;
    }

    router.replace("/dashboard/conversas");
  }

  const unavailable = Boolean(error);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f8f5] p-5 text-[#17372b]">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_26px_70px_-42px_rgba(12,100,53,0.32)]">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#079347]">Convite {PUBLIC_BRAND_NAME}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
          {loading ? "Carregando convite…" : unavailable ? "Convite indisponível" : `Você foi convidada para ${name}.`}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#698477]">
          Ao aceitar, vocês poderão visualizar e organizar juntos as finanças familiares. Seus lançamentos pessoais continuam identificados pelo autor.
        </p>
        {unavailable ? (
          <>
            <p className="mt-5 rounded-xl bg-[#fff1f1] px-4 py-3 text-sm text-[#a93636]">{error}</p>
            <Link href="/login" className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#0b9d4e] px-5 text-sm font-bold text-white">
              Entrar no {PUBLIC_BRAND_NAME}
            </Link>
          </>
        ) : !loading ? (
          <button type="button" disabled={accepting} onClick={() => void accept()} className="mt-6 h-11 rounded-xl bg-[#0b9d4e] px-5 text-sm font-bold text-white disabled:opacity-60">
            {accepting ? "Aceitando…" : "Aceitar convite"}
          </button>
        ) : null}
      </section>
    </main>
  );
}
