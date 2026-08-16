"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { CalendarDays, CheckCircle2, LoaderCircle, RefreshCw } from "lucide-react";

const calendarScopes = ["https://www.googleapis.com/auth/calendar.events", "https://www.googleapis.com/auth/calendar.acl"];

type Connection = { connected: boolean; sharingConnected: boolean; email: string | null; error?: string };

export function GoogleCalendarIntegration() {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [message, setMessage] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    void fetch("/api/integrations/google-calendar")
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => setConnection(response.ok ? data : { connected: false, sharingConnected: false, email: null, error: data.error }));
  }, []);

  async function connect() {
    await signIn("google", { callbackUrl: "/dashboard/agenda/integracoes" }, {
      scope: `openid email profile ${calendarScopes.join(" ")}`,
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
    });
  }

  async function synchronize() {
    setIsSyncing(true); setMessage("");
    const response = await fetch("/api/integrations/google-calendar", { method: "POST" });
    const data = await response.json();
    setIsSyncing(false);
    setMessage(response.ok ? `Sincronização concluída: ${data.imported} importado(s) e ${data.exported} enviado(s).` : data.error || "Não foi possível sincronizar agora.");
  }

  if (!connection) return <article className="rounded-3xl border border-[#dcebe2] bg-white p-6 shadow-[0_18px_48px_-34px_rgba(12,100,53,0.42)]"><LoaderCircle className="h-5 w-5 animate-spin text-[#087d3c]" /></article>;
  const needsReconnect = connection.connected && !connection.sharingConnected;
  return <article className="rounded-3xl border border-[#dcebe2] bg-white p-6 shadow-[0_18px_48px_-34px_rgba(12,100,53,0.42)]"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf9f1] text-[#087d3c]"><CalendarDays className="h-5 w-5" /></span><div><h2 className="font-bold">Google Calendar</h2><span className={`text-sm font-semibold ${connection.connected && !needsReconnect ? "text-[#087d3c]" : "text-[#a67020]"}`}>{needsReconnect ? "Permissão adicional necessária" : connection.connected ? "Conectado" : "Aguardando conexão"}</span></div></div><p className="mt-5 leading-6 text-[#648273]">{connection.connected ? `Os novos compromissos serão enviados automaticamente ao calendário principal de ${connection.email || "sua conta Google"}.` : "Conecte sua conta para importar eventos futuros e enviar os novos compromissos ao Google Calendar."}</p>{needsReconnect && <p className="mt-4 rounded-2xl bg-[#fff9ed] p-3 text-sm leading-6 text-[#745c27]">Reconecte para permitir o compartilhamento de leitura da sua agenda familiar no Google Calendar.</p>}<div className="mt-5 flex flex-wrap gap-3">{(!connection.connected || needsReconnect) && <button onClick={() => void connect()} className="inline-flex items-center gap-2 rounded-xl bg-[#087d3c] px-4 py-2.5 text-sm font-bold text-white"><CheckCircle2 className="h-4 w-4" />{connection.connected ? "Reconectar Google Calendar" : "Conectar Google Calendar"}</button>}{connection.connected && <button onClick={() => void synchronize()} disabled={isSyncing} className="inline-flex items-center gap-2 rounded-xl border border-[#b9ddc6] bg-white px-4 py-2.5 text-sm font-bold text-[#087d3c] disabled:opacity-60">{isSyncing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}{isSyncing ? "Sincronizando…" : "Sincronizar agora"}</button>}</div>{message && <p className="mt-3 text-sm font-medium text-[#315f48]">{message}</p>}</article>;
}
