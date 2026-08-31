"use client";

import { useState } from "react";

export function DeletionRequestCard() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitRequest() {
    setState("sending");
    setMessage("");
    const response = await fetch("/api/account/deletion-request", { method: "POST" });
    if (response.ok) {
      setState("done");
      setMessage("Solicitação recebida. Enviamos uma confirmação para o e-mail da sua conta.");
      return;
    }

    const body = await response.json().catch(() => null) as { error?: string } | null;
    setState("error");
    setMessage(body?.error || "Não foi possível enviar sua solicitação agora. Tente novamente mais tarde.");
  }

  return (
    <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-slate-800">
      <h2 className="text-lg font-bold">Solicitar exclusão</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        A solicitação não apaga seus dados imediatamente. O suporte confirma sua identidade antes de concluir a exclusão.
      </p>
      <button
        type="button"
        onClick={submitRequest}
        disabled={state === "sending" || state === "done"}
        className="mt-5 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "sending" ? "Enviando…" : state === "done" ? "Solicitação enviada" : "Solicitar exclusão da conta"}
      </button>
      {message ? <p className={`mt-4 text-sm ${state === "error" ? "text-red-700" : "text-emerald-700"}`}>{message}</p> : null}
    </section>
  );
}
