"use client";

import { Copy, Paperclip, Send, UserRound, Users } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { upload } from "@vercel/blob/client";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";

type Person = { id: string; name: string | null; email: string | null; image: string | null };
type Conversation = {
  id: string;
  teamId: string;
  kind: string;
  title: string;
  updatedAt: string;
  lastMessage: { text: string | null; createdAt: string; senderName: string | null } | null;
  participants: Person[];
};
type Message = {
  id: string;
  text: string | null;
  createdAt: string;
  sender: Person;
  attachments: { id: string; fileName: string; contentType: string; size: number }[];
};

export function ChatWorkspace() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [familyName, setFamilyName] = useState("Nossa família");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [creatingFamily, setCreatingFamily] = useState(false);

  const selected = conversations.find((item) => item.id === selectedId) || null;

  const loadConversations = useCallback(async () => {
    const response = await fetch("/api/chat/conversations", { cache: "no-store" });
    const body = await response.json();

    if (!response.ok) {
      setError(body.error || "Não foi possível carregar as conversas.");
      return;
    }

    setCurrentUserId(body.currentUserId || "");
    setConversations(body.conversations || []);
    setSelectedId((current) => current || body.conversations?.[0]?.id || "");
  }, []);

  const loadMessages = useCallback(async () => {
    if (!selectedId) {
      return;
    }

    const response = await fetch(`/api/chat/conversations/${selectedId}/messages`, { cache: "no-store" });
    const body = await response.json();

    if (response.ok) {
      setMessages(body.messages || []);
      void fetch(`/api/chat/conversations/${selectedId}/read`, { method: "POST" });
    }
  }, [selectedId]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    void loadMessages();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadMessages();
      }
    }, 8_000);

    return () => window.clearInterval(timer);
  }, [loadMessages]);

  const people = useMemo(() => {
    const family = conversations.find((item) => item.kind === "FAMILY");
    return (family?.participants || []).filter((person) => person.id !== currentUserId);
  }, [conversations, currentUserId]);

  async function createFamily(event: FormEvent) {
    event.preventDefault();
    const name = familyName.trim();

    if (name.length < 2) {
      setError("Escolha um nome para a família.");
      return;
    }

    setCreatingFamily(true);
    setError("");

    try {
      const workspaceResponse = await fetch("/api/financial/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const workspaceBody = await workspaceResponse.json();

      if (!workspaceResponse.ok) {
        throw new Error(workspaceBody.error || "Não foi possível criar a família.");
      }

      const teamId = String(workspaceBody.workspace?.key || "").replace(/^team:/, "");
      const inviteResponse = await fetch("/api/financial/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      const inviteBody = await inviteResponse.json();

      if (!inviteResponse.ok) {
        throw new Error(inviteBody.error || "A família foi criada, mas não foi possível gerar o convite.");
      }

      setInviteUrl(inviteBody.invite.url || "");
      await loadConversations();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível criar a família.");
    } finally {
      setCreatingFamily(false);
    }
  }

  async function copyInvite() {
    if (!inviteUrl) {
      return;
    }

    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2_000);
  }

  async function startDirect(person: Person) {
    const family = conversations.find((item) => item.kind === "FAMILY");
    if (!family) {
      return;
    }

    const response = await fetch("/api/chat/conversations/direct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId: family.teamId, recipientId: person.id }),
    });
    const body = await response.json();

    if (!response.ok) {
      setError(body.error || "Não foi possível abrir a conversa.");
      return;
    }

    await loadConversations();
    setSelectedId(body.conversation.id);
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!selected || (!text.trim() && !files.length)) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const attachmentIds: string[] = [];

      for (const file of files) {
        if (file.size > 25 * 1024 * 1024) {
          throw new Error(`${file.name} ultrapassa 25 MB.`);
        }

        const blob = await upload(`chat/${selected.id}/${file.name}`, file, {
          access: "private",
          handleUploadUrl: "/api/chat/uploads",
          clientPayload: JSON.stringify({ conversationId: selected.id }),
          contentType: file.type,
        });
        const response = await fetch("/api/chat/uploads/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId: selected.id, pathname: blob.pathname, fileName: file.name }),
        });
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.error || "Não foi possível preparar o anexo.");
        }

        attachmentIds.push(body.attachment.id);
      }

      const response = await fetch(`/api/chat/conversations/${selected.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, attachmentIds }),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || "Não foi possível enviar a mensagem.");
      }

      setText("");
      setFiles([]);
      await Promise.all([loadMessages(), loadConversations()]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível enviar a mensagem.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#f4f8f5] text-[#17372b]">
      <DashboardNav activePath="/dashboard/conversas" />
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-10">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#079347]">Conexão da família</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Conversas que ficam entre vocês.</h1>
          <p className="mt-2 text-sm text-[#678176]">Chat privado do WhatSpent. As mensagens e anexos só podem ser vistos pelos membros da Família.</p>
        </header>

        {error && <p className="mb-4 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#a1453f]">{error}</p>}

        {inviteUrl && <section className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#cfe5d6] bg-white p-5 shadow-[0_18px_40px_-34px_rgba(12,100,53,.45)] sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-[#17372b]">Família criada. Falta só convidar a outra pessoa.</p><p className="mt-1 text-sm text-[#678176]">Copie o link e envie para ela entrar ou criar a conta e aceitar o convite.</p></div><button type="button" onClick={() => void copyInvite()} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#087d3c] px-4 text-sm font-bold text-white hover:bg-[#056c35]"><Copy className="h-4 w-4" />{copied ? "Link copiado" : "Copiar convite"}</button></section>}

        <div className="grid min-h-[38rem] overflow-hidden rounded-[2rem] border border-[#dcebe2] bg-white shadow-[0_26px_70px_-48px_rgba(12,100,53,.45)] md:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="border-b border-[#e4eee7] bg-[#fbfdfb] p-3 md:border-b-0 md:border-r">
            <p className="px-3 py-2 text-xs font-bold uppercase tracking-[.12em] text-[#718b7e]">Conversas</p>
            {conversations.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`mt-1 w-full rounded-xl px-3 py-3 text-left ${item.id === selectedId ? "bg-[#e8f7ec]" : "hover:bg-[#f1f8f3]"}`}><span className="flex items-center gap-2 text-sm font-bold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#087d3c]">{item.kind === "FAMILY" ? <Users className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}</span>{item.title}</span><span className="mt-1 block truncate text-xs text-[#789083]">{item.lastMessage?.text || "Comece a conversa"}</span></button>)}
            <div className="mt-5 border-t border-[#e4eee7] pt-4"><p className="px-3 text-xs font-bold uppercase tracking-[.12em] text-[#718b7e]">Privadas</p>{people.map((person) => <button key={person.id} type="button" onClick={() => void startDirect(person)} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#315f48] hover:bg-[#f1f8f3]"><UserRound className="h-4 w-4 text-[#087d3c]" />{person.name || person.email}</button>)}</div>
          </aside>

          <section className="flex min-h-[30rem] flex-col">
            {selected ? <><div className="border-b border-[#e4eee7] px-5 py-4"><p className="font-bold">{selected.title}</p><p className="text-xs text-[#789083]">{selected.kind === "FAMILY" ? "Todos os membros podem participar" : "Conversa privada"}</p></div><div className="flex-1 space-y-3 overflow-y-auto bg-[#f7fbf8] p-5">{messages.map((message) => <article key={message.id} className="max-w-[85%] rounded-2xl bg-white p-3 shadow-sm"><p className="text-xs font-bold text-[#087d3c]">{message.sender.name || message.sender.email}</p>{message.text && <p className="mt-1 whitespace-pre-wrap text-sm">{message.text}</p>}{message.attachments.map((attachment) => <a key={attachment.id} href={`/api/chat/attachments/${attachment.id}`} target="_blank" rel="noreferrer" className="mt-2 block rounded-lg bg-[#edf8f1] px-3 py-2 text-xs font-semibold text-[#087d3c]">📎 {attachment.fileName}</a>)}<time className="mt-2 block text-[10px] text-[#91a59b]">{new Date(message.createdAt).toLocaleString("pt-BR")}</time></article>)}</div><form onSubmit={send} className="border-t border-[#e4eee7] p-3"><div className="flex gap-2"><label className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl border border-[#dcebe2] text-[#087d3c]"><Paperclip className="h-4 w-4" /><input type="file" multiple className="hidden" onChange={(event) => setFiles(Array.from(event.target.files || []))} /></label><input value={text} onChange={(event) => setText(event.target.value)} maxLength={4_000} placeholder="Escreva uma mensagem" className="min-w-0 flex-1 rounded-xl border border-[#dcebe2] px-3 text-sm outline-none focus:border-[#69b783]" /><button disabled={sending} aria-label="Enviar mensagem" className="grid h-11 w-11 place-items-center rounded-xl bg-[#087d3c] text-white disabled:opacity-50"><Send className="h-4 w-4" /></button></div>{files.length > 0 && <p className="mt-2 truncate text-xs text-[#678176]">{files.map((file) => file.name).join(", ")}</p>}</form></> : <div className="grid flex-1 place-items-center p-6 sm:p-10"><form onSubmit={createFamily} className="w-full max-w-md rounded-[1.75rem] border border-[#dcebe2] bg-[#fbfdfb] p-6 text-center shadow-[0_22px_52px_-42px_rgba(12,100,53,.55)]"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e8f7ec] text-[#087d3c]"><Users className="h-6 w-6" /></span><h2 className="mt-4 text-xl font-semibold tracking-[-0.035em]">Crie a sua Família</h2><p className="mt-2 text-sm leading-relaxed text-[#678176]">Você terá um link seguro para convidar sua esposa. Só os dois membros poderão acessar as conversas.</p><label className="mt-5 block text-left text-sm font-semibold text-[#315f48]">Nome da família<input required minLength={2} maxLength={80} value={familyName} onChange={(event) => setFamilyName(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-[#cfe1d6] bg-white px-3 text-sm outline-none focus:border-[#087d3c]" /></label><button disabled={creatingFamily} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#087d3c] px-4 text-sm font-bold text-white hover:bg-[#056c35] disabled:opacity-60">{creatingFamily ? "Criando…" : "Criar família e gerar convite"}</button></form></div>}
          </section>
        </div>
      </main>
    </div>
  );
}
