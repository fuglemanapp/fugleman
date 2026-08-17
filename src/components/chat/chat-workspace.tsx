"use client";

import { upload } from "@vercel/blob/client";
import { Bot, CheckCircle2, FileAudio, LoaderCircle, Mic, Paperclip, Send, Smartphone, Square, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";

type Attachment = {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
};

type AssistantMessage = {
  id: string;
  role: "USER" | "ASSISTANT";
  text: string | null;
  createdAt: string;
  attachments: Attachment[];
};

type AssistantConversation = {
  id: string;
  messages: AssistantMessage[];
};

const MAX_FILE_SIZE = 25 * 1024 * 1024;

function formattedTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formattedSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function ChatWorkspace() {
  const [conversation, setConversation] = useState<AssistantConversation | null>(null);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [whatsAppPhone, setWhatsAppPhone] = useState<string | null>(null);
  const [phoneDraft, setPhoneDraft] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const loadConversation = useCallback(async () => {
    const response = await fetch("/api/assistant/conversation", { cache: "no-store" });
    const body = await response.json();

    if (!response.ok) {
      setError(body.error || "Não foi possível abrir seu assistente.");
      return;
    }

    setConversation(body.conversation);
  }, []);

  useEffect(() => {
    void loadConversation();
    void fetch("/api/assistant/whatsapp-phone", { cache: "no-store" })
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ response, body }) => {
        if (response.ok) {
          setWhatsAppPhone(body.phone || null);
          setPhoneDraft(body.phone || "");
        }
      })
      .catch(() => undefined);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadConversation();
      }
    }, 10_000);

    return () => window.clearInterval(timer);
  }, [loadConversation]);

  useEffect(() => () => {
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  function addFiles(fileList: FileList | null) {
    const selectedFiles = Array.from(fileList || []);
    const oversized = selectedFiles.find((file) => file.size > MAX_FILE_SIZE);

    if (oversized) {
      setError(`${oversized.name} ultrapassa o limite de 25 MB.`);
      return;
    }

    setFiles((current) => [...current, ...selectedFiles].slice(0, 10));
    setError("");
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("A gravação de áudio não é compatível com este navegador.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      });
      recorder.addEventListener("stop", () => {
        const type = recorder.mimeType || "audio/webm";
        const audio = new File([new Blob(chunks, { type })], `audio-${Date.now()}.webm`, { type });
        setFiles((current) => [...current, audio].slice(0, 10));
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        recorderRef.current = null;
        setRecording(false);
      });

      recorder.start();
      setRecording(true);
      setError("");
    } catch {
      setError("Não foi possível acessar o microfone. Verifique a permissão do navegador.");
    }
  }

  async function saveWhatsAppPhone(event: FormEvent) {
    event.preventDefault();
    if (savingPhone) return;
    setSavingPhone(true);
    setError("");

    try {
      const response = await fetch("/api/assistant/whatsapp-phone", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneDraft }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Não foi possível salvar seu número.");
      setWhatsAppPhone(body.phone);
      setPhoneDraft(body.phone);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível salvar seu número.");
    } finally {
      setSavingPhone(false);
    }
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!conversation || (!text.trim() && files.length === 0) || sending) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const attachmentIds: string[] = [];

      for (const file of files) {
        const blob = await upload(`assistant/${conversation.id}/${crypto.randomUUID()}-${file.name}`, file, {
          access: "private",
          handleUploadUrl: "/api/assistant/uploads",
          clientPayload: JSON.stringify({ conversationId: conversation.id }),
          contentType: file.type,
        });
        const response = await fetch("/api/assistant/uploads/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId: conversation.id, pathname: blob.pathname, fileName: file.name }),
        });
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.error || "Não foi possível preparar o anexo.");
        }

        attachmentIds.push(body.attachment.id);
      }

      const response = await fetch("/api/assistant/messages", {
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
      await loadConversation();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível enviar a mensagem.");
    } finally {
      setSending(false);
    }
  }

  const messages = conversation?.messages || [];

  return (
    <div className="min-h-[100dvh] bg-[#f4f8f5] text-[#17372b]">
      <DashboardNav activePath="/dashboard/conversas" />
      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-10">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#079347]">Seu assistente pessoal</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Converse com o WhatSpent.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#678176]">Registre gastos, entradas e compromissos em uma conversa privada. Este contato é só seu.</p>
        </header>

        <section className="mb-5 rounded-2xl border border-[#dcebe2] bg-white p-4 shadow-[0_16px_36px_-30px_rgba(12,100,53,.55)]">
          {whatsAppPhone ? <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf9f1] text-[#087d3c]"><CheckCircle2 className="h-5 w-5" /></span><div><p className="text-sm font-bold text-[#17372b]">Seu WhatsApp está identificado</p><p className="mt-0.5 text-sm text-[#678176]">Mensagens de <span className="font-semibold text-[#315f48]">{whatsAppPhone}</span> serão direcionadas somente ao seu assistente.</p></div></div><button type="button" onClick={() => setWhatsAppPhone(null)} className="text-left text-sm font-bold text-[#087d3c] hover:text-[#056c35]">Alterar número</button></div> : <form onSubmit={saveWhatsAppPhone} className="flex flex-col gap-3 lg:flex-row lg:items-end"><div className="flex min-w-0 flex-1 items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf9f1] text-[#087d3c]"><Smartphone className="h-5 w-5" /></span><div className="min-w-0"><p className="text-sm font-bold text-[#17372b]">Ligue seu WhatsApp pessoal ao seu agente</p><p className="mt-0.5 text-sm text-[#678176]">Informe o número do seu celular com DDI. Ele só será usado para reconhecer você ao falar com o WhatSpent no WhatsApp.</p></div></div><div className="flex flex-col gap-2 sm:flex-row"><input value={phoneDraft} onChange={(event) => setPhoneDraft(event.target.value)} inputMode="tel" placeholder="+5511999999999" className="h-10 rounded-xl border border-[#cfe1d6] px-3 text-sm outline-none placeholder:text-[#91a59b] focus:border-[#69b783]" /><button disabled={savingPhone || !phoneDraft.trim()} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#087d3c] px-4 text-sm font-bold text-white hover:bg-[#056c35] disabled:opacity-50">{savingPhone && <LoaderCircle className="h-4 w-4 animate-spin" />}{savingPhone ? "Salvando…" : "Vincular"}</button></div></form>}
        </section>

        {error && <p role="alert" className="mb-4 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#a1453f]">{error}</p>}

        <section className="flex min-h-[calc(100dvh-16rem)] flex-col overflow-hidden rounded-[2rem] border border-[#dcebe2] bg-white shadow-[0_26px_70px_-48px_rgba(12,100,53,.45)]">
          <div className="flex items-center gap-3 border-b border-[#e4eee7] bg-[#fbfdfb] px-5 py-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#087d3c] text-white shadow-[0_12px_24px_-15px_rgba(8,125,60,.8)]"><Bot className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="font-bold tracking-[-0.02em]">WhatSpent</p>
              <p className="text-xs text-[#4f946d]">Assistente financeiro · disponível</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(135deg,#f8fcf9,#eef7f1)] p-4 sm:p-6">
            {messages.length === 0 && <article className="max-w-[34rem] rounded-[1.35rem] rounded-tl-md border border-[#dcebe2] bg-white px-4 py-3 shadow-sm"><p className="text-sm leading-relaxed text-[#315f48]">Olá! Eu sou o WhatSpent. Me conte uma despesa, entrada ou compromisso — por exemplo: <span className="font-semibold">“gastei R$ 42 no mercado hoje”</span>.</p><time className="mt-2 block text-[10px] text-[#91a59b]">agora</time></article>}
            {messages.map((message) => {
              const isUser = message.role === "USER";
              return <article key={message.id} className={`max-w-[88%] rounded-[1.35rem] px-4 py-3 shadow-sm sm:max-w-[75%] ${isUser ? "ml-auto rounded-tr-md bg-[#087d3c] text-white" : "mr-auto rounded-tl-md border border-[#dcebe2] bg-white text-[#17372b]"}`}>
                {message.text && <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>}
                {message.attachments.map((attachment) => <a key={attachment.id} href={`/api/assistant/attachments/${attachment.id}`} target="_blank" rel="noreferrer" className={`mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${isUser ? "bg-white/15 text-white hover:bg-white/20" : "bg-[#edf8f1] text-[#087d3c] hover:bg-[#e0f3e7]"}`}><Paperclip className="h-3.5 w-3.5" /><span className="min-w-0 flex-1 truncate">{attachment.fileName}</span><span className="shrink-0 opacity-75">{formattedSize(attachment.size)}</span></a>)}
                <time className={`mt-2 block text-right text-[10px] ${isUser ? "text-white/70" : "text-[#91a59b]"}`}>{formattedTime(message.createdAt)}</time>
              </article>;
            })}
            {sending && <div className="mr-auto inline-flex items-center gap-2 rounded-xl rounded-tl-md border border-[#dcebe2] bg-white px-3 py-2 text-xs text-[#678176]"><LoaderCircle className="h-3.5 w-3.5 animate-spin" />WhatSpent está pensando…</div>}
          </div>

          <form onSubmit={send} className="border-t border-[#e4eee7] bg-white p-3 sm:p-4">
            {files.length > 0 && <div className="mb-3 flex flex-wrap gap-2">{files.map((file, index) => <div key={`${file.name}-${index}`} className="flex max-w-full items-center gap-2 rounded-xl bg-[#edf8f1] px-3 py-2 text-xs font-semibold text-[#315f48]"><FileAudio className="h-3.5 w-3.5 shrink-0 text-[#087d3c]" /><span className="max-w-48 truncate">{file.name}</span><span className="text-[#789083]">{formattedSize(file.size)}</span><button type="button" onClick={() => removeFile(index)} className="grid h-5 w-5 place-items-center rounded-full text-[#638072] hover:bg-white hover:text-[#a1453f]" aria-label={`Remover ${file.name}`}><X className="h-3.5 w-3.5" /></button></div>)}</div>}
            <div className="flex items-end gap-2">
              <label className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-xl border border-[#dcebe2] text-[#087d3c] transition-colors hover:bg-[#edf8f1]" title="Enviar arquivo, imagem ou áudio"><Paperclip className="h-4 w-4" /><input type="file" multiple className="hidden" accept="image/*,audio/*,video/*,application/pdf,.txt,.csv,.xlsx,.doc,.docx,.ofx,.json" onChange={(event) => { addFiles(event.target.files); event.currentTarget.value = ""; }} /></label>
              <button type="button" onClick={() => void toggleRecording()} className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-colors ${recording ? "border-[#cf5149] bg-[#fff0ed] text-[#b03f38]" : "border-[#dcebe2] text-[#087d3c] hover:bg-[#edf8f1]"}`} aria-label={recording ? "Parar gravação" : "Gravar áudio"} title={recording ? "Parar gravação" : "Gravar áudio"}>{recording ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-4 w-4" />}</button>
              <textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={4_000} rows={1} placeholder={recording ? "Gravando áudio…" : "Mensagem"} className="max-h-32 min-h-11 flex-1 resize-y rounded-xl border border-[#dcebe2] px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[#91a59b] focus:border-[#69b783]" />
              <button disabled={sending || (!text.trim() && files.length === 0)} aria-label="Enviar mensagem" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#087d3c] text-white transition-colors hover:bg-[#056c35] disabled:cursor-not-allowed disabled:opacity-45"><Send className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 px-1 text-[11px] text-[#789083]">Envie texto, imagens, documentos ou áudio de até 25 MB. Áudios ficam anexados com segurança; transcrição automática será adicionada depois.</p>
          </form>
        </section>
      </main>
    </div>
  );
}
